/** @type {import("prettier").Config} */
module.exports = {
    plugins: [
        require.resolve("prettier-plugin-tailwindcss"),
        "prettier-plugin-prisma"
    ],
    tabWidth: 4,
    semi: true,
    useTabs: true,
    singleQuote: false,
    trailingComma: "none",
    arrowParens: "always"
};
