/**
 * Storybook stories for the Angular text-input directive layer.
 * The directive maps the old API onto the <cds-text-input> web component.
 */
import { FormsModule } from "@angular/forms";
import { Meta, moduleMetadata } from "@storybook/angular";
import { InputModule } from "./index";

export default {
	title: "Components/Input",
	decorators: [
		moduleMetadata({
			imports: [InputModule, FormsModule]
		})
	],
	argTypes: {
		size: { control: "radio", options: ["sm", "md", "lg"] },
		invalid: { control: "boolean" },
		warn: { control: "boolean" },
		disabled: { control: "boolean" },
		hideLabel: { control: "boolean" },
		label: { control: "text" },
		helperText: { control: "text" },
		invalidText: { control: "text" },
		warnText: { control: "text" },
		placeholder: { control: "text" },
		valueChange: { action: "valueChange" }
	},
	args: {
		size: "md",
		invalid: false,
		warn: false,
		disabled: false,
		hideLabel: false,
		label: "Text input label",
		helperText: "Optional helper text",
		invalidText: "Invalid input",
		warnText: "Warning",
		placeholder: "Placeholder"
	}
} as Meta;

export const Basic = (args) => ({
	props: args,
	template: `
		<cds-text-input
			[label]="label"
			[helperText]="helperText"
			[invalidText]="invalidText"
			[warnText]="warnText"
			[placeholder]="placeholder"
			[size]="size"
			[invalid]="invalid"
			[warn]="warn"
			[disabled]="disabled"
			[hideLabel]="hideLabel"
			(valueChange)="valueChange($event)">
		</cds-text-input>
	`
});

export const WithNgModel = (args) => ({
	props: { ...args, model: "" },
	template: `
		<cds-text-input [(ngModel)]="model" [label]="label" [placeholder]="placeholder"></cds-text-input>
		<p style="margin-top: 1rem">Value: {{ model }}</p>
	`
});
WithNgModel.storyName = "With ngModel";
