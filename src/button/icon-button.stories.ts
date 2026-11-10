/**
 * Storybook stories for the Angular icon-button directive layer.
 * The directive maps the old @Input API onto the <cds-icon-button> web component.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { ButtonModule } from "./index";

export default {
	title: "Components/Button/Icon Button",
	decorators: [
		moduleMetadata({
			imports: [ButtonModule]
		})
	],
	argTypes: {
		kind: { control: "select", options: ["primary", "secondary", "tertiary", "ghost", "danger"] },
		size: { control: "select", options: ["sm", "md", "lg"] },
		align: { control: "select", options: ["top", "bottom", "left", "right"] },
		disabled: { control: "boolean" },
		description: { control: "text" }
	},
	args: {
		kind: "primary",
		size: "lg",
		align: "top",
		disabled: false,
		description: "Icon description"
	}
} as Meta;

export const Basic = (args) => ({
	props: args,
	template: `
		<cds-icon-button
			[kind]="kind"
			[size]="size"
			[align]="align"
			[disabled]="disabled"
			[description]="description">
			<svg slot="icon" width="16" height="16" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
				<path d="M17 15L17 8 15 8 15 15 8 15 8 17 15 17 15 24 17 24 17 17 24 17 24 15z"></path>
			</svg>
		</cds-icon-button>
	`
});
