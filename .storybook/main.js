const path = require("path");
const {
	managerAnalyticsHead,
	previewAnalyticsHead,
} = require("./ibm-analytics");

module.exports = {
	// `head` contains manager-head.html/preview-head.html (if present)
	managerHead: (head) => `${head}${managerAnalyticsHead}`,
	previewHead: (head) => `${head}${previewAnalyticsHead}`,
	staticDirs: ["public"],
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: ["@storybook/addon-links", "@storybook/addon-a11y", '@storybook/addon-docs'],
	framework: {
		name: "@storybook/angular",
		options: {},
	},
	core: {
		disableTelemetry: true,
	},
	docs: {
		autodocs: true,
	},
	/**
	 * Angular's webpack Babel loader rewrites `async` functions (for zone.js) in every file.
	 * In `@carbon/web-components` that rewrite reads `this` before `super()` in some
	 * constructors (toggletip, AI label, button, menu, side nav, ...), so those elements throw
	 * and never upgrade. The web components (and Lit) are not Angular code and already target
	 * modern browsers, so leave them as published.
	 */
	webpackFinal: (config) => {
		const webComponents = /[\\/]node_modules[\\/](?:@carbon[\\/]web-components|lit|lit-html|lit-element|@lit)[\\/]/;
		config.module.rules
			.filter(rule => [].concat(rule.use || rule.loader || [])
				.some(use => String(typeof use === "string" ? use : use.loader).includes(path.join("babel", "webpack-loader"))))
			.forEach(rule => {
				const exclude = rule.exclude;
				rule.exclude = (file) => webComponents.test(file) || (exclude instanceof RegExp ? exclude.test(file) : false);
			});
		return config;
	},
	features: {
		backgrounds: false
	}
};
