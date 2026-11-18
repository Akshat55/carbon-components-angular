import {
	Component,
	OnInit,
	Input,
	OnChanges,
	SimpleChanges
} from "@angular/core";
import { TableModel } from "../table-model.class";
import { TableHeaderItem } from "../table-header-item.class";
import { TableItem } from "../table-item.class";
import { Table } from "../table.component";

@Component({
	selector: "app-table",
	template: `
		<cds-table
			[model]="model"
			[size]="size"
			[isSelectable]="isSelectable"
			[radio]="radio"
			(rowClick)="onRowClick($event)"
			[isSortable]="isSortable"
			[useZebraStyles]="useZebraStyles">
			<ng-content />
		</cds-table>
	`,
	standalone: true,
	imports: [Table]
})
export class TableStory implements OnInit, OnChanges {
	@Input() model = new TableModel();
	@Input() size = "md";
	@Input() isSelectable = true;
	@Input() radio = false;
	@Input() useZebraStyles = true;
	@Input() isSortable = true;
	@Input() noData = false;

	ngOnInit() {
		this.model.header = [
			new TableHeaderItem({
				data: "Name",
				title: "Table header title"
			}),
			new TableHeaderItem({
				data: "hwer",
				className: "my-class"
			})
		];

		// eslint-disable-next-line no-console
		this.model.rowsSelectedChange.subscribe(event => console.log(event));
		// eslint-disable-next-line no-console
		this.model.selectAllChange.subscribe(event => console.log(event ? "All rows selected!" : "All rows deselected!"));

		if (!this.noData) {
			this.model.data = [
				[new TableItem({ data: "Name 1", title: "Table item title" }), new TableItem({ data: "qwer" })],
				[new TableItem({ data: "Name 3" }), new TableItem({ data: "zwer" })],
				[new TableItem({ data: "Name 2" }), new TableItem({ data: "swer" })],
				[new TableItem({ data: "Name 4" }), new TableItem({data: "twer"})],
				[new TableItem({ data: "Name 5" }), new TableItem({data: "twer"})],
				[new TableItem({ data: "Name 6" }), new TableItem({data: "twer"})],
				[new TableItem({ data: "Name 7" }), new TableItem({data: "twer"})]
			];
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.isSortable) {
			for (let column of this.model.header) {
				column.sortable = changes.isSortable.currentValue;
			}
		}
	}

	onRowClick(index: number) {
		// eslint-disable-next-line no-console
		console.log("Row item selected:", index);
	}
}
