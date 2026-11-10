/**
 * Storybook stories for the Angular code-snippet directive layer.
 * The directive maps the old @Input API onto the <cds-code-snippet>
 * web component.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { CodeSnippetModule } from "./index";

export default {
	title: "Components/Code Snippet",
	decorators: [
		moduleMetadata({
			imports: [CodeSnippetModule]
		})
	],
	argTypes: {
		display: { control: "radio", options: ["single", "multi", "inline"] },
		disabled: { control: "boolean" },
		hideCopyButton: { control: "boolean" },
		wrapText: { control: "boolean" },
		feedbackText: { control: "text" }
	},
	args: {
		display: "single",
		disabled: false,
		hideCopyButton: false,
		wrapText: false,
		feedbackText: "Copied!"
	}
} as Meta;

export const Single = (args) => ({
	props: args,
	template: `
		<cds-code-snippet
			[display]="display"
			[disabled]="disabled"
			[hideCopyButton]="hideCopyButton"
			[feedbackText]="feedbackText">
			npm install carbon-components-angular
		</cds-code-snippet>
	`
});

export const Multi = (args) => ({
	props: { ...args, display: "multi" },
	template: `
		<cds-code-snippet [display]="display" [wrapText]="wrapText">{{'@mixin grid-container {
	width: 100%;
	padding-right: padding(mobile);
	padding-left: padding(mobile);

	@include breakpoint(bp--xs--major) {
		padding-right: padding(xs);
		padding-left: padding(xs);
	}
}'}}</cds-code-snippet>
	`
});

export const Inline = (args) => ({
	props: args,
	template: `
		Deploy with <cds-code-snippet display="inline">npm run deploy</cds-code-snippet> from the project root.
	`
});
