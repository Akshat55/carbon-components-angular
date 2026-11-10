/**
 * Storybook stories for the Angular tooltip directive layer.
 * The directive maps the old @Input API onto the <cds-tooltip> web component.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { TooltipModule } from "./index";

export default {
	title: "Components/Tooltip",
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
		autoAlign: { control: "boolean" },
		description: { control: "text" }
	},
	args: {
		align: "bottom",
		autoAlign: false,
		description: "Occasionally, services are updated in a specified time window to ensure no down time for customers."
	}
} as Meta;

export const Basic = (args) => ({
	props: args,
	template: `
		<div style="display: flex; justify-content: center; padding: 3rem">
			<cds-tooltip [description]="description" [align]="align" [autoAlign]="autoAlign">
				<button style="border: none; background: none; cursor: pointer" aria-labelledby="content">
					<svg width="16" height="16" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
						<path d="M17 22V13H13V15H15V22H12V24H20V22H17ZM16 7A1.5 1.5 0 1 0 17.5 8.5 1.5 1.5 0 0 0 16 7Z"></path>
						<path d="M16 30A14 14 0 1 1 30 16 14 14 0 0 1 16 30ZM16 4A12 12 0 1 0 28 16 12 12 0 0 0 16 4Z"></path>
					</svg>
				</button>
			</cds-tooltip>
		</div>
	`
});
