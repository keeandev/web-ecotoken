/** @type {import('tailwindcss').Config} */
const config = {
    content: [
        "./src/**/*.{ts,tsx}",
        "../../packages/ui/components/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                ecogreen: {
                    100: "#dfefd9",
                    200: "#bfdfb3",
                    300: "#9fce8e",
                    400: "#7fbe68",
                    500: "#5fae42",
                    600: "#4c8b35",
                    700: "#396828",
                    800: "#26461a",
                    900: "#13230d",
                },
            },
        },
    },
    plugins: [],
};

module.exports = config;
