import { moduleMetadata, Meta } from "@storybook/angular";
import { IconDirective } from "../icon";
import { ButtonSet, CdsButton } from "./";

export default {
	title: "Components/Button/Button Set",
	decorators: [
		moduleMetadata({
			imports: [
				ButtonSet,
				CdsButton,
				IconDirective
			]
		})
	],
	parameters: {
		layout: "centered"
	},
	component: ButtonSet
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<cds-button-set>
			<cds-button kind="secondary">Button</cds-button>
			<cds-button>Button</cds-button>
		</cds-button-set>
	`
});
export const Basic = Template.bind({});
Basic.args = {
	stacked: false
};

const FluidTemplate = (args) => ({
	props: args,
	template: `
		<cds-button-set [stacked]="stacked" style="width: 800px;">
			<cds-button kind="ghost" [size]="size">Cancel</cds-button>
			<cds-button kind="secondary" [size]="size">Button</cds-button>
			<cds-button [size]="size">Button</cds-button>
		</cds-button-set>
	`
});
export const Fluid = FluidTemplate.bind({});
Fluid.args = {
	stacked: false
};
