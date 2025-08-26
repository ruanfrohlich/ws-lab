import js from '@eslint/js';
import tsESLint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['./client/src/**/*.ts', './client/src/**/*.tsx', './server/src/**/*.ts'],
  },
  {
    ignores: ['./client/public/', './client/.parcel-cache/', 'eslint.config.js'],
  },
  js.configs.recommended,
  tsESLint.configs.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
]);
