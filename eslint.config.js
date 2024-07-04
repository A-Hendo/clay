// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    {
        rules: {
            "quotes": ["error", "double", { "allowTemplateLiterals": true }],
            "eol-last": ["error", "always"],
            "indent": ["error", 4],
            "max-len": ["error", 120],
            "function-paren-newline": ["error", "consistent"],
        }
    }
);
