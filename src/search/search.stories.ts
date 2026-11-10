/**
 * Storybook stories for the Angular search directive layer.
 * The directive maps the old @Input/@Output API onto the <cds-search>
 * web component and supports ngModel / reactive forms via ControlValueAccessor.
 */
import { FormsModule } from "@angular/forms";
import { Meta, moduleMetadata } from "@storybook/angular";
import { SearchModule } from "./index";

export default {
	title: "Components/Search",
	decorators: [
		moduleMetadata({
			imports: [SearchModule, FormsModule]
		})
	],
	argTypes: {
		size: { control: "radio", options: ["sm", "md", "lg"] },
		disabled: { control: "boolean" },
		expandable: { control: "boolean" },
		placeholder: { control: "text" },
		label: { control: "text" },
		valueChange: { action: "valueChange" },
		clear: { action: "clear" }
	},
	args: {
		size: "md",
		disabled: false,
		expandable: false,
		placeholder: "Search",
		label: "Search"
	}
} as Meta;

export const Basic = (args) => ({
	props: args,
	template: `
		<cds-search
			[size]="size"
			[disabled]="disabled"
			[expandable]="expandable"
			[placeholder]="placeholder"
			[label]="label"
			(valueChange)="valueChange($event)"
			(clear)="clear($event)">
		</cds-search>
	`
});

export const WithNgModel = (args) => ({
	props: { ...args, model: "" },
	template: `
		<cds-search [(ngModel)]="model" [placeholder]="placeholder"></cds-search>
		<p style="margin-top: 1rem">Value: {{ model }}</p>
	`
});
WithNgModel.storyName = "With ngModel";
