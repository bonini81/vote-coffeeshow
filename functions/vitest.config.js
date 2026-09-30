import { defineConfig } from 'vitest/config';

// Tests unitarios (rápidos, sin emulador). Los de emulador van aparte: `npm run test:emu`.
export default defineConfig({
  test: { exclude: ['node_modules/**', '**/*.emu.test.js'] },
});
