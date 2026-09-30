import { beforeEach, describe, expect, it } from 'vitest';
import { contar, dbAdmin, limpiarFirestore, sembrarCafeterias, votosDe } from '../test/emu.js';
import { registrarVoto } from './votar.js';

const db = dbAdmin();

const voto = (extra = {}) => ({
  cafeteriaId: 'stratto',
  nombre: 'Ana',
  apellido: 'Pérez',
  email: 'ana@example.com',
  cedulaHash: 'hash-1',
  ipHash: 'ip-1',
  userAgent: 'vitest',
  ...extra,
});

beforeEach(async () => {
  await limpiarFirestore();
  await sembrarCafeterias(db);
});

describe('registrarVoto (transacción de unicidad)', () => {
  it('crea el voto, los documentos de unicidad y suma al contador', async () => {
    const votoId = await registrarVoto(db, voto());

    const doc = (await db.doc(`votos/${votoId}`).get()).data();
    expect(doc).toMatchObject({
      cafeteriaId: 'stratto',
      emailNormalizado: 'ana@example.com',
      cedulaHash: 'hash-1',
      ipHash: 'ip-1',
    });
    expect(doc.creadoEn).toBeDefined();

    const porEmail = (await db.doc('votosPorEmail/ana@example.com').get()).data();
    const porCedula = (await db.doc('votosPorCedula/hash-1').get()).data();
    expect(porEmail).toMatchObject({ cafeteriaId: 'stratto', votoId });
    expect(porCedula).toMatchObject({ cafeteriaId: 'stratto', votoId });
    expect(await votosDe(db, 'stratto')).toBe(1);
  });

  it('rechaza el mismo email dos veces', async () => {
    await registrarVoto(db, voto());
    await expect(registrarVoto(db, voto({ cedulaHash: 'hash-2' }))).rejects.toMatchObject({
      code: 'already-exists',
    });
    expect(await contar(db, 'votos')).toBe(1);
    expect(await votosDe(db, 'stratto')).toBe(1);
  });

  it('rechaza la misma cédula con otro email y no deja rastro del segundo intento', async () => {
    await registrarVoto(db, voto());
    await expect(registrarVoto(db, voto({ email: 'otra@example.com' }))).rejects.toMatchObject({
      code: 'already-exists',
    });

    expect(await contar(db, 'votos')).toBe(1);
    expect((await db.doc('votosPorEmail/otra@example.com').get()).exists).toBe(false);
    expect(await votosDe(db, 'stratto')).toBe(1);
  });

  it('un voto es uno en total: no permite votar por otra cafetería con los mismos datos', async () => {
    await registrarVoto(db, voto());
    await expect(registrarVoto(db, voto({ cafeteriaId: 'isvar' }))).rejects.toMatchObject({
      code: 'already-exists',
    });
    expect(await votosDe(db, 'isvar')).toBe(0);
  });

  it('con requests simultáneos con el mismo email pasa solo uno', async () => {
    const intentos = Array.from({ length: 8 }, (_, i) =>
      registrarVoto(db, voto({ cedulaHash: `hash-${i}` })),
    );
    const resultados = await Promise.allSettled(intentos);

    expect(resultados.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
    for (const r of resultados.filter((r) => r.status === 'rejected')) {
      expect(r.reason.code).toBe('already-exists');
    }
    expect(await contar(db, 'votos')).toBe(1);
    expect(await contar(db, 'votosPorEmail')).toBe(1);
    expect(await contar(db, 'votosPorCedula')).toBe(1);
    expect(await votosDe(db, 'stratto')).toBe(1);
  });

  it('con requests simultáneos con la misma cédula pasa solo uno', async () => {
    const intentos = Array.from({ length: 8 }, (_, i) =>
      registrarVoto(db, voto({ email: `persona${i}@example.com` })),
    );
    const resultados = await Promise.allSettled(intentos);

    expect(resultados.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
    expect(await contar(db, 'votos')).toBe(1);
    expect(await contar(db, 'votosPorEmail')).toBe(1);
    expect(await votosDe(db, 'stratto')).toBe(1);
  });

  it('votantes distintos simultáneos suman todos al contador', async () => {
    await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        registrarVoto(db, voto({ email: `p${i}@example.com`, cedulaHash: `h${i}` })),
      ),
    );
    expect(await contar(db, 'votos')).toBe(10);
    expect(await votosDe(db, 'stratto')).toBe(10);
  });

  it('rechaza una cafetería inexistente sin crear nada', async () => {
    await expect(registrarVoto(db, voto({ cafeteriaId: 'no-existe' }))).rejects.toMatchObject({
      code: 'not-found',
    });
    expect(await contar(db, 'votos')).toBe(0);
    expect(await contar(db, 'votosPorEmail')).toBe(0);
    expect(await contar(db, 'votosPorCedula')).toBe(0);
  });
});
