/**
 * Storybook stories for the Angular select directive layer.
 * The directives map the old @Input/@Output API onto the <cds-select>
 * web component. Options are <cds-select-item> elements.
 */
import { FormsModule } from "@angular/forms";
import { Meta, moduleMetadata } from "@storybook/angular";
import { SelectModule } from "./index";

export default {
	title: "Components/Select",
	decorators: [
		moduleMetadata({
			imports: [SelectModule, FormsModule]
		})
	],
	argTypes: {
		size: { control: "radio", options: ["sm", "md", "lg"] },
		display: { control: "radio", options: ["default", "inline"] },
		disabled: { control: "boolean" },
		invalid: { control: "boolean" },
		warn: { control: "boolean" },
		hideLabel: { control: "boolean" },
		label: { control: "text" },
		helperText: { control: "text" },
		invalidText: { control: "text" },
		warnText: { control: "text" },
		valueChange: { action: "valueChange" }
	},
	args: {
		size: "md",
		display: "default",
		disabled: false,
		invalid: false,
		warn: false,
		hideLabel: false,
		label: "Select label",
		helperText: "Optional helper text",
		invalidText: "Invalid selection",
		warnText: "Warning"
	}
} as Meta;

export const Basic = (args) => ({
	props: args,
	template: `
		<cds-select
			[label]="label"
			[helperText]="helperText"
			[invalidText]="invalidText"
			[warnText]="warnText"
			[size]="size"
			[display]="display"
			[disabled]="disabled"
			[invalid]="invalid"
			[warn]="warn"
			[hideLabel]="hideLabel"
			(valueChange)="valueChange($event)">
			<cds-select-item value="" disabled selected hidden>Choose an option</cds-select-item>
			<cds-select-item value="solong">A much longer option that is worth having around to check how text flows</cds-select-item>
			<cds-select-item-group label="Category 1">
				<cds-select-item value="option1">Option 1</cds-select-item>
				<cds-select-item value="option2">Option 2</cds-select-item>
			</cds-select-item-group>
			<cds-select-item-group label="Category 2">
				<cds-select-item value="option3">Option 3</cds-select-item>
				<cds-select-item value="option4">Option 4</cds-select-item>
			</cds-select-item-group>
		</cds-select>
	`
});

export const WithNgModel = (args) => ({
	props: { ...args, model: "option1" },
	template: `
		<cds-select [(ngModel)]="model" [label]="label">
			<cds-select-item value="option1">Option 1</cds-select-item>
			<cds-select-item value="option2">Option 2</cds-select-item>
		</cds-select>
		<p style="margin-top: 1rem">Selected: {{ model }}</p>
	`
});
WithNgModel.storyName = "With ngModel";
