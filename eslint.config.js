const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");
const globals = require("globals");
const importPlugin = require("eslint-plugin-import");
const jsxA11yPlugin = require("eslint-plugin-jsx-a11y");
const prettierPlugin = require("eslint-plugin-prettier");
const reactPlugin = require("eslint-plugin-react");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

module.exports = [
  {
    ignores: ["public/**", "static/**", ".cache/**"]
  },
  ...compat.extends("eslint:recommended", "prettier", "plugin:react/recommended"),
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2015
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      import: importPlugin,
      "jsx-a11y": jsxA11yPlugin,
      prettier: prettierPlugin,
      react: reactPlugin
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      "arrow-body-style": "off",
      camelcase: "warn",
      "func-names": "off",
      "global-require": "warn",
      "import/no-dynamic-require": "warn",
      "import/no-extraneous-dependencies": "off",
      "no-console": "off",
      "no-multi-assign": "off",
      "no-nested-ternary": "off",
      "no-param-reassign": "warn",
      "no-plusplus": "off",
      "no-shadow": "warn",
      "no-underscore-dangle": "warn",
      "no-unused-expressions": ["error", { allowShortCircuit: true, allowTernary: true }],
      "no-unused-vars": "warn",
      "prefer-destructuring": "off",
      "prettier/prettier": ["warn"],
      "react/jsx-key": "warn",
      "react/prop-types": "warn",
      "react/jsx-uses-vars": "error"
    }
  },
  {
    files: ["**/*.spec.js", "**/*.integration.js"],
    rules: {
      "no-unused-expressions": "off"
    }
  }
];
