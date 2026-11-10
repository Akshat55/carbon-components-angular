/**
 * Storybook stories for the Angular progress-indicator directive layer.
 * The directive maps the old `[steps]`/`[current]` API onto the
 * <cds-progress-indicator> web component.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { ProgressIndicatorModule } from "./index";

export default {
	title: "Components/Progress Indicator",
	decorators: [
		moduleMetadata({
			imports: [ProgressIndicatorModule]
		})
	],
	argTypes: {
		orientation: { control: "radio", options: ["horizontal", "vertical"] },
		spacing: { control: "radio", options: ["default", "equal"] },
		current: { control: "number" },
		stepSelected: { action: "stepSelected" }
	},
	args: {
		orientation: "horizontal",
		spacing: "default",
		current: 1
	}
} as Meta;

const steps = [
	{ label: "First step", secondaryLabel: "Optional label", complete: true },
	{ label: "Second step" },
	{ label: "Third step", invalid: true },
	{ label: "Fourth step", disabled: true },
	{ label: "Fifth step" }
];

export const Basic = (args) => ({
	props: { ...args, steps },
	template: `
		<cds-progress-indicator
			[steps]="steps"
			[current]="current"
			[orientation]="orientation"
			[spacing]="spacing"
			(stepSelected)="stepSelected($event)">
		</cds-progress-indicator>
	`
});

export const Vertical = (args) => ({
	props: { ...args, steps, orientation: "vertical" },
	template: `
		<cds-progress-indicator
			[steps]="steps"
			[current]="current"
			[orientation]="orientation"
			(stepSelected)="stepSelected($event)">
		</cds-progress-indicator>
	`
});
