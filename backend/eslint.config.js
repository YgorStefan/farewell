import js from '@eslint/js';
import globals from 'globals';
import security from 'eslint-plugin-security';

export default [
  {
    ignores: ['node_modules/**', 'coverage/**'],
  },
  js.configs.recommended,
  security.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: {
      'security/detect-object-injection': 'off',
    },
  },
];
