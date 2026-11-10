/**
 * Storybook stories for the Angular inline-loading directive layer.
 * The directive maps the old @Input/@Output API onto the
 * <cds-inline-loading> web component.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { InlineLoadingModule } from "./index";

export default {
	title: "Components/Inline loading",
	decorators: [
		moduleMetadata({
			imports: [InlineLoadingModule]
		})
	],
	argTypes: {
		state: { control: "radio", options: ["hidden", "inactive", "active", "finished", "error"] },
		loadingText: { control: "text" },
		successText: { control: "text" },
		errorText: { control: "text" },
		successDelay: { control: "number" },
		onSuccess: { action: "onSuccess" }
	},
	args: {
		state: "active",
		loadingText: "Loading data...",
		successText: "Data loaded",
		errorText: "Error loading data",
		successDelay: 1500
	}
} as Meta;

export const Basic = (args) => ({
	props: args,
	template: `
		<cds-inline-loading
			[state]="state"
			[loadingText]="loadingText"
			[successText]="successText"
			[errorText]="errorText"
			[successDelay]="successDelay"
			(onSuccess)="onSuccess($event)">
		</cds-inline-loading>
	`
});

export const StateCycle = (args) => ({
	props: {
		...args,
		toggle(this: any) {
			this.success = !this.success;
		},
		success: false
	},
	template: `
		<cds-inline-loading
			[loadingText]="loadingText"
			[successText]="successText"
			[errorText]="errorText"
			[success]="success"
			(onSuccess)="onSuccess($event)">
		</cds-inline-loading>
		<button style="margin-top: 1rem" (click)="toggle()">Toggle success</button>
	`
});
StateCycle.storyName = "Success and Error States";
