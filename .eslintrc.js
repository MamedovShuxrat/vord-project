module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: "module"
  },
  plugins: ["react"],
  rules: {
    "react/react-in-jsx-scope": "off",
    quotes: ["error", "double", { allowTemplateLiterals: true }],
    "jsx-quotes": ["error", "prefer-double"],
    "react/prop-types": "off",
    "no-unused-vars": "warn"
  },
  globals: {
    process: "readonly",
    module: "readonly",
    require: "readonly"
  },
  overrides: [
    {
      files: ["webpack.config.js", ".eslintrc.js"],
      env: {
        node: true
      }
    }
  ]
};
