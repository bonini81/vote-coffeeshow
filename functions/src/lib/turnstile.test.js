import { describe, expect, it, vi } from 'vitest';
import { verificarTurnstile } from './turnstile.js';

const respuesta = (cuerpo, ok = true) => ({ ok, json: async () => cuerpo });

describe('verificarTurnstile', () => {
  it('devuelve true cuando Cloudflare confirma el token', async () => {
    const fetchFalso = vi.fn().mockResolvedValue(respuesta({ success: true }));
    await expect(
      verificarTurnstile({ token: 't', secret: 's', ip: '1.2.3.4' }, fetchFalso),
    ).resolves.toBe(true);

    const [url, opciones] = fetchFalso.mock.calls[0];
    expect(url).toBe('https://challenges.cloudflare.com/turnstile/v0/siteverify');
    expect(opciones.method).toBe('POST');
    expect(opciones.body.get('secret')).toBe('s');
    expect(opciones.body.get('response')).toBe('t');
    expect(opciones.body.get('remoteip')).toBe('1.2.3.4');
  });

  it('devuelve false cuando Cloudflare rechaza el token', async () => {
    const fetchFalso = vi
      .fn()
      .mockResolvedValue(respuesta({ success: false, 'error-codes': ['invalid-input-response'] }));
    await expect(verificarTurnstile({ token: 't', secret: 's' }, fetchFalso)).resolves.toBe(false);
  });

  it('no envía remoteip si no hay IP', async () => {
    const fetchFalso = vi.fn().mockResolvedValue(respuesta({ success: true }));
    await verificarTurnstile({ token: 't', secret: 's' }, fetchFalso);
    expect(fetchFalso.mock.calls[0][1].body.has('remoteip')).toBe(false);
  });

  it('lanza unavailable si falla la red', async () => {
    const fetchFalso = vi.fn().mockRejectedValue(new Error('sin red'));
    await expect(verificarTurnstile({ token: 't', secret: 's' }, fetchFalso)).rejects.toMatchObject(
      {
        code: 'unavailable',
      },
    );
  });

  it('lanza unavailable si Cloudflare responde con error HTTP', async () => {
    const fetchFalso = vi.fn().mockResolvedValue(respuesta({}, false));
    await expect(verificarTurnstile({ token: 't', secret: 's' }, fetchFalso)).rejects.toMatchObject(
      {
        code: 'unavailable',
      },
    );
  });
});
