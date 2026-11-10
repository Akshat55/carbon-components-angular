/**
 * Storybook stories for the Angular definition-tooltip directive layer.
 * The directive maps the old @Input API onto the <cds-definition-tooltip>
 * web component.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { TooltipModule } from "./index";

export default {
	title: "Components/Definition Tooltip",
	decorators: [
		moduleMetadata({
			imports: [TooltipModule]
		})
	],
	argTypes: {
		align: {
			control: "select",
			options: ["top", "top-left", "top-right", "bottom", "bottom-left", "bottom-right", "left", "right"]
		},
		openOnHover: { control: "boolean" },
		definition: { control: "text" }
	},
	args: {
		align: "bottom",
		openOnHover: false,
		definition: "Uniform Resource Locator; the address of a resource (such as a document or website) on the Internet."
	}
} as Meta;

export const Basic = (args) => ({
	props: args,
	template: `
		<div style="padding: 3rem">
			Custom domains direct requests for your apps in this Cloud Foundry organization to a
			<cds-definition-tooltip [definition]="definition" [align]="align" [openOnHover]="openOnHover">
				URL
			</cds-definition-tooltip>
			that you own.
		</div>
	`
});
