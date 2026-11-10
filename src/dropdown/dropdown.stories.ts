/**
 * Storybook stories for the Angular dropdown directive layer.
 * The directive maps the old @Input/@Output API onto the <cds-dropdown>
 * web component. `[items]` renders <cds-dropdown-item> children.
 */
import { FormsModule } from "@angular/forms";
import { Meta, moduleMetadata } from "@storybook/angular";
import { DropdownModule } from "./index";

export default {
	title: "Components/Dropdown",
	decorators: [
		moduleMetadata({
			imports: [DropdownModule, FormsModule]
		})
	],
	argTypes: {
		size: { control: "radio", options: ["sm", "md", "lg"] },
		disabled: { control: "boolean" },
		readonly: { control: "boolean" },
		invalid: { control: "boolean" },
		warn: { control: "boolean" },
		hideLabel: { control: "boolean" },
		label: { control: "text" },
		helperText: { control: "text" },
		placeholder: { control: "text" },
		selected: { action: "selected" }
	},
	args: {
		size: "md",
		disabled: false,
		readonly: false,
		invalid: false,
		warn: false,
		hideLabel: false,
		label: "Dropdown label",
		helperText: "Optional helper text",
		placeholder: "Select an option"
	}
} as Meta;

const items = [
	{ content: "Option one", value: "one" },
	{ content: "Option two", value: "two" },
	{ content: "Option three", value: "three" },
	{ content: "Option four (disabled)", value: "four", disabled: true }
];

export const Basic = (args) => ({
	props: { ...args, items },
	template: `
		<cds-dropdown
			[label]="label"
			[helperText]="helperText"
			[placeholder]="placeholder"
			[size]="size"
			[disabled]="disabled"
			[readonly]="readonly"
			[invalid]="invalid"
			[warn]="warn"
			[hideLabel]="hideLabel"
			[items]="items"
			(selected)="selected($event)">
		</cds-dropdown>
	`
});

export const WithNgModel = (args) => ({
	props: { ...args, items, model: "two" },
	template: `
		<cds-dropdown [label]="label" [items]="items" [(ngModel)]="model"></cds-dropdown>
		<p style="margin-top: 1rem">Selected: {{ model }}</p>
	`
});
WithNgModel.storyName = "With ngModel";

export const InlineItems = (args) => ({
	props: args,
	template: `
		<cds-dropdown [label]="label" [placeholder]="placeholder" (selected)="selected($event)">
			<cds-dropdown-item value="one">Option one</cds-dropdown-item>
			<cds-dropdown-item value="two">Option two</cds-dropdown-item>
			<cds-dropdown-item value="three">Option three</cds-dropdown-item>
		</cds-dropdown>
	`
});
InlineItems.storyName = "With Inline Items";

export const Skeleton = () => ({
	template: `<cds-dropdown-skeleton></cds-dropdown-skeleton>`
});
Skeleton.parameters = { controls: { disable: true } };
