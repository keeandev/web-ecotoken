/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "../../packages/ui/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                ecogreen: {
                    100: "#e9f4d8",
                    200: "#d3e9b2",
                    300: "#bede8b",
                    400: "#a8d365",
                    500: "#92c83e",
                    600: "#75a032",
                    700: "#587825",
                    800: "#3a5019",
                    900: "#1d280c"
                }
            }
        }
    },
    plugins: []
};
