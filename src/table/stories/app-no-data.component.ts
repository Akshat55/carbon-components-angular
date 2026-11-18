import {
	Component,
	OnInit,
	Input,
	OnChanges,
	SimpleChanges
} from "@angular/core";
import { TableModel } from "../table-model.class";
import { TableHeaderItem } from "../table-header-item.class";
import { Table } from "../table.component";

@Component({
	selector: "app-no-data-table",
	template: `
		<cds-table
			[model]="model"
			[size]="size"
			[isSelectable]="isSelectable"
			[useZebraStyles]="useZebraStyles">
			<ng-content />
		</cds-table>
	`,
	standalone: true,
	imports: [Table]
})
export class TableNoDataStory implements OnInit, OnChanges {
	@Input() model = new TableModel();
	@Input() size = "md";
	@Input() isSelectable = true;
	@Input() useZebraStyles = true;
	@Input() isSortable = true;

	ngOnInit() {
		this.model.header = [
			new TableHeaderItem({
				data: "Name"
			}),
			new TableHeaderItem({
				data: "hwer",
				className: "my-class"
			})
		];
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.isSortable) {
			for (let column of this.model.header) {
				column.sortable = changes.isSortable.currentValue;
			}
		}
	}
}
