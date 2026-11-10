/**
 * Storybook stories for the Angular button directive layer.
 * The directive maps the old @Input API onto the <cds-button> web component.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { ButtonModule } from "./index";

export default {
	title: "Components/Button",
	decorators: [
		moduleMetadata({
			imports: [ButtonModule]
		})
	],
	argTypes: {
		cdsButton: {
			control: "select",
			options: [
				"primary", "secondary", "tertiary", "ghost",
				"danger", "danger--tertiary", "danger--ghost"
			]
		},
		size: { control: "select", options: ["sm", "md", "lg", "xl", "2xl"] },
		isExpressive: { control: "boolean" },
		disabled: { control: "boolean" }
	},
	args: {
		cdsButton: "primary",
		size: "lg",
		isExpressive: false,
		disabled: false
	}
} as Meta;

export const Basic = (args) => ({
	props: args,
	template: `
		<cds-button
			[cdsButton]="cdsButton"
			[size]="size"
			[isExpressive]="isExpressive"
			[disabled]="disabled">
			Button
		</cds-button>
	`
});

export const AllKinds = () => ({
	template: `
		<cds-button cdsButton="primary">Primary</cds-button>
		<cds-button cdsButton="secondary">Secondary</cds-button>
		<cds-button cdsButton="tertiary">Tertiary</cds-button>
		<cds-button cdsButton="ghost">Ghost</cds-button>
		<cds-button cdsButton="danger">Danger</cds-button>
	`
});
AllKinds.parameters = { controls: { disable: true } };

export const Skeleton = () => ({
	template: `<cds-button-skeleton size="lg"></cds-button-skeleton>`
});
Skeleton.parameters = { controls: { disable: true } };
