/**
 * Storybook stories for the Angular table directive layer.
 * The directive maps the old `TableModel` API onto the <cds-table>
 * web component. Markup-driven usage is also supported.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { TableModule } from "./index";
import { TableModel } from "./table-model.class";
import { TableHeaderItem } from "./table-header-item.class";
import { TableItem } from "./table-item.class";

export default {
	title: "Components/Table",
	decorators: [
		moduleMetadata({
			imports: [TableModule]
		})
	],
	argTypes: {
		size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
		striped: { control: "boolean" },
		sortable: { control: "boolean" },
		sort: { action: "sort" },
		rowClick: { action: "rowClick" }
	},
	args: {
		size: "md",
		striped: false,
		sortable: true
	}
} as Meta;

function buildModel(): TableModel {
	const model = new TableModel();
	model.header = [
		new TableHeaderItem({ data: "Name" }),
		new TableHeaderItem({ data: "Protocol" }),
		new TableHeaderItem({ data: "Port" }),
		new TableHeaderItem({ data: "Rule" })
	];
	model.data = [
		[new TableItem({ data: "Load Balancer 1" }), new TableItem({ data: "HTTP" }), new TableItem({ data: "80" }), new TableItem({ data: "Round robin" })],
		[new TableItem({ data: "Load Balancer 2" }), new TableItem({ data: "HTTPS" }), new TableItem({ data: "443" }), new TableItem({ data: "DNS delegation" })],
		[new TableItem({ data: "Load Balancer 3" }), new TableItem({ data: "TCP" }), new TableItem({ data: "3000" }), new TableItem({ data: "Round robin" })]
	];
	return model;
}

export const ModelDriven = (args) => ({
	props: { ...args, model: buildModel() },
	template: `
		<cds-table
			[model]="model"
			[size]="size"
			[striped]="striped"
			[sortable]="sortable"
			(sort)="sort($event)"
			(rowClick)="rowClick($event)">
		</cds-table>
	`
});
ModelDriven.storyName = "Model Driven (TableModel)";

export const MarkupDriven = (args) => ({
	props: args,
	template: `
		<cds-table [size]="size" [striped]="striped">
			<cds-table-head>
				<cds-table-header-row>
					<cds-table-header-cell>Name</cds-table-header-cell>
					<cds-table-header-cell>Protocol</cds-table-header-cell>
					<cds-table-header-cell>Port</cds-table-header-cell>
				</cds-table-header-row>
			</cds-table-head>
			<cds-table-body>
				<cds-table-row>
					<cds-table-cell>Load Balancer 1</cds-table-cell>
					<cds-table-cell>HTTP</cds-table-cell>
					<cds-table-cell>80</cds-table-cell>
				</cds-table-row>
				<cds-table-row>
					<cds-table-cell>Load Balancer 2</cds-table-cell>
					<cds-table-cell>HTTPS</cds-table-cell>
					<cds-table-cell>443</cds-table-cell>
				</cds-table-row>
			</cds-table-body>
		</cds-table>
	`
});
MarkupDriven.storyName = "Markup Driven";
