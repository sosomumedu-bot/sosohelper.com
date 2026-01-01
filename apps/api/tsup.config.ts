import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node20',
  clean: true,
  dts: false,
  minify: false,
  bundle: true,
  // Externalize dependencies that shouldn't be bundled
  external: [
    '@prisma/client',
    'express',
    'argon2',
    'jsonwebtoken',
    'zod',
    'cors',
    'helmet',
    'morgan',
    'node-fetch',
    'ws',
    'dotenv'
  ],
  // This ensures that relative imports are handled correctly during bundling
  noExternal: [
    '@sosohelper/shared'
  ],
});
