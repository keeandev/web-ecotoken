/** @type {import("tailwindcss").Config} */
module.exports = {
	presets: [require("@ecotoken/tailwind-config")],
	content: ["./src/**/*.{ts,tsx}"],
	corePlugins: {
		preflight: false,
		backgroundOpacity: false,
		borderOpacity: false,
		boxShadow: false,
		divideOpacity: false,
		placeholderOpacity: false,
		textOpacity: false
	},
	plugins: []
};
