// .storybook/main.js

const path = require("path");

module.exports = {
	stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(ts|tsx)"],
	/** Expose public folder to storybook as static */
	staticDirs: ["../public"],
	typescript: {
		reactDocgen: false
	},
	features: { storyStoreV7: true },
	addons: [
		{
			/**
			 * Fix Storybook issue with PostCSS@8
			 * @see https://github.com/storybookjs/storybook/issues/12668#issuecomment-773958085
			 */
			name: "@storybook/addon-postcss",
			options: {
				postcssLoaderOptions: {
					implementation: require("postcss")
				}
			}
		},
		"@storybook/addon-links",
		"@storybook/addon-essentials"
	],
	framework: "@storybook/react",
	core: {
		builder: "webpack5"
	},
	webpackFinal: (config) => {
		/**
		 * Add support for alias-imports
		 * @see https://github.com/storybookjs/storybook/issues/11989#issuecomment-715524391
		 */
		config.resolve.alias = {
			...config.resolve?.alias,
			"@": [path.resolve(__dirname, "../src/")]
		};

		/**
		 * Fixes font import with /
		 * @see https://github.com/storybookjs/storybook/issues/12844#issuecomment-867544160
		 */
		config.resolve.roots = [
			path.resolve(__dirname, "../public"),
			"node_modules"
		];

		return config;
	}
};
