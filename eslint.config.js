import js from '@eslint/js';
import ts from 'typescript-eslint';
import react from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';

//Instalar versão 9 do eslint

export default defineConfig([
  {
    files: [
      './client/src/**/*.ts',
      './client/src/**/*.tsx',
      './server/src/**/*.ts',
    ],
  },
  {
    ignores: [
      './client/public/',
      './client/.parcel-cache/',
      'eslint.config.js',
    ],
  },
  js.configs.recommended,
  ts.configs.recommended,
  react.configs.flat['jsx-runtime'],
]);
