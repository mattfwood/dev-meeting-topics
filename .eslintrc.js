module.exports = {
  env: {
    es2020: true,
  },
  extends: ['react-app', 'plugin:jsx-a11y/recommended', 'cratebind'],
  plugins: ['jsx-a11y'],
  rules: {
    'import/no-anonymous-default-export': 'error',
    'import/no-webpack-loader-syntax': 'off',
    'react/react-in-jsx-scope': 'off', // React is always in scope with Blitz
    'jsx-a11y/anchor-is-valid': 'off', //Doesn't play well with Blitz/Next <Link> usage
    'import/no-unresolved': 0,
    'react/display-name': 0,
    '@typescript-eslint/no-unused-vars': 2,
  },
};
