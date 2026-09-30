// Marca a un usuario existente como admin (custom claim admin: true).
// Emulador: FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 node functions/scripts/setAdmin.js correo@x.com
// Producción: requiere GOOGLE_APPLICATION_CREDENTIALS y GCLOUD_PROJECT.
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const email = process.argv[2];
if (!email) {
  console.error('Uso: node functions/scripts/setAdmin.js <email>');
  process.exit(1);
}

initializeApp({ projectId: process.env.GCLOUD_PROJECT ?? 'demo-coffeeshow' });
const auth = getAuth();
const user = await auth.getUserByEmail(email);
await auth.setCustomUserClaims(user.uid, { ...user.customClaims, admin: true });
console.log(`${email} ahora es admin. Debe cerrar sesión y volver a entrar.`);
