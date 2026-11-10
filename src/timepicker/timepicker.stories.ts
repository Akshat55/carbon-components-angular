/**
 * Storybook stories for the Angular time-picker directive layer.
 * The directive maps the old API onto the <cds-time-picker> web component.
 */
import { FormsModule } from "@angular/forms";
import { Meta, moduleMetadata } from "@storybook/angular";
import { TimePickerModule } from "./index";

export default {
	title: "Components/Time Picker",
	decorators: [
		moduleMetadata({
			imports: [TimePickerModule, FormsModule]
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
		label: "Select a time",
		placeholder: "hh:mm",
		invalidText: "Invalid time"
	}
} as Meta;

export const Basic = (args) => ({
	props: args,
	template: `
		<cds-time-picker
			[label]="label"
			[placeholder]="placeholder"
			[size]="size"
			[disabled]="disabled"
			[invalid]="invalid"
			[invalidText]="invalidText"
			(valueChange)="valueChange($event)">
			<cds-time-picker-select id="time-picker-ampm">
				<cds-select-item value="am">AM</cds-select-item>
				<cds-select-item value="pm">PM</cds-select-item>
			</cds-time-picker-select>
		</cds-time-picker>
	`
});
