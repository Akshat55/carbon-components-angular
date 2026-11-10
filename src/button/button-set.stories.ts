/**
 * Storybook stories for the Angular button-set directive layer.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { ButtonModule } from "./index";

export default {
	title: "Components/Button/Button Set",
	decorators: [
		moduleMetadata({
			imports: [ButtonModule]
		})
	],
	argTypes: {
		fluid: { control: "boolean" },
		stacked: { control: "boolean" }
	},
	args: {
		fluid: false,
		stacked: false
	}
} as Meta;

export const Basic = (args) => ({
	props: args,
	template: `
		<cds-button-set [fluid]="fluid" [stacked]="stacked">
			<cds-button cdsButton="secondary">Secondary button</cds-button>
			<cds-button cdsButton="primary">Primary button</cds-button>
		</cds-button-set>
	`
});
