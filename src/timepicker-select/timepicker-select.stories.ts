import { FormsModule } from "@angular/forms";
import { moduleMetadata, Meta } from "@storybook/angular";
import { TimePickerSelect } from "./";

export default {
	title: "Components/Timepicker Select",
	decorators: [
		moduleMetadata({
			imports: [
				FormsModule
			]
		})
	],
	component: TimePickerSelect
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<div class="cds--form-item">
			<div class="cds--time-picker">
				<cds-time-picker-select>
					<cds-select-item selected value="AM">AM</cds-select-item>
					<cds-select-item value="PM">PM</cds-select-item>
				</cds-time-picker-select>
				<cds-time-picker-select>
					<cds-select-item selected value="Time Zone 1">Time Zone 1</cds-select-item>
					<cds-select-item value="Time Zone 2">Time Zone 2</cds-select-item>
				</cds-time-picker-select>
			</div>
		</div>
	`
});
export const Basic = Template.bind({});
