/**
 * Storybook stories for the Angular password-input directive layer.
 * The directive maps the old API onto the <cds-password-input> web component.
 */
import { FormsModule } from "@angular/forms";
import { Meta, moduleMetadata } from "@storybook/angular";
import { InputModule } from "./index";

export default {
	title: "Components/Password Input",
	decorators: [
		moduleMetadata({
			imports: [InputModule, FormsModule]
		})
	],
	argTypes: {
		size: { control: "radio", options: ["sm", "md", "lg"] },
		invalid: { control: "boolean" },
		disabled: { control: "boolean" },
		label: { control: "text" },
		helperText: { control: "text" },
		invalidText: { control: "text" },
		placeholder: { control: "text" },
		valueChange: { action: "valueChange" }
	},
	args: {
		size: "md",
		invalid: false,
		disabled: false,
		label: "Password",
		helperText: "Optional helper text",
		invalidText: "Invalid password",
		placeholder: "Enter password"
	}
} as Meta;

export const Basic = (args) => ({
	props: args,
	template: `
		<cds-password-input
			[label]="label"
			[helperText]="helperText"
			[invalidText]="invalidText"
			[placeholder]="placeholder"
			[size]="size"
			[invalid]="invalid"
			[disabled]="disabled"
			(valueChange)="valueChange($event)">
		</cds-password-input>
	`
});
