/**
 * Storybook stories for the Angular content-switcher directive layer.
 * The directives map the old @Input/@Output API onto the content-switcher
 * web components.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { ContentSwitcherModule } from "./index";

export default {
	title: "Components/Content Switcher",
	decorators: [
		moduleMetadata({
			imports: [ContentSwitcherModule]
		})
	],
	argTypes: {
		size: { control: "radio", options: ["sm", "md", "lg"] },
		lowContrast: { control: "boolean" },
		selected: { action: "selected" }
	},
	args: {
		size: "md",
		lowContrast: false
	}
} as Meta;

export const Basic = (args) => ({
	props: args,
	template: `
		<cds-content-switcher
			value="first"
			[size]="size"
			[lowContrast]="lowContrast"
			(selected)="selected($event)">
			<cds-content-switcher-item name="first">First section</cds-content-switcher-item>
			<cds-content-switcher-item name="second">Second section</cds-content-switcher-item>
			<cds-content-switcher-item name="third">Third section</cds-content-switcher-item>
		</cds-content-switcher>
	`
});

export const WithDisabledOption = (args) => ({
	props: args,
	template: `
		<cds-content-switcher value="first" (selected)="selected($event)">
			<cds-content-switcher-item name="first">First</cds-content-switcher-item>
			<cds-content-switcher-item name="second" [disabled]="true">Second (disabled)</cds-content-switcher-item>
			<cds-content-switcher-item name="third">Third</cds-content-switcher-item>
		</cds-content-switcher>
	`
});
WithDisabledOption.storyName = "With Disabled Option";
