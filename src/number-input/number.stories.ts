/**
 * Storybook stories for the Angular number-input directive layer.
 * The directive maps the old @Input/@Output API onto the <cds-number-input>
 * web component (previously <cds-number>).
 */
import { FormsModule } from "@angular/forms";
import { Meta, moduleMetadata } from "@storybook/angular";
import { NumberModule } from "./index";

export default {
	title: "Components/Number",
	decorators: [
		moduleMetadata({
			imports: [NumberModule, FormsModule]
		})
	],
	argTypes: {
		size: { control: "radio", options: ["sm", "md", "lg"] },
		disabled: { control: "boolean" },
		invalid: { control: "boolean" },
		warn: { control: "boolean" },
		hideSteppers: { control: "boolean" },
		hideLabel: { control: "boolean" },
		min: { control: "number" },
		max: { control: "number" },
		step: { control: "number" },
		label: { control: "text" },
		helperText: { control: "text" },
		invalidText: { control: "text" },
		warnText: { control: "text" },
		change: { action: "change" }
	},
	args: {
		size: "md",
		disabled: false,
		invalid: false,
		warn: false,
		hideSteppers: false,
		hideLabel: false,
		min: 0,
		max: 100,
		step: 1,
		label: "Number input label",
		helperText: "Optional helper text",
		invalidText: "Value out of range",
		warnText: "Warning"
	}
} as Meta;

export const Basic = (args) => ({
	props: { ...args, value: 10 },
	template: `
		<cds-number-input
			[value]="value"
			[min]="min"
			[max]="max"
			[step]="step"
			[label]="label"
			[helperText]="helperText"
			[invalidText]="invalidText"
			[warnText]="warnText"
			[size]="size"
			[disabled]="disabled"
			[invalid]="invalid"
			[warn]="warn"
			[hideSteppers]="hideSteppers"
			[hideLabel]="hideLabel"
			(change)="change($event)">
		</cds-number-input>
	`
});

export const WithNgModel = (args) => ({
	props: { ...args, model: 42 },
	template: `
		<cds-number-input [(ngModel)]="model" [label]="label" [min]="min" [max]="max"></cds-number-input>
		<p style="margin-top: 1rem">Value: {{ model }}</p>
	`
});
WithNgModel.storyName = "With ngModel";
