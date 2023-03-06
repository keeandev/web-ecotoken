/** @type {import("eslint").Linter.Config} */
module.exports = {
    parserOptions: {
        ecmaVersion: "latest",
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"],
    },
    extends: ["../../.eslintrc.cjs", "next"],
};
