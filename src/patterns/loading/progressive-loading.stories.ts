import { Component, OnInit, OnDestroy } from "@angular/core";
import { moduleMetadata, Meta } from "@storybook/angular";
import {
	TableModel,
	TableHeaderItem,
	TableItem,
	TableSkeleton,
	Table
} from "../../table";
import { Dropdown, DropdownList, DropdownSkeleton } from "../../dropdown";
import {
	CdsColumn,
	CdsGrid
} from "../../grid";
import { CdsButton } from "../../button";
import { Checkbox } from "../../checkbox";
import { Hamburger, Header } from "../../ui-shell";

@Component({
	selector: "app-sample-progressive-loading",
	template: `
	<div>
		<div class="header">
			<cds-header name="Patterns">
				<cds-header-menu-button></cds-header-menu-button>
			</cds-header>
		</div>
		<cds-grid class="actions">
			<cds-column lg="3" md="2" sm="1">
				@if (skeletonStateDropdown) {
					<cds-dropdown-skeleton />
				} @else {
					<cds-dropdown
						label="Example 1"
						type="multi"
						[placeholder]="placeholder"
						inline="true">
						<cds-dropdown-list [items]="items"></cds-dropdown-list>
					</cds-dropdown>
				}
			</cds-column>

			<cds-column lg="3" md="2" sm="1">
				@if (skeletonStateDropdown) {
					<cds-dropdown-skeleton />
				} @else {
					<cds-dropdown
						label="Example 2"
						type="multi"
						[placeholder]="placeholder"
						inline="true">
						<cds-dropdown-list [items]="items"></cds-dropdown-list>
					</cds-dropdown>
				}
			</cds-column>

			<cds-column lg="3" md="2" sm="1">
				@if (skeletonStateDropdown) {
					<cds-dropdown-skeleton />
				} @else {
					<cds-dropdown
						label="Example 3"
						type="multi"
						[placeholder]="placeholder"
						inline="true">
						<cds-dropdown-list [items]="items"></cds-dropdown-list>
					</cds-dropdown>
				}
			</cds-column>

			<cds-column lg="3" md="2" sm="1">
				<cds-button (click)="loadScreen(); uninitializeData()">Show Loading</cds-button>
			</cds-column>
		</cds-grid>
		<cds-grid>
			<cds-column lg="12" md="12" sm="12">
				@if (skeletonStateTable) {
					<cds-table-skeleton [columnCount]="2" [rowCount]="dataset.length || 5" [showHeader]="false" [showToolbar]="false" />
				} @else {
					<cds-table
						class="data-table"
						[model]="model"
						size="lg"
						[isSelectable]="false">
					</cds-table>
				}
			</cds-column>
		</cds-grid>
	</div>
	`,
	styles: [`
		.header {
			margin-bottom: 80px;
		}

		.data-table {
			width: 100%;
		}

		.actions {
			margin-bottom: 40px;
		}
		`
	],
	standalone: true,
	imports: [
		CdsGrid,
		CdsColumn,
		Checkbox,
		Dropdown,
		DropdownList,
		DropdownSkeleton,
		Table,
		TableSkeleton,
		CdsButton,
		Header,
		Hamburger
	]
})
class SampleProgressiveLoading implements OnInit, OnDestroy {
	model = new TableModel();
	skeletonStateTable = true;
	skeletonStateDropdown = true;
	placeholder: string | null = null;

	dataset = [
		{ name: "Apple", type: "Fruit" },
		{ name: "Grape", type: "Fruit" },
		{ name: "Eggplant", type: "Fruit" },
		{ name: "Lettuce", type: "Vegetable" },
		{ name: "Daikon Radish", type: "Vegetable" },
		{ name: "Beef", type: "Meat" }
	];

	items = [
		{ content: "Vegetable" },
		{ content: "Fruit" },
		{ content: "Meat" }
	];

	uninitializeData() {
		this.skeletonStateTable = true;
		this.skeletonStateDropdown = true;
		this.placeholder = null;
	}

	loadScreen() {
		this.model.data = this.dataset.map(datapoint => [new TableItem({}), new TableItem({})]);

		this.model.header = [new TableHeaderItem({ data: "" }), new TableHeaderItem({ data: "" })];

		setTimeout(() => {
			this.skeletonStateDropdown = false;
			this.placeholder = "Type";
		}, 2000);

		setTimeout(() => {
			this.skeletonStateTable = false;
		}, 4000);

		setTimeout(() => {
			this.model.header = [new TableHeaderItem({ data: "Name" }), new TableHeaderItem({ data: "Description" })];

			this.model.data = this.dataset.map(datapoint =>
				[
					new TableItem({ data: datapoint.name }),
					new TableItem({ data: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." })
				]
			);
		}, 4000);
	}

	ngOnInit() {
		document.querySelector(".sb-show-main")?.classList.add("full-page");
		this.loadScreen();
	}

	ngOnDestroy() {
		document.querySelector(".sb-show-main")?.classList.remove("full-page");
	}
}

// Storybook starts here
export default {
	title: "Pattern/Loading",
	decorators: [
		moduleMetadata({
			imports: [
				SampleProgressiveLoading
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
		<app-sample-progressive-loading></app-sample-progressive-loading>
	`
});
export const ProgressiveLoading = Template.bind({});
