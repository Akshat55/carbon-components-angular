/**
 * Storybook stories for the Angular tree-view directive layer.
 * The directive maps the old `[tree]` API onto the <cds-tree-view>
 * web component, generating <cds-tree-node> children.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { TreeviewModule } from "./index";

export default {
	title: "Components/Tree View",
	decorators: [
		moduleMetadata({
			imports: [TreeviewModule]
		})
	],
	argTypes: {
		label: { control: "text" },
		select: { action: "select" },
		toggle: { action: "toggle" }
	},
	args: {
		label: "Tree view"
	}
} as Meta;

const tree = [
	{
		label: "Artificial intelligence",
		expanded: true,
		children: [
			{ label: "Machine learning" },
			{ label: "Natural language processing" }
		]
	},
	{
		label: "Cloud computing",
		children: [
			{ label: "Containers" },
			{ label: "Serverless", disabled: true }
		]
	},
	{ label: "Data & Analytics" }
];

export const Basic = (args) => ({
	props: { ...args, tree },
	template: `
		<cds-tree-view
			[tree]="tree"
			[label]="label"
			(select)="select($event)"
			(toggle)="toggle($event)">
		</cds-tree-view>
	`
});

export const InlineNodes = (args) => ({
	props: args,
	template: `
		<cds-tree-view [label]="label" (select)="select($event)">
			<cds-tree-node label="Node one"></cds-tree-node>
			<cds-tree-node label="Node two" is-expanded>
				<cds-tree-node label="Child node"></cds-tree-node>
			</cds-tree-node>
		</cds-tree-view>
	`
});
InlineNodes.storyName = "With Inline Nodes";
