import { moduleMetadata, Meta } from "@storybook/angular";
import { IconDirective } from "../icon";
import { CdsButton } from "./";

export default {
	title: "Components/Button",
	decorators: [
		moduleMetadata({
			imports: [
				CdsButton,
				IconDirective
			]
		})
	],
	args: {
		kind: "primary",
		size: "md",
		isExpressive: false,
		disabled: false
	},
	argTypes: {
		kind: {
			options: [
				"primary",
				"secondary",
				"tertiary",
				"ghost",
				"danger",
				"danger--primary",
				"danger--tertiary",
				"danger--ghost"
			],
			control: { type: "select" }
		},
		size: {
			options: ["sm", "md", "lg", "xl", "2xl"],
			control: { type: "select" }
		},
		isExpressive: {
			type: "boolean"
		},
		disabled: {
			type: "boolean"
		},
		// Actions
		onClick: { action: "clicked" },
		onMouseEnter: { action: "mouseenter" },
		onMouseLeave: { action: "mouseleave" },
		onFocus: { action: "focus" },
		onBlur: { action: "blur" }
	},
	parameters: {
		layout: "centered"
	},
	component: CdsButton
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<cds-button
			[kind]="kind"
			[size]="size"
			[isExpressive]="isExpressive"
			[disabled]="disabled"
			(click)="onClick($event)"
			(mouseenter)="onMouseEnter($event)"
			(mouseleave)="onMouseLeave($event)"
			(focus)="onFocus($event)"
			(blur)="onBlur($event)">
			Button
		</cds-button>
	`
});
export const Basic = Template.bind({});

const WithIconTemplate = (args) => ({
	props: args,
	template: `
		<cds-button
			[kind]="kind"
			[size]="size"
			[isExpressive]="isExpressive"
			[disabled]="disabled"
			(click)="onClick($event)"
			(mouseenter)="onMouseEnter($event)"
			(mouseleave)="onMouseLeave($event)"
			(focus)="onFocus($event)"
			(blur)="onBlur($event)">
			With icon
			<svg slot="icon" cdsIcon="add" size="16"></svg>
		</cds-button>
	`
});
export const WithIcon = WithIconTemplate.bind({});
