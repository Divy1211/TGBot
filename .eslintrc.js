const { off } = require("process");

module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: 'standard-with-typescript',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['tsconfig.json'],
  },
  plugins: [
    "jsdoc",
  ],
  rules: {
    'no-console': 'off',
    'object-curly-spacing': 'off',
    '@typescript-eslint/object-curly-spacing': ["error", "never"],
    "quotes": "off",
    "import/newline-after-import": ["error", { "count": 2 }],
    "@typescript-eslint/quotes": ["error", "double"],
    "@typescript-eslint/semi": ["error", "always"],
    "indent": 'off',
    "@typescript-eslint/indent": ["error", 4],
    "comma-dangle": 'off',
    "@typescript-eslint/comma-dangle": ["error", {
      "arrays": "always-multiline",
      "objects": "always-multiline",
      "imports": "never",
      "exports": "never",
      "functions": "never"
    }],
    "@typescript-eslint/consistent-type-imports": ["error", {
      prefer: "no-type-imports",
    }],
    "consistent-type-assertions": "off",
    "@typescript-eslint/consistent-type-assertions": ["error",
      { 'assertionStyle': 'as', 'objectLiteralTypeAssertions': 'allow-as-parameter' }
    ],
    "strict-boolean-expressionss": "off",
    "@typescript-eslint/strict-boolean-expressions": ["error", {
      "allowString": false,
      "allowNumber": false,
      "allowNullableObject": true,
      "allowNullableBoolean": true,
      "allowNullableString": false,
      "allowNullableNumber": false,
      "allowAny": false
    }],
    "function-call-argument-newline": ["error", "consistent"],
    "curly": ["error","all"],
    "array-element-newline": ["error", "always"],
    "jsdoc/no-types": 0,
    "sort-imports": ["error", {
      "ignoreCase": false,
      "ignoreDeclarationSort": false,
      "ignoreMemberSort": false,
      "memberSyntaxSortOrder": ["none", "all", "multiple", "single"],
      "allowSeparatedGroups": false
  }],
  "newline-per-chained-call": ["error", { "ignoreChainWithDepth": 2 }],
  "function-paren-newline": ["error", "never"],

  }
}
