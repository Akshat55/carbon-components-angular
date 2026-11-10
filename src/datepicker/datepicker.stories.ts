/**
 * Storybook stories for the Angular date-picker directive layer.
 * The directive maps the old @Input/@Output API onto the <cds-date-picker>
 * web component, generating <cds-date-picker-input> children automatically.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { DatePickerModule } from "./index";

export default {
	title: "Components/Date Picker",
	decorators: [
		moduleMetadata({
			imports: [DatePickerModule]
		})
	],
	argTypes: {
		size: { control: "radio", options: ["sm", "md", "lg"] },
		disabled: { control: "boolean" },
		invalid: { control: "boolean" },
		label: { control: "text" },
		placeholder: { control: "text" },
		invalidText: { control: "text" },
		valueChange: { action: "valueChange" }
	},
	args: {
		size: "md",
		disabled: false,
		invalid: false,
		label: "Date picker label",
		placeholder: "mm/dd/yyyy",
		invalidText: "Invalid date"
	}
} as Meta;

export const Single = (args) => ({
	props: args,
	template: `
		<cds-date-picker
			[label]="label"
			[placeholder]="placeholder"
			[size]="size"
			[disabled]="disabled"
			[invalid]="invalid"
			[invalidText]="invalidText"
			(valueChange)="valueChange($event)">
		</cds-date-picker>
	`
});

export const Range = (args) => ({
	props: args,
	template: `
		<cds-date-picker
			[range]="true"
			[label]="'Start date'"
			rangeLabel="End date"
			[placeholder]="placeholder"
			(valueChange)="valueChange($event)">
		</cds-date-picker>
	`
});
