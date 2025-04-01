import type { Config } from "tailwindcss";

export default {
	content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#f39416",
				secondary: "#07EFFE",
				accent: "#331C40",
				neutral: "#B4D0D1",
				white: "#FFFFFF",
				black: "#000000",
			},
			fontFamily: {
				sans: [
					'"Press Start 2P"',
					'"VT323"',
					'"Silkscreen"',
					'"Arcade"',
					"monospace",
					"system-ui",
					"sans-serif",
				],
			},
		},
	},
	plugins: [],
} satisfies Config;
