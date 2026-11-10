import { FormsModule } from "@angular/forms";
import { moduleMetadata, Meta } from "@storybook/angular";
import { TimePicker } from "./";
import { TimePickerSelect } from "../timepicker-select";

export default {
	title: "Components/Timepicker",
	decorators: [
		moduleMetadata({
			imports: [
				TimePicker,
				TimePickerSelect,
				FormsModule
			]
		})
	],
	component: TimePicker
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<cds-time-picker
			(valueChange)="timePickerChange($event)"
			[(ngModel)]="model"
			[disabled]="disableTime"
			[invalid]="invalid"
			[invalidText]="invalidText"
			label="Select a time">
			<cds-time-picker-select
				(valueChange)="timePickerSelectChange($event)"
				[disabled]="disabledSelect"
				[(ngModel)]="period"
				ariaLabel="Open list of options">
				<cds-select-item selected value="AM">AM</cds-select-item>
				<cds-select-item value="PM">PM</cds-select-item>
			</cds-time-picker-select>
			<cds-time-picker-select
				(valueChange)="timePickerSelectChange($event)"
				[disabled]="disabledSelect"
				[(ngModel)]="timeZone"
				ariaLabel="Open list of options">
				<cds-select-item selected value="Time Zone 1">Time Zone 1</cds-select-item>
				<cds-select-item value="Time Zone 2">Time Zone 2</cds-select-item>
			</cds-time-picker-select>
		</cds-time-picker>
		<br>
		<p> Input: {{model}} </p>
		<p> Period: {{period}} </p>
		<p> Time Zone: {{timeZone}} </p>
	`
});
export const Basic = Template.bind({});
Basic.args = {
	model: "12:12",
	period: "AM",
	timeZone: "Time Zone 1",
	disableTime: false,
	disabledSelect: false,
	invalid: false,
	invalidText: "A valid value is required!",
	theme: "dark"
};

Basic.argTypes = {
	timePickerChange: {
		action: "Time picker value changed!"
	},
	timePickerSelectChange: {
		action: "Time picker select change fired!"
	},
	theme: {
		options: ["light", "dark"],
		control: "radio"
	}
};
