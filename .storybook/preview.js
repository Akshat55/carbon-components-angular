// load global styles
import "!style-loader!css-loader!postcss-loader!sass-loader!./preview.scss";
import { breakpoints } from '@carbon/layout';

// Add compodoc
// import { setCompodocJson } from "@storybook/addon-docs/angular";
// import docJson from "../documentation.json";
// // setCompodocJson(docJson);

// import { configure, getStorybook } from '@storybook/angular';

// // basic setup for storybook, depends on your project structure
// const req = require.context('../src', true, /\.stories\.ts$/);

// function loadStories() {
// 	req.keys().forEach((filename) => req(filename));
// }

// configure(loadStories, module);
// // this will return an object with all stories inside
// const stories = getStorybook();

// console.log('all stories are', stories);

// Set carbon viewports options
export const parameters = {
	viewport: {
		viewports: {
			sm: {
				name: 'Small',
				styles: {
					width: breakpoints.sm.width,
					height: '100%',
				},
			},
			md: {
				name: 'Medium',
				styles: {
					width: breakpoints.md.width,
					height: '100%',
				},
			},
			lg: {
				name: 'Large',
				styles: {
					width: breakpoints.lg.width,
					height: '100%',
				},
			},
			xlg: {
				name: 'X-Large',
				styles: {
					width: breakpoints.xlg.width,
					height: '100%',
				},
			},
			max: {
				name: 'Max',
				styles: {
					width: breakpoints.max.width,
					height: '100%',
				},
			},
		},
	},
	controls: {
		expanded: true
	},
};

export const decorators = [
	(Story, context) => {
		// context.originalStoryFn() returns template
		// Use values to get data from `documentation` json & populate argTypes
		console.log('data', Story, context);
		return Story();
	}
]
