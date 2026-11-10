/**
 * Storybook stories for the Angular structured-list directive layer.
 * The directives map the old @Input/@Output API onto the structured-list
 * web components.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { StructuredListModule } from "./index";

export default {
	title: "Components/Structured List",
	decorators: [
		moduleMetadata({
			imports: [StructuredListModule]
		})
	],
	argTypes: {
		selection: { control: "boolean" },
		condensed: { control: "boolean" },
		flushed: { control: "boolean" },
		selected: { action: "selected" }
	},
	args: {
		selection: false,
		condensed: false,
		flushed: false
	}
} as Meta;

export const Basic = (args) => ({
	props: args,
	template: `
		<cds-structured-list
			[selection]="selection"
			[condensed]="condensed"
			[flushed]="flushed"
			(selected)="selected($event)">
			<cds-structured-list-head>
				<cds-structured-list-header-row>
					<cds-structured-list-header-cell>Column A</cds-structured-list-header-cell>
					<cds-structured-list-header-cell>Column B</cds-structured-list-header-cell>
					<cds-structured-list-header-cell>Column C</cds-structured-list-header-cell>
				</cds-structured-list-header-row>
			</cds-structured-list-head>
			<cds-structured-list-body>
				<cds-structured-list-row value="row-1">
					<cds-structured-list-cell>Row 1</cds-structured-list-cell>
					<cds-structured-list-cell>Row 1</cds-structured-list-cell>
					<cds-structured-list-cell>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</cds-structured-list-cell>
				</cds-structured-list-row>
				<cds-structured-list-row value="row-2">
					<cds-structured-list-cell>Row 2</cds-structured-list-cell>
					<cds-structured-list-cell>Row 2</cds-structured-list-cell>
					<cds-structured-list-cell>Ut enim ad minim veniam, quis nostrud exercitation.</cds-structured-list-cell>
				</cds-structured-list-row>
			</cds-structured-list-body>
		</cds-structured-list>
	`
});
