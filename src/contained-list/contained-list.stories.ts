/**
 * Storybook stories for the Angular contained-list directive layer.
 * The directives map the old @Input API onto the contained-list web components.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { ContainedListModule } from "./index";

export default {
	title: "Components/Contained List",
	decorators: [
		moduleMetadata({
			imports: [ContainedListModule]
		})
	],
	argTypes: {
		kind: { control: "radio", options: ["on-page", "disclosed"] },
		size: { control: "radio", options: ["sm", "md", "lg", "xl"] },
		isInset: { control: "boolean" },
		label: { control: "text" }
	},
	args: {
		kind: "on-page",
		size: "lg",
		isInset: false,
		label: "List title"
	}
} as Meta;

export const Basic = (args) => ({
	props: args,
	template: `
		<cds-contained-list
			[label]="label"
			[kind]="kind"
			[size]="size"
			[isInset]="isInset">
			<cds-contained-list-item>List item</cds-contained-list-item>
			<cds-contained-list-item>List item</cds-contained-list-item>
			<cds-contained-list-item [disabled]="true">Disabled list item</cds-contained-list-item>
			<cds-contained-list-item>List item</cds-contained-list-item>
		</cds-contained-list>
	`
});
