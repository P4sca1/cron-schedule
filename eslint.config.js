// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginSecurity from 'eslint-plugin-security'
import configPrettier from 'eslint-config-prettier'

export default [
  ...tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended
  ),
  pluginSecurity.configs.recommended,
  configPrettier,
]
