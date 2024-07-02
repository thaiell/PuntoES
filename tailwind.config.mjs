/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				primary: "#01a197",
				secondary: "#F0F0F0",
				lighterPrimary: "#D6FFFC",
				link: "#0645AD",
				niceGray: "rgb(238, 238, 238)"
			},
			fontFamily: {
				Comfortaa: "Comfortaa",
				Ubuntu: "Ubuntu"
			}
		}
	},
	safelist: [
		"bg-red-500",
		"bg-gray-500",
		"bg-orange-500",
		"bg-blue-500", 
		"bg-purple-500", 
		"bg-green-500", 
		"bg-yellow-500",
		"bg-black", 
		"bg-white",

		"ring-red-500",
		"ring-gray-500",
		"ring-orange-500",
		"ring-blue-500",
		"ring-purple-500",
		"ring-green-500",
		"ring-yellow-500",
		"ring-black",
		"ring-white",
		"sm:w-80"
	],
	plugins: [],
}
