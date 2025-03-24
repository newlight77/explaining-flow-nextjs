export default [
	{
		files: ["**/*.ts"],
    extends: "next/core-web-vitals",
		rules: {
			"@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "react/no-unescaped-entities": "off"
		},
	},
];