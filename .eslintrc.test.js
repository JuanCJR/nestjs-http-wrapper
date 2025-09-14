module.exports = {
  extends: ['./eslint.config.js'],
  rules: {
    // Allow any in tests
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/unbound-method': 'off',
    // Allow undefined variables in tests (like FormData)
    'no-undef': 'off',
  },
  env: {
    jest: true,
    node: true,
  },
};
