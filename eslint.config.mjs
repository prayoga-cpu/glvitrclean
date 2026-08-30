import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    // Build guards are CLI tools. They are supposed to print.
    files: ['scripts/**/*.mjs'],
    rules: { 'no-console': 'off' },
  },
  { ignores: ['out/**', '.next/**', 'node_modules/**', 'next-env.d.ts'] },
];

export default config;
