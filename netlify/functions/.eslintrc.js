/* eslint-env node */
module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  globals: {
    process: 'readonly',
    require: 'readonly',
    exports: 'readonly',
    module: 'readonly',
    __dirname: 'readonly',
    __filename: 'readonly',
    console: 'readonly',
    Buffer: 'readonly',
    global: 'readonly',
  },
  rules: {
    'no-console': 'off',
    'no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
  },
};