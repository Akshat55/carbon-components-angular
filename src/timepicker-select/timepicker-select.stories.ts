import { FormsModule } from "@angular/forms";
import { moduleMetadata, Meta } from "@storybook/angular";
import { TimePickerSelect } from "./";
import { TimePicker } from "../timepicker";
import { SelectItem } from "../select";

export default {
	title: "Components/Timepicker Select",
	decorators: [
		moduleMetadata({
			imports: [
				FormsModule,
				TimePicker,
				TimePickerSelect,
				SelectItem
			]
		})
	],
	component: TimePickerSelect
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<cds-time-picker label="Select a time">
			<cds-time-picker-select ariaLabel="AM/PM" [readonly]="readonly" [(ngModel)]="period">
				<cds-select-item value="AM">AM</cds-select-item>
				<cds-select-item value="PM">PM</cds-select-item>
			</cds-time-picker-select>
			<cds-time-picker-select ariaLabel="Time zone" [readonly]="readonly">
				<cds-select-item selected value="Time Zone 1">Time Zone 1</cds-select-item>
				<cds-select-item value="Time Zone 2">Time Zone 2</cds-select-item>
			</cds-time-picker-select>
		</cds-time-picker>
	`
});
export const Basic = Template.bind({});
Basic.args = {
	period: "PM",
	readonly: false
};
