/**
 * Storybook stories for the Angular toggle directive layer.
 * The directive maps the old @Input/@Output API onto the <cds-toggle>
 * web component and supports ngModel / reactive forms via ControlValueAccessor.
 */
import { FormsModule } from "@angular/forms";
import { Meta, moduleMetadata } from "@storybook/angular";
import { ToggleModule } from "./index";

export default {
	title: "Components/Toggle",
	decorators: [
		moduleMetadata({
			imports: [ToggleModule, FormsModule]
		})
	],
	argTypes: {
		checked: { control: "boolean" },
		disabled: { control: "boolean" },
		hideLabel: { control: "boolean" },
		size: { control: "radio", options: ["sm", "md"] },
		label: { control: "text" },
		onText: { control: "text" },
		offText: { control: "text" },
		checkedChange: { action: "checkedChange" }
	},
	args: {
		checked: false,
		disabled: false,
		hideLabel: false,
		size: "md",
		label: "Toggle element label",
		onText: "On",
		offText: "Off"
	}
} as Meta;

export const Basic = (args) => ({
	props: args,
	template: `
		<cds-toggle
			[checked]="checked"
			[disabled]="disabled"
			[hideLabel]="hideLabel"
			[size]="size"
			[label]="label"
			[onText]="onText"
			[offText]="offText"
			(checkedChange)="checkedChange($event)">
		</cds-toggle>
	`
});

export const WithNgModel = (args) => ({
	props: { ...args, model: true },
	template: `
		<cds-toggle [(ngModel)]="model" [label]="label"></cds-toggle>
		<p style="margin-top: 1rem">Model value: {{ model }}</p>
	`
});
WithNgModel.storyName = "With ngModel";
