/**
 * Storybook stories for the Angular loading directive layer.
 * The directive maps the old @Input API onto the <cds-loading> web component.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { LoadingModule } from "./index";

export default {
	title: "Components/Loading",
	decorators: [
		moduleMetadata({
			imports: [LoadingModule]
		})
	],
	argTypes: {
		isActive: { control: "boolean" },
		overlay: { control: "boolean" },
		size: { control: "radio", options: ["normal", "sm"] }
	},
	args: {
		isActive: true,
		overlay: false,
		size: "normal"
	}
} as Meta;

export const Basic = (args) => ({
	props: args,
	template: `
		<cds-loading
			[isActive]="isActive"
			[size]="size"
			[overlay]="overlay">
		</cds-loading>
	`
});

export const Small = (args) => ({
	props: args,
	template: `<cds-loading size="sm" [isActive]="isActive"></cds-loading>`
});

export const WithOverlay = (args) => ({
	props: args,
	template: `<cds-loading [overlay]="true" [isActive]="isActive"></cds-loading>`
});
WithOverlay.storyName = "With Overlay";
