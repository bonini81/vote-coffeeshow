import { readFileSync } from 'node:fs';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { PROJECT_ID } from './test/emu.js';

let env;

const COLECCIONES = [
  'cafeterias',
  'conteos',
  'votos',
  'votosPorEmail',
  'votosPorCedula',
  'rateLimit',
];

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules: readFileSync(new URL('../../firestore.rules', import.meta.url), 'utf8') },
  });
});

afterAll(async () => {
  await env.cleanup();
});

beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (contexto) => {
    const db = contexto.firestore();
    for (const nombre of COLECCIONES) {
      await db.doc(`${nombre}/doc1`).set({ votos: 1, nombre: 'x' });
    }
  });
});

const anonimo = () => env.unauthenticatedContext().firestore();
const usuario = () => env.authenticatedContext('u1').firestore();
const admin = () => env.authenticatedContext('a1', { admin: true }).firestore();
const adminFalso = () => env.authenticatedContext('a2', { admin: false }).firestore();

describe('lecturas', () => {
  it('cafeterias es público', async () => {
    await assertSucceeds(anonimo().doc('cafeterias/doc1').get());
    await assertSucceeds(anonimo().collection('cafeterias').get());
  });

  it.each(['conteos', 'votos'])('%s solo lo lee un admin', async (coleccion) => {
    await assertFails(anonimo().doc(`${coleccion}/doc1`).get());
    await assertFails(usuario().doc(`${coleccion}/doc1`).get());
    await assertFails(adminFalso().doc(`${coleccion}/doc1`).get());
    await assertSucceeds(admin().doc(`${coleccion}/doc1`).get());
  });

  it.each(['votosPorEmail', 'votosPorCedula', 'rateLimit'])(
    '%s no se puede leer ni siquiera siendo admin',
    async (coleccion) => {
      await assertFails(anonimo().doc(`${coleccion}/doc1`).get());
      await assertFails(admin().doc(`${coleccion}/doc1`).get());
    },
  );

  it('el público no puede listar votos', async () => {
    await assertFails(anonimo().collection('votos').get());
  });
});

describe('escrituras: el cliente nunca escribe', () => {
  const contextos = { anonimo, usuario, admin };

  for (const [quien, contexto] of Object.entries(contextos)) {
    for (const coleccion of COLECCIONES) {
      it(`${quien} no puede crear en ${coleccion}`, async () => {
        await assertFails(contexto().doc(`${coleccion}/nuevo`).set({ votos: 1 }));
      });

      it(`${quien} no puede modificar ni borrar en ${coleccion}`, async () => {
        await assertFails(contexto().doc(`${coleccion}/doc1`).update({ votos: 999 }));
        await assertFails(contexto().doc(`${coleccion}/doc1`).delete());
      });
    }
  }

  it('el cliente no puede escribir en colecciones no declaradas', async () => {
    await assertFails(admin().doc('otra/doc1').set({ a: 1 }));
    await assertFails(anonimo().doc('otra/doc1').get());
  });

  it('los datos sembrados siguen intactos tras los intentos', async () => {
    await assertFails(anonimo().doc('conteos/doc1').update({ votos: 999 }));
    await env.withSecurityRulesDisabled(async (contexto) => {
      const doc = await contexto.firestore().doc('conteos/doc1').get();
      expect(doc.data().votos).toBe(1);
    });
  });
});
