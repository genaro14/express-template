// eslint.config.mjs
import globals from "globals";
import pluginJs from "@eslint/js";

export default {


  files: ["**/*.js"],
  languageOptions: {
    sourceType: "commonjs",
    globals: globals.browser,
  },
}