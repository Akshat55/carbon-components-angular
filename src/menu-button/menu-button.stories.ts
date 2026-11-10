/**
 * Storybook stories for the Angular menu-button directive layer.
 * The directive maps the old API onto the <cds-menu-button> web component.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { MenuButtonModule } from "./index";

export default {
	title: "Components/Menu Button",
	decorators: [
		moduleMetadata({
			imports: [MenuButtonModule]
		})
	],
	argTypes: {
		kind: { control: "radio", options: ["primary", "tertiary", "ghost"] },
		size: { control: "radio", options: ["xs", "sm", "md", "lg"] },
		menuAlignment: { control: "select", options: ["top", "bottom", "top-start", "top-end", "bottom-start", "bottom-end"] },
		disabled: { control: "boolean" },
		label: { control: "text" }
	},
	args: {
		kind: "primary",
		size: "lg",
		menuAlignment: "bottom",
		disabled: false,
		label: "Actions"
	}
} as Meta;

export const Basic = (args) => ({
	props: args,
	template: `
		<cds-menu-button
			[label]="label"
			[kind]="kind"
			[size]="size"
			[menuAlignment]="menuAlignment"
			[disabled]="disabled">
			<cds-menu>
				<cds-menu-item label="First action"></cds-menu-item>
				<cds-menu-item label="Second action"></cds-menu-item>
				<cds-menu-item label="Third action" disabled></cds-menu-item>
			</cds-menu>
		</cds-menu-button>
	`
});
