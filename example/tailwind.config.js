/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin")

const fireCMSPlugin = function ({addComponents, theme}) {
    addComponents({
        ".card": {
            backgroundColor: theme("colors.white"),
            borderRadius: theme("borderRadius.lg"),
            padding: theme("spacing.4"),
            boxShadow: theme("boxShadow.sm")
            // '@apply dark:bg-blue-500 dark:hover:text-white': {},
        }
    })
};

export default {

    daisyui: {
        themes: [
            {
                light: {
                    primary: "#0070F4",
                    secondary: "#FF5B79",
                    accent: "#37cdbe",
                    neutral: "#3d4451",
                    "base-100": "#ffffff"
                }
            },
            {
                dark: {
                    primary: "#0070F4",
                    secondary: "#FF5B79",
                    accent: "#37cdbe",
                    neutral: "#3d4451",
                    "base-100": "#202024"
                }
            }
        ]
    },
    darkMode: ["class", '[data-theme="dark"]'],
    mode: "jit",
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/firecms/src/**/*.{js,ts,jsx,tsx}"
    ],
    plugins: [require("daisyui"), fireCMSPlugin],
    theme: {
        extend: {

            fontFamily: {
                sans: ["Rubik", "Roboto", "Helvetica", "Arial", "sans-serif"],
                headers: [
                    "IBM Plex Mono",
                    "Space Mono",
                    "Rubik",
                    "Roboto",
                    "Helvetica",
                    "Arial",
                    "sans-serif"
                ],
                mono: [
                    "IBM Plex Mono",
                    "Space Mono",
                    "Lucida Console",
                    "monospace"
                ]
            },
            backgroundColor: {
                "default-dark": "#202024",
                "paper-dark": "#121215",
                paper: "#ffffff",
                default: "#f8f8fa"
            },
            colors: {
                primary: "#0070F4",
                secondary: "#FF5B79",
                error: "#F44336",
                white: "#ffffff",
                divider: "#E0E0E0",
                "divider-dark": "#353535",
                field: {
                    default: "rgb(238 238 240)",
                    dark: "rgb(39 39 41)",
                    hover: "rgb(232 232 234)",
                    "hover-dark": "rgb(49,49,50)",
                    disabled: "rgb(224 224 226)",
                    "disabled-dark": "rgb(35 35 37)"
                },
                text: {
                    primary: "rgba(0, 0, 0, 0.87)",
                    "primary-dark": "#ffffff",
                    secondary: "rgba(0, 0, 0, 0.6)",
                    "secondary-dark": "rgba(255, 255, 255, 0.7)",
                    disabled: "rgba(0, 0, 0, 0.38)",
                    disabledDark: "rgba(255, 255, 255, 0.5)",
                    label: "rgb(131, 131, 131)",
                },
                gray: {
                    100: "#f8f8fa",
                    200: "#eaeff8",
                    300: "#DFDFEA",
                    400: "#9d9da9",
                    500: "#87879a",
                    600: "#6a6a75",
                    700: "#53535d",
                    800: "#202024",
                    900: "#121215"
                }
            },
            maxWidth: {
                "7xl": "85rem"
            },
            boxShadow: {
                xs: "0 0 0 1px rgba(0, 0, 0, 0.16)",
                sm: "0 1px 2px 0 rgba(0, 0, 0, 0.16)",
                default: "0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
                md: "0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
                lg: "0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02)",
                xl: "0 20px 25px -5px rgba(0, 0, 0, 0.12), 0 10px 10px -5px rgba(0, 0, 0, 0.02)",
                "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.20)",
                inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.04)",
                outline: "0 0 0 3px rgba(66, 153, 225, 0.5)",
                none: "none"
            },
            fontWeight: {
                thin: "100",
                extralight: "200",
                light: "300",
                normal: "400",
                medium: "500",
                semibold: "600",
                bold: "700",
                extrabold: "800",
                black: "900"
            },
            fontSize: {
                xs: "0.75rem",
                sm: "0.875rem",
                base: "1rem",
                lg: "1.125rem",
                xl: "1.25rem",
                "2xl": "1.5rem",
                "3xl": "2rem",
                "4xl": "2.625rem",
                "5xl": "3.25rem",
                "6xl": "5.5rem",
                "7xl": "7rem",
                "8xl": "10rem"
            },
            letterSpacing: {
                tighter: "-0.02em",
                tight: "-0.01em",
                normal: "0",
                wide: "0.01em",
                wider: "0.02em",
                widest: "0.4em"
            },
            lineHeight: {
                none: "1",
                tighter: "1.125",
                tight: "1.25",
                snug: "1.375",
                normal: "1.5",
                relaxed: "1.625",
                loose: "2",
                3: ".75rem",
                4: "1rem",
                5: "1.2rem",
                6: "1.5rem",
                7: "1.75rem",
                8: "2rem",
                9: "2.25rem",
                10: "2.5rem"
            }
        }

    },
    variants: {
        extend: {}
    }
};