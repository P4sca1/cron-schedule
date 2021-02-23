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
    es2017: true,
    browser: false,
    node: false,
  },
  plugins: ['security'],
  rules: {
    'no-console': 'error',
    'no-bitwise': 'error',
    'import/order': 'error',
    // Allow unresolved imports. TypeScript already checks this and nuxt webpack aliases are not supported.
    'import/no-unresolved': 'off',
    'security/detect-object-injection': 'off',
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
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.eslint.json',
      },
    },
  ],
}
