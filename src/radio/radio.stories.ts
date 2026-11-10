/**
 * Storybook stories for the Angular radio directive layer.
 * The directives map the old @Input/@Output API onto the
 * <cds-radio-button-group> / <cds-radio-button> web components.
 */
import { FormsModule } from "@angular/forms";
import { Meta, moduleMetadata } from "@storybook/angular";
import { RadioModule } from "./index";

export default {
	title: "Components/Radio",
	decorators: [
		moduleMetadata({
			imports: [RadioModule, FormsModule]
		})
	],
	argTypes: {
		orientation: { control: "radio", options: ["horizontal", "vertical"] },
		labelPlacement: { control: "radio", options: ["right", "left"] },
		disabled: { control: "boolean" },
		invalid: { control: "boolean" },
		warn: { control: "boolean" },
		legend: { control: "text" },
		helperText: { control: "text" },
		change: { action: "change" }
	},
	args: {
		orientation: "horizontal",
		labelPlacement: "right",
		disabled: false,
		invalid: false,
		warn: false,
		legend: "Radio group legend",
		helperText: "Helper text"
	}
} as Meta;

export const Basic = (args) => ({
	props: args,
	template: `
		<cds-radio-button-group
			name="radio-group"
			value="one"
			[legend]="legend"
			[orientation]="orientation"
			[labelPlacement]="labelPlacement"
			[disabled]="disabled"
			[invalid]="invalid"
			[warn]="warn"
			[helperText]="helperText"
			(change)="change($event)">
			<cds-radio-button value="one">Radio one</cds-radio-button>
			<cds-radio-button value="two">Radio two</cds-radio-button>
			<cds-radio-button value="three">Radio three</cds-radio-button>
		</cds-radio-button-group>
	`
});

export const WithNgModel = (args) => ({
	props: { ...args, model: "two" },
	template: `
		<cds-radio-button-group name="ngmodel-group" [(ngModel)]="model" [legend]="legend">
			<cds-radio-button value="one">One</cds-radio-button>
			<cds-radio-button value="two">Two</cds-radio-button>
			<cds-radio-button value="three">Three</cds-radio-button>
		</cds-radio-button-group>
		<p style="margin-top: 1rem">Selected: {{ model }}</p>
	`
});
WithNgModel.storyName = "With ngModel";
