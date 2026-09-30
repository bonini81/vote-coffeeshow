import { defineConfig } from 'vitest/config';

// Tests contra el emulador de Firestore (se lanzan con `npm run test:emu` desde la raíz).
// Comparten una sola base de datos, así que los archivos corren en serie.
export default defineConfig({
  test: {
    include: ['src/**/*.emu.test.js'],
    fileParallelism: false,
    testTimeout: 20000,
  },
});
