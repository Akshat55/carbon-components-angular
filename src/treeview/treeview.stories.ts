/* tslint:disable variable-name */

import { CommonModule } from "@angular/common";
import { moduleMetadata } from "@storybook/angular";
import { Story, Meta } from "@storybook/angular/types-6-0";
import {
	TreeviewModule,
	TreeViewComponent,
	TreeNodeComponent
} from "./";

export default {
	title: "Components/Tree view",
	decorators: [
		moduleMetadata({
			imports: [CommonModule, TreeviewModule]
		})
	],
	component: TreeViewComponent,
	subcomponents: TreeNodeComponent
} as Meta;

const nodes = [
	{
		id: '1',
		value: 'Artificial intelligence',
		label: "Artificial intelligence",
	},
	{
		id: '2',
		value: 'Blockchain',
		label: 'Blockchain',
	},
	{
		id: '3',
		value: 'Business automation',
		label: 'Business automation',
		children: [
			{
				id: '3-1',
				value: 'Business process automation',
				label: 'Business process automation',
			},
			{
				id: '3-2',
				value: 'Business process mapping',
				label: 'Business process mapping',
			},
		],
	},
	{
		id: '4',
		value: 'Business operations',
		label: 'Business operations',
	},
	{
		id: '5',
		value: 'Cloud computing',
		label: 'Cloud computing',
		isExpanded: true,
		children: [
			{
				id: '5-1',
				value: 'Containers',
				label: 'Containers',
			},
			{
				id: '5-2',
				value: 'Databases',
				label: 'Databases',
			},
			{
				id: '5-3',
				value: 'DevOps',
				label: 'DevOps',
				isExpanded: true,
				children: [
					{
						id: '5-4',
						value: 'Solutions',
						label: 'Solutions',
					},
					{
						id: '5-5',
						value: 'Case studies',
						label: 'Case studies',
						isExpanded: true,
						children: [
							{
								id: '5-6',
								value: 'Resources',
								label: 'Resources',
							},
						],
					},
				],
			},
		],
	},
	{
		id: '6',
		value: 'Data & Analytics',
		label: 'Data & Analytics',
		children: [
			{
				id: '6-1',
				value: 'Big data',
				label: 'Big data',
			},
			{
				id: '6-2',
				value: 'Business intelligence',
				label: 'Business intelligence',
			},
		],
	},
	{
		id: '7',
		value: 'IT infrastructure',
		label: 'IT infrastructure',
		isExpanded: true,
		disabled: true,
		children: [
			{
				id: '7-1',
				value: 'Data storage',
				label: 'Data storage',
			},
			{
				id: '7-2',
				value: 'Enterprise servers',
				label: 'Enterprise servers',
			},
			{
				id: '8',
				value: 'Hybrid cloud infrastructure',
				label: 'Hybrid cloud infrastructure',
				isExpanded: true,
				children: [
					{
						id: '8-1',
						value: 'Insights',
						label: 'Insights',
					},
					{
						id: '8-2',
						value: 'Benefits',
						label: 'Benefits',
					},
				],
			},
		],
	},
];

const Template: Story<TreeViewComponent> = (args) => ({
	props: args,
	template: `

	<!--
		<cds-tree-view label="Tree view" style="width: 18rem; display: block;">
			<cds-tree-node label="Artificial Intelligence" [expanded]="true">
				<cds-tree-node label="test"></cds-tree-node>
			</cds-tree-node>
			<cds-tree-node label="Blockchain"></cds-tree-node>
			<cds-tree-node label="Business Automation"></cds-tree-node>
			<cds-tree-node label="Business operation"></cds-tree-node>
			<cds-tree-node label="Cloud computing"></cds-tree-node>
		</cds-tree-view>
	-->
		<cds-tree-view
			label="Tree view"
			style="width: 18rem; display: block;"
			[tree]="tree">
		</cds-tree-view>
	`
});
export const Basic = Template.bind({});
Basic.args = {
	tree: nodes
}
Basic.argTypes = {
	tree: {
		control: false
	}
}




