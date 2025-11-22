/* eslint-disable no-undef */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "eslint-config-prettier",
  ],
  plugins: ["react-refresh"],
  settings: {
    react: {
      version: "detect",
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
        alwaysTryTypes: true,
      },
    },
  },
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "react/react-in-jsx-scope": "off",
    "import/first": "warn",
    "import/default": "off",
    "import/newline-after-import": "warn",
    "import/no-named-as-default-member": "off",
    "import/no-duplicates": "error",
    "import/no-named-as-default": 0,
    "react/prop-types": "off",
    "react/jsx-sort-props": [
      "warn",
      {
        callbacksLast: true,
        shorthandFirst: true,
        ignoreCase: true,
        reservedFirst: true,
        noSortAlphabetically: true,
      },
    ],
  },
};
