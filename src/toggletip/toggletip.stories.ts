/**
 * Storybook stories for the Angular toggletip directive layer.
 * The directives map the old API onto the <cds-toggletip> web component.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { ToggletipModule } from "./index";

export default {
	title: "Components/Toggletip",
	decorators: [
		moduleMetadata({
			imports: [ToggletipModule]
		})
	],
	argTypes: {
		align: {
			control: "select",
			options: ["top", "top-left", "top-right", "bottom", "bottom-left", "bottom-right", "left", "right"]
		},
		autoAlign: { control: "boolean" },
		isOpenChange: { action: "isOpenChange" }
	},
	args: {
		align: "bottom",
		autoAlign: false
	}
} as Meta;

export const Basic = (args) => ({
	props: args,
	template: `
		<div style="display: flex; justify-content: center; padding: 4rem">
			<cds-toggletip
				[align]="align"
				[autoAlign]="autoAlign"
				(isOpenChange)="isOpenChange($event)">
				Toggletip label
				<p cdsToggletipContent>
					Custom content here. The toggletip content supports
					<strong>rich markup</strong> and actions.
				</p>
				<div cdsToggletipAction>
					<a href="#">Link action</a>
					<button>Button</button>
				</div>
			</cds-toggletip>
		</div>
	`
});
