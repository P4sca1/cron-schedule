module.exports = {
  extends: [
    'plugin:security/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  ignorePatterns: ['node_modules/', 'dist/'],
  root: true,
  env: {
    es2017: true,
    browser: false,
    node: false,
  },
  plugins: ['security', 'prettier'],
  rules: {
    'no-console': 'error',
    'no-bitwise': 'error',
    'import/order': 'error',
    // Allow unresolved imports. TypeScript already checks this and nuxt webpack aliases are not supported.
    'import/no-unresolved': 'off',
    'prettier/prettier': 'error',
    'security/detect-object-injection': 'off',
  },
  overrides: [
    {
      files: ['*.ts'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier/@typescript-eslint',
      ],
      plugins: ['@typescript-eslint'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.eslint.json',
      },
    },
    {
      files: ['rollup.config.js'],
      parserOptions: {
        sourceType: 'module',
      },
    },
  ],
}
