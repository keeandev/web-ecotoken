/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{ts,tsx}",
		"../../packages/ui/components/**/*.{ts,tsx}"
	],
	theme: {
		extend: {
			colors: {
				// ecogreen: {
				// 	100: "#e9f4d8",
				// 	200: "#d3e9b2",
				// 	300: "#bede8b",
				// 	400: "#a8d365",
				// 	500: "#92c83e",
				// 	600: "#75a032",
				// 	700: "#587825",
				// 	800: "#3a5019",
				// 	900: "#1d280c"
				// },
				// ecogreen: {
				// 	100: "#e0eddb",
				// 	200: "#c0dcb6",
				// 	300: "#a1ca92",
				// 	400: "#81b96d",
				// 	500: "#62a749",
				// 	600: "#4e863a",
				// 	700: "#3b642c",
				// 	800: "#27431d",
				// 	900: "#14210f"
				// }
				// ecogreen: {
				// 	100: "#e0eddb",
				// 	200: "#c0dcb6",
				// 	300: "#a1ca92",
				// 	400: "#81b96d",
				// 	500: "#62a749",
				// 	600: "#4e863a",
				// 	700: "#3b642c",
				// 	800: "#27431d",
				// 	900: "#14210f"
				// }
				ecogreen: {
					100: "#dfefd9",
					200: "#bfdfb3",
					300: "#9fce8e",
					400: "#7fbe68",
					500: "#5fae42",
					600: "#4c8b35",
					700: "#396828",
					800: "#26461a",
					900: "#13230d"
				}
			}
		}
	},
	plugins: [require("@headlessui/tailwindcss")]
};
