import eslint from '@eslint/js';
import tsESLint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';

export default tsESLint.config({
  files: ['server/src/**/*.ts', 'client/src/**/*.{ts,tsx}'],
  extends: [eslint.configs.recommended, tsESLint.configs.recommended, reactPlugin.configs.flat['jsx-runtime']],
});
