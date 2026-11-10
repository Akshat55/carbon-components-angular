import { FormsModule } from "@angular/forms";
import { moduleMetadata, Meta } from "@storybook/angular";
import { StructuredList, StructuredListModule } from "./";

export default {
	title: "Components/Structured List",
	decorators: [
		moduleMetadata({
			imports: [
				FormsModule,
				StructuredListModule
			]
		})
	],
	component: StructuredList
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<cds-structured-list [condensed]="condensed" [ariaLabel]="ariaLabel">
			<cds-structured-list-head><cds-structured-list-header-row>
				<cds-structured-list-header-cell nowrap="true">Column 1</cds-structured-list-header-cell>
				<cds-structured-list-header-cell nowrap="true">Column 2</cds-structured-list-header-cell>
				<cds-structured-list-header-cell>Column 3</cds-structured-list-header-cell>
			</cds-structured-list-header-row></cds-structured-list-head><cds-structured-list-body>
			<cds-structured-list-row>
				<cds-structured-list-cell>Row 1</cds-structured-list-cell>
				<cds-structured-list-cell nowrap="true">Row One</cds-structured-list-cell>
				<cds-structured-list-cell>
					Lorem ipsum dolor sit amet,
					consectetur adipiscing elit. Nunc dui magna,
					finibus id tortor sed, aliquet bibendum augue.
					Aenean posuere sem vel euismod dignissim. Nulla ut cursus dolor.
					Pellentesque vulputate nisl a porttitor interdum.
				</cds-structured-list-cell>
			</cds-structured-list-row>
			<cds-structured-list-row>
				<cds-structured-list-cell>Row 2</cds-structured-list-cell>
				<cds-structured-list-cell nowrap="true">Row Two</cds-structured-list-cell>
				<cds-structured-list-cell>
					Lorem ipsum dolor sit amet,
					consectetur adipiscing elit. Nunc dui magna,
					finibus id tortor sed, aliquet bibendum augue.
					Aenean posuere sem vel euismod dignissim. Nulla ut cursus dolor.
					Pellentesque vulputate nisl a porttitor interdum.
				</cds-structured-list-cell>
			</cds-structured-list-row>
		</cds-structured-list-body></cds-structured-list>
	`
});
export const Basic = Template.bind({});
Basic.args = {
	condensed: false,
	ariaLabel: "Sample structured list"
};

const SelectionTemplate = (args) => ({
	props: args,
	template: `
		<cds-structured-list
			[condensed]="condensed"
			[selection]="true"
			[(ngModel)]="valueSelected">
			<cds-structured-list-head><cds-structured-list-header-row>
				<cds-structured-list-header-cell nowrap="true">Column 1</cds-structured-list-header-cell>
				<cds-structured-list-header-cell nowrap="true">Column 2</cds-structured-list-header-cell>
				<cds-structured-list-header-cell>Column 3</cds-structured-list-header-cell>
			</cds-structured-list-header-row></cds-structured-list-head><cds-structured-list-body>
			<cds-structured-list-row value="row1">
				<cds-structured-list-cell>Row 1</cds-structured-list-cell>
				<cds-structured-list-cell nowrap="true">Row One</cds-structured-list-cell>
				<cds-structured-list-cell>
					Lorem ipsum dolor sit amet,
					consectetur adipiscing elit. Nunc dui magna,
					finibus id tortor sed, aliquet bibendum augue.
					Aenean posuere sem vel euismod dignissim. Nulla ut cursus dolor.
					Pellentesque vulputate nisl a porttitor interdum.
				</cds-structured-list-cell>
			</cds-structured-list-row>
			<cds-structured-list-row value="row2">
				<cds-structured-list-cell>Row 2</cds-structured-list-cell>
				<cds-structured-list-cell nowrap="true">Row Two</cds-structured-list-cell>
				<cds-structured-list-cell>
					Lorem ipsum dolor sit amet,
					consectetur adipiscing elit. Nunc dui magna,
					finibus id tortor sed, aliquet bibendum augue.
					Aenean posuere sem vel euismod dignissim. Nulla ut cursus dolor.
					Pellentesque vulputate nisl a porttitor interdum.
				</cds-structured-list-cell>
			</cds-structured-list-row>
			<cds-structured-list-row value="row3">
				<cds-structured-list-cell>Row 3</cds-structured-list-cell>
				<cds-structured-list-cell nowrap="true">Row Three</cds-structured-list-cell>
				<cds-structured-list-cell>
					Lorem ipsum dolor sit amet,
					consectetur adipiscing elit. Nunc dui magna,
					finibus id tortor sed, aliquet bibendum augue.
					Aenean posuere sem vel euismod dignissim. Nulla ut cursus dolor.
					Pellentesque vulputate nisl a porttitor interdum.
				</cds-structured-list-cell>
			</cds-structured-list-row>
			<cds-structured-list-row value="row4">
				<cds-structured-list-cell>Row 4</cds-structured-list-cell>
				<cds-structured-list-cell nowrap="true">Row Four</cds-structured-list-cell>
				<cds-structured-list-cell>
					Lorem ipsum dolor sit amet,
					consectetur adipiscing elit. Nunc dui magna,
					finibus id tortor sed, aliquet bibendum augue.
					Aenean posuere sem vel euismod dignissim. Nulla ut cursus dolor.
					Pellentesque vulputate nisl a porttitor interdum.
				</cds-structured-list-cell>
			</cds-structured-list-row>
		</cds-structured-list-body></cds-structured-list>
		<p>{{valueSelected}}</p>
	`
});
export const Selection = SelectionTemplate.bind({});
Selection.args = {
	...Basic.args
};

const SkeletonTemplate = (args) => ({
	props: args,
	template: `
		<cds-structured-list
			[condensed]="condensed">
			<cds-structured-list-head><cds-structured-list-header-row>
				<cds-structured-list-header-cell-skeleton />
				<cds-structured-list-header-cell-skeleton />
				<cds-structured-list-header-cell-skeleton />
			</cds-structured-list-header-row></cds-structured-list-head><cds-structured-list-body>
			<cds-structured-list-row>
				<cds-structured-list-cell></cds-structured-list-cell>
				<cds-structured-list-cell></cds-structured-list-cell>
				<cds-structured-list-cell></cds-structured-list-cell>
			</cds-structured-list-row>
			<cds-structured-list-row>
				<cds-structured-list-cell></cds-structured-list-cell>
				<cds-structured-list-cell></cds-structured-list-cell>
				<cds-structured-list-cell></cds-structured-list-cell>
			</cds-structured-list-row>
		</cds-structured-list-body></cds-structured-list>
	`
});
export const Skeleton = SkeletonTemplate.bind({});
Skeleton.args = {
	...Basic.args
};
