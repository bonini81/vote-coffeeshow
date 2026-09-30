import { HttpsError } from 'firebase-functions/v2/https';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { contar, dbAdmin, limpiarFirestore, sembrarCafeterias, votosDe } from '../test/emu.js';
import { hmacHex } from './hash.js';
import { procesarVoto } from './procesarVoto.js';

const db = dbAdmin();
const PEPPER = 'pepper-de-prueba';
const IP = '203.0.113.7';

const CEDULA = '1712345675';
const OTRAS_CEDULAS = ['0102030400', '0923456784', '2411111111'];

const data = (extra = {}) => ({
  nombre: 'Ana',
  apellido: 'Pérez',
  email: 'ana@example.com',
  cedula: CEDULA,
  cafeteriaId: 'stratto',
  turnstileToken: 'token-ok',
  consentimiento: true,
  ...extra,
});

const aprobar = () => vi.fn().mockResolvedValue(true);

const votar = (datos, deps = {}) =>
  procesarVoto(
    { data: datos, ip: IP, userAgent: 'vitest' },
    { db, pepper: PEPPER, turnstileSecret: 's', verificar: aprobar(), ...deps },
  );

const codigoDe = async (promesa) => {
  try {
    await promesa;
  } catch (error) {
    return error.code;
  }
  return null;
};

const volcarTodo = async () => {
  const colecciones = ['votos', 'votosPorEmail', 'votosPorCedula', 'rateLimit', 'conteos'];
  const docs = [];
  for (const nombre of colecciones) {
    const snap = await db.collection(nombre).get();
    snap.forEach((d) => docs.push({ ruta: d.ref.path, ...d.data() }));
  }
  return JSON.stringify(docs);
};

beforeEach(async () => {
  await limpiarFirestore();
  await sembrarCafeterias(db);
});

describe('procesarVoto', () => {
  it('registra un voto válido y normaliza el email', async () => {
    const resultado = await votar(data({ email: '  Ana@Example.COM ' }));

    expect(resultado).toEqual({ ok: true });
    expect((await db.doc('votosPorEmail/ana@example.com').get()).exists).toBe(true);
    expect(await votosDe(db, 'stratto')).toBe(1);
  });

  it('nunca guarda la cédula ni la IP en claro', async () => {
    await votar(data());
    const volcado = await volcarTodo();

    expect(volcado).not.toContain(CEDULA);
    expect(volcado).not.toContain(IP);
    expect(volcado).toContain(hmacHex(CEDULA, PEPPER));
    expect((await db.doc(`votosPorCedula/${hmacHex(CEDULA, PEPPER)}`).get()).exists).toBe(true);
  });

  it('mismo email dos veces: el segundo falla con already-exists', async () => {
    await votar(data());
    const codigo = await codigoDe(votar(data({ cedula: OTRAS_CEDULAS[0] })));

    expect(codigo).toBe('already-exists');
    expect(await contar(db, 'votos')).toBe(1);
  });

  it('misma cédula con otro email: falla con already-exists', async () => {
    await votar(data());
    const codigo = await codigoDe(votar(data({ email: 'otra@example.com' })));

    expect(codigo).toBe('already-exists');
    expect(await contar(db, 'votos')).toBe(1);
  });

  it('el mensaje de duplicado no revela qué campo se repite', async () => {
    await votar(data());
    const porEmail = await votar(data({ cedula: OTRAS_CEDULAS[0] })).catch((e) => e.message);
    const porCedula = await votar(data({ email: 'otra@example.com' })).catch((e) => e.message);

    expect(porEmail).toBe(porCedula);
    expect(porEmail).not.toMatch(/correo|email|cédula/i);
  });

  it('dos requests simultáneos con el mismo email: pasa solo uno', async () => {
    const resultados = await Promise.allSettled([
      votar(data({ cedula: OTRAS_CEDULAS[0] })),
      votar(data({ cedula: OTRAS_CEDULAS[1] })),
      votar(data({ cedula: OTRAS_CEDULAS[2] })),
      votar(data({ cedula: CEDULA })),
    ]);

    expect(resultados.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
    expect(await contar(db, 'votos')).toBe(1);
    expect(await votosDe(db, 'stratto')).toBe(1);
  });

  it('cédula inválida: invalid-argument y no se guarda nada', async () => {
    const codigo = await codigoDe(votar(data({ cedula: '1712345676' })));

    expect(codigo).toBe('invalid-argument');
    expect(await contar(db, 'votos')).toBe(0);
    expect(await contar(db, 'votosPorEmail')).toBe(0);
    expect(await contar(db, 'votosPorCedula')).toBe(0);
  });

  it('email inválido: invalid-argument y no se guarda nada', async () => {
    const codigo = await codigoDe(votar(data({ email: 'no-es-un-email' })));

    expect(codigo).toBe('invalid-argument');
    expect(await contar(db, 'votos')).toBe(0);
  });

  it('token de Turnstile inválido: failed-precondition, sin voto ni consumo de rate limit', async () => {
    const verificar = vi.fn().mockResolvedValue(false);
    const codigo = await codigoDe(votar(data(), { verificar }));

    expect(codigo).toBe('failed-precondition');
    expect(verificar).toHaveBeenCalledOnce();
    expect(await contar(db, 'votos')).toBe(0);
    expect(await contar(db, 'rateLimit')).toBe(0);
  });

  it('si Cloudflare no responde el voto no se registra (falla cerrado)', async () => {
    const verificar = vi.fn().mockRejectedValue(new HttpsError('unavailable', 'sin captcha'));
    const codigo = await codigoDe(votar(data(), { verificar }));

    expect(codigo).toBe('unavailable');
    expect(await contar(db, 'votos')).toBe(0);
  });

  it('sin consentimiento rechaza antes de consultar a Turnstile', async () => {
    const verificar = vi.fn().mockResolvedValue(true);
    const codigo = await codigoDe(votar(data({ consentimiento: false }), { verificar }));

    expect(codigo).toBe('invalid-argument');
    expect(verificar).not.toHaveBeenCalled();
  });

  it('rate limit por IP: el intento que excede el límite recibe resource-exhausted', async () => {
    const deps = { limitePorHora: 2 };
    await votar(data({ email: 'a@example.com', cedula: OTRAS_CEDULAS[0] }), deps);
    await votar(data({ email: 'b@example.com', cedula: OTRAS_CEDULAS[1] }), deps);
    const codigo = await codigoDe(
      votar(data({ email: 'c@example.com', cedula: OTRAS_CEDULAS[2] }), deps),
    );

    expect(codigo).toBe('resource-exhausted');
    expect(await contar(db, 'votos')).toBe(2);
  });

  it('el rate limit se reinicia en la ventana siguiente', async () => {
    const ahora = Date.UTC(2026, 9, 16, 12, 0, 0);
    const deps = { limitePorHora: 1, ahora };
    await votar(data({ email: 'a@example.com', cedula: OTRAS_CEDULAS[0] }), deps);

    const mismaHora = await codigoDe(
      votar(data({ email: 'b@example.com', cedula: OTRAS_CEDULAS[1] }), deps),
    );
    expect(mismaHora).toBe('resource-exhausted');

    const horaSiguiente = await codigoDe(
      votar(data({ email: 'b@example.com', cedula: OTRAS_CEDULAS[1] }), {
        ...deps,
        ahora: ahora + 61 * 60 * 1000,
      }),
    );
    expect(horaSiguiente).toBeNull();
  });
});
