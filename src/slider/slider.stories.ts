/**
 * Storybook stories for the Angular slider directive layer.
 * The directive maps the old @Input/@Output API onto the <cds-slider>
 * web component.
 */
import { FormsModule } from "@angular/forms";
import { Meta, moduleMetadata } from "@storybook/angular";
import { SliderModule } from "./index";

export default {
	title: "Components/Slider",
	decorators: [
		moduleMetadata({
			imports: [SliderModule, FormsModule]
		})
	],
	argTypes: {
		min: { control: "number" },
		max: { control: "number" },
		step: { control: "number" },
		disabled: { control: "boolean" },
		label: { control: "text" },
		valueChange: { action: "valueChange" }
	},
	args: {
		min: 0,
		max: 100,
		step: 1,
		disabled: false,
		label: "Slider label"
	}
} as Meta;

export const Basic = (args) => ({
	props: { ...args, value: 50 },
	template: `
		<cds-slider
			[min]="min"
			[max]="max"
			[step]="step"
			[value]="value"
			[label]="label"
			[disabled]="disabled"
			(valueChange)="valueChange($event)">
			<cds-slider-input type="number"></cds-slider-input>
		</cds-slider>
	`
});

export const WithNgModel = (args) => ({
	props: { ...args, model: 25 },
	template: `
		<cds-slider [min]="min" [max]="max" [label]="label" [(ngModel)]="model"></cds-slider>
		<p style="margin-top: 1rem">Value: {{ model }}</p>
	`
});
WithNgModel.storyName = "With ngModel";
