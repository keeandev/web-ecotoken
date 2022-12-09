/** @type {import("eslint").Linter.Config} */
module.exports = {
    root: true,
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: [
            "./tsconfig.json",
            "./apps/*/tsconfig.json",
            "./packages/*/tsconfig.json"
        ]
    },
    extends: ["next", "turbo", "prettier"]
};
