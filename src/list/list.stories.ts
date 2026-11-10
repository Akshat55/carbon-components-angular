/**
 * Storybook stories for the Angular list directive layer.
 * The directives map onto the <cds-ordered-list> / <cds-unordered-list>
 * web components (previously `[cdsList]` on native ol/ul elements).
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { ListModule } from "./index";

export default {
	title: "Components/List",
	decorators: [
		moduleMetadata({
			imports: [ListModule]
		})
	],
	argTypes: {
		isExpressive: { control: "boolean" }
	},
	args: {
		isExpressive: false
	}
} as Meta;

export const Unordered = (args) => ({
	props: args,
	template: `
		<cds-unordered-list [isExpressive]="isExpressive">
			<cds-list-item>Unordered list item</cds-list-item>
			<cds-list-item>
				Unordered list item
				<cds-unordered-list [nested]="true">
					<cds-list-item>Nested item</cds-list-item>
					<cds-list-item>Nested item</cds-list-item>
				</cds-unordered-list>
			</cds-list-item>
			<cds-list-item>Unordered list item</cds-list-item>
		</cds-unordered-list>
	`
});

export const Ordered = (args) => ({
	props: args,
	template: `
		<cds-ordered-list [isExpressive]="isExpressive">
			<cds-list-item>Ordered list item</cds-list-item>
			<cds-list-item>
				Ordered list item
				<cds-ordered-list [nested]="true">
					<cds-list-item>Nested item</cds-list-item>
					<cds-list-item>Nested item</cds-list-item>
				</cds-ordered-list>
			</cds-list-item>
			<cds-list-item>Ordered list item</cds-list-item>
		</cds-ordered-list>
	`
});
