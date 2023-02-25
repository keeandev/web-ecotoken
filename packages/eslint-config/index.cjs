/** @type {import("eslint").Linter.Config} */
module.exports = {
	overrides: [
		{
			extends: [
				"plugin:@typescript-eslint/recommended-requiring-type-checking",
				"turbo",
				"prettier"
			],
			files: ["*.ts", "*.tsx"]
		}
	],
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
	rules: {
		"@typescript-eslint/consistent-type-imports": [
			"warn",
			{
				prefer: "type-imports",
				fixStyle: "inline-type-imports"
			}
		],
		"@typescript-eslint/ban-ts-comment": "off",
		"react/display-name": "off"
	}
};
