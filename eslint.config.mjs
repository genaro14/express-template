import globals from "globals";
import pluginJs from "@eslint/js";
import pluginJest from "eslint-plugin-jest";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,  // Use browser globals
        expect: "readonly",   // Jest globals
        test: "readonly",
        describe: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
      },
    },
    plugins: {
      jest: pluginJest,  // Add Jest plugin
    },
    rules: {
      // Jest-specific linting rules (optional)
      "jest/no-disabled-tests": "warn", // Warn about disabled tests
      "jest/expect-expect": "error",    // Ensure there are assertions in tests
      'no-restricted-globals': ['error', 'event', 'fdescribe'],
      'no-console': 'off', // Disable warnings on console usage
  
    },
  },
  pluginJs.configs.recommended,  // Include the recommended ESLint config
];
