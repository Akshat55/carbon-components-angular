/**
 * Storybook stories for the Angular tag directive layer.
 * The directives map the old @Input/@Output API onto the tag web components.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";
import { TagModule } from "./index";

export default {
	title: "Components/Tag",
	decorators: [
		moduleMetadata({
			imports: [TagModule, CommonModule]
		})
	],
	argTypes: {
		type: {
			control: "select",
			options: [
				"red", "magenta", "purple", "blue", "cyan", "teal", "green",
				"gray", "cool-gray", "warm-gray", "high-contrast", "outline"
			]
		},
		size: { control: "radio", options: ["sm", "md", "lg"] },
		disabled: { control: "boolean" }
	},
	args: {
		type: "gray",
		size: "md",
		disabled: false
	}
} as Meta;

export const Basic = (args) => ({
	props: args,
	template: `
		<cds-tag [type]="type" [size]="size" [disabled]="disabled">Tag content</cds-tag>
	`
});

export const Dismissible = (args) => ({
	props: { ...args, onClose: (event) => console.log("closed", event) },
	template: `
		<cds-dismissible-tag
			[type]="type"
			[size]="size"
			[disabled]="disabled"
			title="Filter tag"
			closeButtonLabel="Clear filter"
			(close)="onClose($event)">
			Dismissible tag
		</cds-dismissible-tag>
	`
});

export const Selectable = (args) => ({
	props: { ...args, selected: false, onSelectedChange: (selected) => console.log("selected", selected) },
	template: `
		<cds-selectable-tag
			[size]="size"
			[disabled]="disabled"
			[selected]="selected"
			(selectedChange)="onSelectedChange($event)">
			Selectable tag
		</cds-selectable-tag>
	`
});

export const Operational = (args) => ({
	props: args,
	template: `
		<cds-operational-tag [type]="type" [size]="size" [disabled]="disabled">
			Operational tag
		</cds-operational-tag>
	`
});

export const Skeleton = () => ({
	template: `<cds-tag-skeleton size="md"></cds-tag-skeleton>`
});
Skeleton.parameters = { controls: { disable: true } };
