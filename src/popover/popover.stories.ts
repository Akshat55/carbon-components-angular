/**
 * Storybook stories for the Angular popover directive layer.
 * The directive maps the old @Input/@Output API onto the <cds-popover>
 * web component.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { PopoverModule } from "./index";

export default {
	title: "Components/Popover",
	decorators: [
		moduleMetadata({
			imports: [PopoverModule]
		})
	],
	argTypes: {
		align: {
			control: "select",
			options: [
				"top", "top-left", "top-right",
				"bottom", "bottom-left", "bottom-right",
				"left", "right"
			]
		},
		caret: { control: "boolean" },
		dropShadow: { control: "boolean" },
		highContrast: { control: "boolean" },
		autoAlign: { control: "boolean" },
		isOpenChange: { action: "isOpenChange" }
	},
	args: {
		align: "bottom",
		caret: true,
		dropShadow: true,
		highContrast: false,
		autoAlign: false
	}
} as Meta;

export const Basic = (args) => ({
	props: { ...args, open: false },
	template: `
		<div style="display: flex; justify-content: center; padding: 5rem">
			<cds-popover
				[isOpen]="open"
				[align]="align"
				[caret]="caret"
				[dropShadow]="dropShadow"
				[highContrast]="highContrast"
				[autoAlign]="autoAlign"
				(isOpenChange)="isOpenChange($event)">
				<button (click)="open = !open" style="padding: 0.5rem 1rem">Toggle popover</button>
				<cds-popover-content>
					<div style="padding: 1rem">
						<p style="font-weight: 600; margin-bottom: 0.5rem">Popover title</p>
						<p>Popover body content rendered through cds-popover-content.</p>
					</div>
				</cds-popover-content>
			</cds-popover>
		</div>
	`
});
