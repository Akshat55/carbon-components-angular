import { Component, OnInit, OnDestroy } from "@angular/core";
import { moduleMetadata, Meta } from "@storybook/angular";
import {
	TableModel,
	TableHeaderItem,
	TableItem,
	Table
} from "../../table/index";
import { Hamburger, Header } from "../../ui-shell";
import { Dropdown, DropdownList } from "../../dropdown";
import { CdsColumn, CdsGrid } from "../../grid/index";
import { TableRow } from "../../table/table-row.class";

@Component({
	selector: "app-sample-multi-selection",
	template: `
	<div>
		<div class="header">
			<cds-header name="Patterns">
				<cds-header-menu-button></cds-header-menu-button>
			</cds-header>
		</div>
		<cds-grid>
			<cds-column lg="3" md="3" sm="3">
				<label class="dropdown-label">
					Filter by:
					<cds-dropdown
						class="filter-dropdown"
						type="multi"
						placeholder="Type"
						inline="true"
						(selected)="onSelected($event)">
						<cds-dropdown-list [items]="items"></cds-dropdown-list>
					</cds-dropdown>
				</label>
			</cds-column>
		</cds-grid>
		<cds-grid>
			<cds-column lg="12" md="12" sm="12">
				<cds-table
					class="data-table"
					[model]="model"
					size="lg"
					[isSelectable]="false">
				</cds-table>
			</cds-column>
		</cds-grid>
	</div>
	`,
	styles: [`
		.header {
			margin-bottom: 80px;
		}

		.dropdown-label {
			display: flex;
			align-items: center;
		}

		.data-table {
			width: 100%;
		}

		.filter-dropdown {
			margin-left: 20px;
			flex-grow: 1;
		}
	`
	],
	standalone: true,
	imports: [
		CdsGrid,
		CdsColumn,
		Header,
		Table,
		Dropdown,
		DropdownList,
		Hamburger
	]
})
class SampleMultiSelection implements OnInit, OnDestroy {
	model = new TableModel();

	items = [
		{ content: "Vegetable" },
		{ content: "Fruit" },
		{ content: "Meat" }
	];

	dataset = [
		{ name: "Apple", type: ["Fruit"] },
		{ name: "Grape", type: ["Fruit"] },
		{ name: "Eggplant", type: ["Fruit"] },
		{ name: "FruitVegMeat", type: ["Fruit", "Vegetable", "Meat"] },
		{ name: "Lettuce", type: ["Vegetable"] },
		{ name: "Daikon Radish", type: ["Vegetable"] },
		{ name: "Beef", type: ["Meat"] }
	];

	onSelected(event) {
		const checkboxFilters = event.map(filter => filter.content);

		this.model.data =
			this.dataset
				.filter(data => checkboxFilters.every(filter => data.type.includes(filter)))
				.map(filteredData =>
					[
						new TableItem({ data: filteredData.name }),
						new TableItem({ data: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." })
					]);
	}

	ngOnInit() {
		document.querySelector(".sb-show-main")?.classList.add("full-page");
		this.model.header = [new TableHeaderItem({ data: "Name" }), new TableHeaderItem({ data: "Description" })];

		this.model.data = this.dataset.map(datapoint =>
			[
				new TableItem({ data: datapoint.name }),
				new TableItem({ data: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." })
			]
		);
	}

	ngOnDestroy() {
		document.querySelector(".sb-show-main")?.classList.remove("full-page");
	}
}

// Storybook starts here
export default {
	title: "Pattern/Filtering",
	decorators: [
		moduleMetadata({
			imports: [
				SampleMultiSelection
			]
		})
	]
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<!--
			app-* components are for demo purposes only.
			You can create your own implementation by using the component source as an example.
		-->
		<app-sample-multi-selection></app-sample-multi-selection>
	`
});
export const MultiSelection = Template.bind({});
