/**
 * Storybook stories for the Angular combo-button directive layer.
 * The directive maps the old API onto the <cds-combo-button> web component.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { ComboButtonModule } from "./index";

export default {
	title: "Components/Combo Button",
	decorators: [
		moduleMetadata({
			imports: [ComboButtonModule]
		})
	],
	argTypes: {
		size: { control: "radio", options: ["xs", "sm", "md", "lg"] },
		menuAlignment: { control: "select", options: ["top", "bottom", "top-start", "top-end", "bottom-start", "bottom-end"] },
		disabled: { control: "boolean" },
		label: { control: "text" },
		description: { control: "text" },
		actionClick: { action: "actionClick" }
	},
	args: {
		size: "lg",
		menuAlignment: "bottom",
		disabled: false,
		label: "Primary action",
		description: "Additional actions"
	}
} as Meta;

export const Basic = (args) => ({
	props: args,
	template: `
		<cds-combo-button
			[label]="label"
			[size]="size"
			[menuAlignment]="menuAlignment"
			[description]="description"
			[disabled]="disabled"
			(actionClick)="actionClick($event)">
			<cds-menu>
				<cds-menu-item label="Second action"></cds-menu-item>
				<cds-menu-item label="Third action"></cds-menu-item>
				<cds-menu-item label="Fourth action" disabled></cds-menu-item>
			</cds-menu>
		</cds-combo-button>
	`
});
