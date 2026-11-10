/**
 * Storybook stories for the Angular combo-box directive layer.
 * The directive maps the old @Input/@Output API onto the <cds-combo-box>
 * web component. `[items]` renders <cds-combo-box-item> children.
 */
import { FormsModule } from "@angular/forms";
import { Meta, moduleMetadata } from "@storybook/angular";
import { ComboBoxModule } from "./index";

export default {
	title: "Components/Combobox",
	decorators: [
		moduleMetadata({
			imports: [ComboBoxModule, FormsModule]
		})
	],
	argTypes: {
		size: { control: "radio", options: ["sm", "md", "lg"] },
		disabled: { control: "boolean" },
		invalid: { control: "boolean" },
		warn: { control: "boolean" },
		label: { control: "text" },
		helperText: { control: "text" },
		placeholder: { control: "text" },
		selected: { action: "selected" },
		search: { action: "search" }
	},
	args: {
		size: "md",
		disabled: false,
		invalid: false,
		warn: false,
		label: "Combobox label",
		helperText: "Optional helper text",
		placeholder: "Filter..."
	}
} as Meta;

const items = [
	{ content: "Apple", value: "apple" },
	{ content: "Banana", value: "banana" },
	{ content: "Cherry", value: "cherry" },
	{ content: "Date", value: "date" }
];

export const Basic = (args) => ({
	props: { ...args, items },
	template: `
		<cds-combo-box
			[label]="label"
			[helperText]="helperText"
			[placeholder]="placeholder"
			[size]="size"
			[disabled]="disabled"
			[invalid]="invalid"
			[warn]="warn"
			[items]="items"
			(selected)="selected($event)"
			(search)="search($event)">
		</cds-combo-box>
	`
});

export const WithNgModel = (args) => ({
	props: { ...args, items, model: "banana" },
	template: `
		<cds-combo-box [label]="label" [items]="items" [(ngModel)]="model"></cds-combo-box>
		<p style="margin-top: 1rem">Selected: {{ model }}</p>
	`
});
WithNgModel.storyName = "With ngModel";
