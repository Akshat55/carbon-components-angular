const path = require('path');

module.exports = {
	"stories": [
		"../src/**/*.stories.mdx",
		"../src/**/*.stories.@(js|jsx|ts|tsx)"
	],
	"addons": [
		"@storybook/addon-links",
		{
			name: "@storybook/addon-essentials",
			options: {
				docs: true,
				backgrounds: false
			}
		},
		{
			name: '@storybook/addon-storysource',
			options: {
				rule: {
					test: [/\.stories\.ts?$/],
					include: [path.resolve(__dirname, '../src')],
				},
			},
		},
	],
	"framework": "@storybook/angular",
	"core": {
		"builder": "webpack5"
	},
	webpack(config) {

		// Configure source loader
		config.module.rules.push({
			test: /\.stories\.ts?$/,
			use: [
				{
					loader: require.resolve('@storybook/source-loader'),
					options: {
						parser: 'typescript',
					},
				},
			],
			include: [path.resolve(__dirname, '../src')],
			enforce: 'pre',
		});

		// Add style rules
		config.module.rules.push({
			test: /\.scss$/,
			sideEffects: true,
			use: [
				"style-loader",
				"css-loader",
				"postcss-loader",
				{
					loader: "sass-loader",
					options: {
						implementation: require("sass")
					}
				},
			]
		});

		config.mode = "development";
		config.devtool = "source-map";
		return config;
	}
}
