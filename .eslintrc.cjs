/* eslint-env node */
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'perfectionist', 'unused-imports'],
  root: true,
  ignorePatterns: ['**.test.ts'],
  rules: {
    /**
     * Unused import and vars:
     * https://github.com/sweepline/eslint-plugin-unused-imports
     */
    'unused-imports/no-unused-imports': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    /**
     * For config: https://eslint-plugin-perfectionist.azat.io/rules/sort-imports
     */
    'perfectionist/sort-imports': [
      'error',
      {
        type: 'line-length',
        order: 'asc',
        groups: [
          'type',
          ['builtin', 'external'],
          'internal-type',
          'internal',
          ['parent-type', 'sibling-type', 'index-type'],
          ['parent', 'sibling', 'index'],
          'side-effect',
          'style',
          'object',
          'unknown',
        ],
        'newlines-between': 'always',
        'internal-pattern': ['@/nammatham/**'],
      },
    ],
  },
};
