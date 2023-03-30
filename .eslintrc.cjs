module.exports = {
  extends: [
    'plugin:security/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:prettier/recommended',
    'prettier',
  ],
  ignorePatterns: ['node_modules/', 'dist/'],
  root: true,
  env: {
    es6: true,
  },
  plugins: ['security'],
  rules: {
    'no-console': 'error',
    'no-bitwise': 'error',
    'import/order': 'error',
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['*.ts'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      plugins: ['@typescript-eslint'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
      rules: {
        'import/no-unresolved': 'off', // Leads to false-positives and Typescript already checks imports.
      }
    },
  ],
}
