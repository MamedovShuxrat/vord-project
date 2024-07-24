module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended"
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: "module"
  },
  plugins: ["react", "prettier"],
  rules: {
    "react/react-in-jsx-scope": "off",
    quotes: ["error", "double", { allowTemplateLiterals: true }],
    "jsx-quotes": ["error", "prefer-double"],
    "react/prop-types": "off",
    "no-unused-vars": "warn",
    "prettier/prettier": "error"
  }
};
