import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import jest from 'eslint-plugin-jest';
import nestjs from 'eslint-plugin-nestjs';
import perfectionist from 'eslint-plugin-perfectionist';
import sonarjs from 'eslint-plugin-sonarjs';
import unusedImports from 'eslint-plugin-unused-imports';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores([
    '**/node_modules',
    '**/dist',
    '**/build',
    '**/coverage',
    '**/*.log',
    '**/pnpm-lock.yaml',
  ]),
  {
    extends: compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
      'plugin:nestjs/recommended',
      'plugin:jest/recommended',
      'prettier',
    ),

    plugins: {
      '@typescript-eslint': typescriptEslint,
      perfectionist,
      sonarjs,
      'unused-imports': unusedImports,
      nestjs,
      jest,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },

      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    rules: {
      'prettier/prettier': 'error',

      'jest/no-disabled-tests': 'warn',

      'sonarjs/no-duplicate-string': 'warn',
      'sonarjs/no-identical-functions': 'warn',
      'sonarjs/no-collapsible-if': 'warn',
      'sonarjs/no-unused-collection': 'warn',
      'sonarjs/prefer-single-boolean-return': 'warn',
      'sonarjs/prefer-immediate-return': 'warn',

      '@typescript-eslint/no-empty-function': 'off',

      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],

      'perfectionist/sort-imports': [
        'warn',
        {
          type: 'alphabetical',
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'type',
            'side-effect',
          ],
          newlinesBetween: 'always',
          order: 'asc',
        },
      ],
    },
  },
]);
