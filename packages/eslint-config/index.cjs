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
	extends: ["turbo", "prettier"],
    rules: {
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-non-null-assertion": "off"
    }
};
