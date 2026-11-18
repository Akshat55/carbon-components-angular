import { moduleMetadata, componentWrapperDecorator, Meta } from "@storybook/angular";
import { CdsColumn, CdsGrid } from "./";

export default {
	title: "Components/Grid",
	decorators: [
		moduleMetadata({
			imports: [CdsGrid, CdsColumn]
		}),
		componentWrapperDecorator((story) => `<div class="grid-story">${story}</div>`)
	],
	args: {
		condensed: false,
		narrow: false,
		fullWidth: false
	},
	component: CdsGrid,
	subcomponents: {
		CdsColumn
	}
} as Meta;

const styles = [`
	.grid-story cds-column {
		background: var(--cds-layer-accent-01, #e0e0e0);
		min-height: 3rem;
		padding: 0.5rem;
	}
`];

const Template = (args) => ({
	props: args,
	template: `
		<cds-grid [condensed]="condensed" [narrow]="narrow" [fullWidth]="fullWidth">
			<cds-column [sm]="4"></cds-column>
			<cds-column [sm]="4"></cds-column>
			<cds-column [sm]="4"></cds-column>
			<cds-column [sm]="4"></cds-column>
		</cds-grid>
	`,
	styles
});
export const Basic = Template.bind({});

const ResponsiveTemplate = (args) => ({
	props: args,
	template: `
		<cds-grid [condensed]="condensed" [narrow]="narrow" [fullWidth]="fullWidth">
			<cds-column [sm]="2" [md]="4" [lg]="6">
				<p>Small: Span 2 of 4</p>
				<p>Medium: Span 4 of 8</p>
				<p>Large: Span 6 of 16</p>
			</cds-column>
			<cds-column [sm]="2" [md]="2" [lg]="3">
				<p>Small: Span 2 of 4</p>
				<p>Medium: Span 2 of 8</p>
				<p>Large: Span 3 of 16</p>
			</cds-column>
			<cds-column [sm]="0" [md]="2" [lg]="3">
				<p>Small: Span 0 of 4</p>
				<p>Medium: Span 2 of 8</p>
				<p>Large: Span 3 of 16</p>
			</cds-column>
			<cds-column [sm]="0" [md]="0" lg="25%">
				<p>Small: Span 0 of 4</p>
				<p>Medium: Span 0 of 8</p>
				<p>Large: Span 25%</p>
			</cds-column>
		</cds-grid>
	`,
	styles
});
export const Responsive = ResponsiveTemplate.bind({});

const SubgridTemplate = (args) => ({
	props: args,
	template: `
		<!-- A cds-grid inside a cds-column is a subgrid. -->
		<cds-grid [condensed]="condensed" [narrow]="narrow" [fullWidth]="fullWidth">
			<cds-column [sm]="2" [md]="4" [lg]="3">
				<p>Small: Span 2 of 4</p>
				<p>Medium: Span 4 of 8</p>
				<p>Large: Span 3 of 16</p>
			</cds-column>
			<cds-column [sm]="2" [md]="4" [lg]="10">
				<p>Small: Span 2 of 4</p>
				<p>Medium: Span 4 of 8</p>
				<p>Large: Span 10 of 16</p>
				<cds-grid>
					<cds-column [sm]="1" [md]="1" [lg]="2">
						<p>Small: Span 1 of 2</p>
						<p>Medium: Span 1 of 4</p>
						<p>Large: Span 2 of 10</p>
					</cds-column>
					<cds-column [sm]="1" [md]="1" [lg]="2">
						<p>Small: Span 1 of 2</p>
						<p>Medium: Span 1 of 4</p>
						<p>Large: Span 2 of 10</p>
					</cds-column>
					<cds-column [sm]="0" [md]="1" [lg]="1">
						<p>Small: Span 0 of 2</p>
						<p>Medium: Span 1 of 4</p>
						<p>Large: Span 1 of 10</p>
					</cds-column>
					<cds-column [sm]="0" [md]="1" [lg]="5">
						<p>Small: Span 0 of 2</p>
						<p>Medium: Span 1 of 4</p>
						<p>Large: Span 5 of 10</p>
					</cds-column>
				</cds-grid>
			</cds-column>
			<cds-column [sm]="0" [md]="0" [lg]="3">
				<p>Small: Span 0 of 4</p>
				<p>Medium: Span 0 of 8</p>
				<p>Large: Span 3 of 16</p>
			</cds-column>
		</cds-grid>
	`,
	styles
});
export const Subgrid = SubgridTemplate.bind({});
