// @ts-check

import tseslint from "typescript-eslint";

const config = tseslint.config({
  files: ["src/**/*.ts", "tests/**/*.ts"],
  ignores: ["dist/**/*.js", "dist/**/*.ts"],
  extends: [...tseslint.configs.recommended],
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/no-require-imports": 0,
  },
});

// console.log(config);

export default config;
