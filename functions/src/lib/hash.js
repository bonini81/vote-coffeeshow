import { createHmac } from 'node:crypto';

/** HMAC-SHA256 en hex. El pepper vive en Secret Manager, nunca en el repo. */
export function hmacHex(valor, pepper) {
  if (!pepper) throw new Error('Falta el pepper para calcular el hash.');
  return createHmac('sha256', pepper).update(String(valor)).digest('hex');
}
