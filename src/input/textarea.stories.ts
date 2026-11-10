/**
 * Storybook stories for the Angular textarea directive layer.
 * The directive maps the old API onto the <cds-textarea> web component.
 */
import { FormsModule } from "@angular/forms";
import { Meta, moduleMetadata } from "@storybook/angular";
import { InputModule } from "./index";

export default {
	title: "Components/Textarea",
	decorators: [
		moduleMetadata({
			imports: [InputModule, FormsModule]
		})
	],
	argTypes: {
		invalid: { control: "boolean" },
		warn: { control: "boolean" },
		disabled: { control: "boolean" },
		label: { control: "text" },
		helperText: { control: "text" },
		invalidText: { control: "text" },
		warnText: { control: "text" },
		placeholder: { control: "text" },
		rows: { control: "number" },
		valueChange: { action: "valueChange" }
	},
	args: {
		invalid: false,
		warn: false,
		disabled: false,
		label: "Textarea label",
		helperText: "Optional helper text",
		invalidText: "Invalid input",
		warnText: "Warning",
		placeholder: "Placeholder",
		rows: 4
	}
} as Meta;

export const Basic = (args) => ({
	props: args,
	template: `
		<cds-textarea
			[label]="label"
			[helperText]="helperText"
			[invalidText]="invalidText"
			[warnText]="warnText"
			[placeholder]="placeholder"
			[rows]="rows"
			[invalid]="invalid"
			[warn]="warn"
			[disabled]="disabled"
			(valueChange)="valueChange($event)">
		</cds-textarea>
	`
});
