/** @type {import("eslint").Linter.Config} */
const config = {
    extends: [
        "next",
        "turbo",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "prettier",
    ],
    rules: {
        "@next/next/no-html-link-for-pages": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "react-hooks/exhaustive-deps": "off",
        "react/display-name": "off",
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
                caughtErrorsIgnorePattern: "^_",
            },
        ],
        "@typescript-eslint/consistent-type-imports": [
            "error",
            { prefer: "type-imports", fixStyle: "inline-type-imports" },
        ],
    },
    ignorePatterns: ["**/*.config.js", "**/*.config.cjs", "packages/config/**"],
    reportUnusedDisableDirectives: true,
};

module.exports = config;
