/**
 * Storybook stories for the Angular time-picker-select directive layer.
 * The directive maps the old API onto the <cds-time-picker-select>
 * web component.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { TimePickerSelectModule } from "./index";

export default {
	title: "Components/Time Picker Select",
	decorators: [
		moduleMetadata({
			imports: [TimePickerSelectModule]
		})
	],
	argTypes: {
		disabled: { control: "boolean" },
		label: { control: "text" },
		valueChange: { action: "valueChange" }
	},
	args: {
		disabled: false,
		label: "Select AM/PM"
	}
} as Meta;

export const Simple = (args) => ({
	props: args,
	template: `
		<cds-time-picker-select
			[label]="label"
			[disabled]="disabled"
			(valueChange)="valueChange($event)">
			<cds-select-item value="am">AM</cds-select-item>
			<cds-select-item value="pm">PM</cds-select-item>
		</cds-time-picker-select>
	`
});
