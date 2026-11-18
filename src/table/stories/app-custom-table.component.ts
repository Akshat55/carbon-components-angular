import {
	TemplateRef,
	Component,
	ViewChild,
	Input,
	AfterViewInit
} from "@angular/core";
import { TableModel } from "../table-model.class";
import { TableItem } from "../table-item.class";
import { TableHeaderItem } from "../table-header-item.class";
import { clone } from "carbon-components-angular/utils";
import { Table } from "../table.component";
import { TableToolbar, TableToolbarContent } from "../table-parts.component";
import { CdsButton } from "carbon-components-angular/button";

export class CustomHeaderItem extends TableHeaderItem {
	// used for custom sorting
	compare(one: TableItem, two: TableItem) {
		const stringOne = (one.data.name || one.data.surname || one.data).toLowerCase();
		const stringTwo = (two.data.name || two.data.surname || two.data).toLowerCase();

		if (stringOne > stringTwo) {
			return 1;
		} else if (stringOne < stringTwo) {
			return -1;
		} else {
			return 0;
		}
	}
}

@Component({
	selector: "app-custom-table",
	template: `
		<ng-template #customTableItemTemplate let-data="data">
			<a [attr.href]="data.link">{{data.name}} {{data.surname}}</a>
		</ng-template>
		<ng-template #customHeaderTemplate let-data="data">
			<i><a [attr.href]="data.link">{{data.name}}</a></i>
		</ng-template>

		<cds-table
			[model]="model"
			[size]="size"
			[isSortable]="isSortable"
			[isSelectable]="isSelectable"
			[useZebraStyles]="useZebraStyles"
			(rowClick)="onRowClick($event)"
			(sort)="customSort($event)">
			<ng-content />
			<cds-table-toolbar slot="toolbar">
				<cds-table-toolbar-content>
					<cds-button (click)="addRow()">Add row</cds-button>
					<cds-button (click)="addColumn()">Add column</cds-button>
				</cds-table-toolbar-content>
			</cds-table-toolbar>
		</cds-table>
	`,
	standalone: true,
	imports: [Table, TableToolbar, TableToolbarContent, CdsButton]
})
export class DynamicTableStory implements AfterViewInit {
	@Input() model = new TableModel();
	@Input() size = "md";
	@Input() isSelectable = true;
	@Input() useZebraStyles = true;
	@Input() isSortable = true;

	@ViewChild("customHeaderTemplate")
	protected customHeaderTemplate: TemplateRef<any>;

	@ViewChild("customTableItemTemplate")
	protected customTableItemTemplate: TemplateRef<any>;

	ngAfterViewInit() {
		this.model.data = [
			[
				new TableItem({ data: "Name 1" }),
				new TableItem({ data: { name: "Lessy", link: "#" }, template: this.customTableItemTemplate })
			],
			[new TableItem({ data: "Name 3" }), new TableItem({ data: "swer" })],
			[
				new TableItem({ data: "Name 2" }),
				new TableItem({ data: { name: "Alice", surname: "Bob" }, template: this.customTableItemTemplate })
			],
			[new TableItem({ data: "Name 4" }), new TableItem({ data: "twer" })],
			[new TableItem({ data: "Name 5" }), new TableItem({ data: "twer" })],
			[new TableItem({ data: "Name 6" }), new TableItem({ data: "twer" })],
			[new TableItem({ data: "Name 7" }), new TableItem({ data: "twer" })],
			[new TableItem({ data: "Name 8" }), new TableItem({ data: "twer" })]
		];
		this.model.header = [
			new TableHeaderItem({ data: "Very long title indeed" }),
			new CustomHeaderItem({
				data: { name: "Custom header", link: "#" },
				template: this.customHeaderTemplate
			})
		];
	}

	customSort(index: number) {
		this.sort(this.model, index);
	}

	sort(model, index: number) {
		if (model.header[index].sorted) {
			// if already sorted flip sorting direction
			model.header[index].ascending = model.header[index].descending;
		}
		model.sort(index);
	}

	addRow() {
		const lastRowCopy = clone(this.model.row(this.model.data.length - 1));
		this.model.addRow(lastRowCopy);
	}

	addColumn() {
		let column = Array(this.model.data.length).fill(null).map(() => new TableItem({ data: `Column ${this.model.row(0).length}` }));
		this.model.addColumn(column);
	}

	onRowClick(index: number) {
		// eslint-disable-next-line no-console
		console.log("Row item selected:", index);
	}
}
