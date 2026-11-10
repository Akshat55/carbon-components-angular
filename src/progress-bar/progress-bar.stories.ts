/**
 * Storybook stories for the Angular progress-bar directive layer.
 * The directive maps the old @Input API onto the <cds-progress-bar> web component.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { ProgressBarModule } from "./index";

export default {
	title: "Components/Progress Bar",
	decorators: [
		moduleMetadata({
			imports: [ProgressBarModule]
		})
	],
	argTypes: {
		value: { control: "number" },
		max: { control: "number" },
		label: { control: "text" },
		helperText: { control: "text" },
		type: { control: "radio", options: ["default", "inline", "indented"] },
		status: { control: "radio", options: ["active", "finished", "error"] },
		size: { control: "radio", options: ["small", "big"] },
		hideLabel: { control: "boolean" }
	},
	args: {
		value: 30,
		max: 100,
		label: "Progress bar label",
		helperText: "Optional helper text",
		type: "default",
		status: "active",
		size: "big",
		hideLabel: false
	}
} as Meta;

export const Basic = (args) => ({
	props: args,
	template: `
		<cds-progress-bar
			[value]="value"
			[max]="max"
			[label]="label"
			[helperText]="helperText"
			[type]="type"
			[status]="status"
			[size]="size"
			[hideLabel]="hideLabel">
		</cds-progress-bar>
	`
});

export const Indeterminate = (args) => ({
	props: { ...args, value: undefined },
	template: `
		<cds-progress-bar
			[value]="value"
			[label]="label"
			[helperText]="'Indeterminate — no value set'">
		</cds-progress-bar>
	`
});
