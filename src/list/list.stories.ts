import { moduleMetadata, Meta } from "@storybook/angular";
import { CdsListItem, CdsOrderedList, CdsUnorderedList } from "./";

export default {
	title: "Components/List",
	decorators: [
		moduleMetadata({
			imports: [CdsOrderedList, CdsUnorderedList, CdsListItem]
		})
	],
	parameters: {
		layout: "centered"
	},
	args: {
		isExpressive: false
	},
	component: CdsUnorderedList
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<p>Ordered List</p>
		<cds-ordered-list [isExpressive]="isExpressive">
			<cds-list-item>One</cds-list-item>
			<cds-list-item>Two</cds-list-item>
			<cds-list-item>Three</cds-list-item>
		</cds-ordered-list>
		<p>Unordered List</p>
		<cds-unordered-list [isExpressive]="isExpressive">
			<cds-list-item>One</cds-list-item>
			<cds-list-item>Two</cds-list-item>
			<cds-list-item>Three</cds-list-item>
		</cds-unordered-list>
	`
});
export const Basic = Template.bind({});

const NestingTemplate = (args) => ({
	props: args,
	template: `
		<p>Ordered List</p>
		<cds-ordered-list [isExpressive]="isExpressive">
			<cds-list-item>
				One
				<cds-ordered-list nested>
					<cds-list-item>Nested one</cds-list-item>
					<cds-list-item>Nested two</cds-list-item>
					<cds-list-item>Nested three</cds-list-item>
				</cds-ordered-list>
			</cds-list-item>
			<cds-list-item>Two</cds-list-item>
			<cds-list-item>Three</cds-list-item>
		</cds-ordered-list>
		<p>Unordered List</p>
		<cds-unordered-list [isExpressive]="isExpressive">
			<cds-list-item>
				One
				<cds-unordered-list nested [isExpressive]="isExpressive">
					<cds-list-item>Nested one</cds-list-item>
					<cds-list-item>Nested two</cds-list-item>
					<cds-list-item>Nested three</cds-list-item>
				</cds-unordered-list>
			</cds-list-item>
			<cds-list-item>Two</cds-list-item>
			<cds-list-item>Three</cds-list-item>
		</cds-unordered-list>
	`
});
export const Nesting = NestingTemplate.bind({});
