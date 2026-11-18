import {
	TemplateRef,
	Component,
	ViewChild,
	OnInit,
	Input
} from "@angular/core";
import { TableModel } from "../table-model.class";
import { TableHeaderItem } from "../table-header-item.class";
import { TableItem } from "../table-item.class";
import { Table } from "../table.component";
import { Pagination } from "../../pagination";

@Component({
	selector: "app-pagination-table",
	template: `
		<ng-template #paginationTableItemTemplate let-data="data">
			<a [attr.href]="data.link">{{data.name}} {{data.surname}}</a>
		</ng-template>
		<ng-template #filterableHeaderTemplate let-data="data">
			<i><a [attr.href]="data.link">{{data.name}}</a></i>
		</ng-template>
		<cds-table
			[isSortable]="isSortable"
			[isSelectable]="isSelectable"
			[model]="model"
			(rowClick)="onRowClick($event)"
			(sort)="customSort($event)">
			<ng-content />
		</cds-table>
		<cds-pagination [model]="model" (selectPage)="selectPage($event)"></cds-pagination>
	`,
	standalone: true,
	imports: [Table, Pagination]
})
export class PaginationTableStory implements OnInit {
	@Input() model = new TableModel();

	@Input() isSortable = true;

	@Input() isSelectable = true;

	@Input() get totalDataLength() {
		return this.model.totalDataLength;
	}
	set totalDataLength(value) {
		this.model.totalDataLength = value;
	}

	@ViewChild("filterableHeaderTemplate")
	protected filterableHeaderTemplate: TemplateRef<any>;
	@ViewChild("paginationTableItemTemplate")
	protected paginationTableItemTemplate: TemplateRef<any>;

	ngOnInit() {
		this.model.data = [[]];
		this.model.header = [
			new TableHeaderItem({ data: "Very long title indeed" }),
			new TableHeaderItem({
				data: "Very long title indeed"
			})
		];

		this.model.pageLength = 10;
		this.model.totalDataLength = 105;
		this.selectPage(1);
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

	getPage(page: number) {
		const line = line => [`Item ${line}:1!`, { name: "Item", surname: `${line}:2` }];

		const fullPage = [];

		for (let i = (page - 1) * this.model.pageLength; i < page * this.model.pageLength && i < this.model.totalDataLength; i++) {
			fullPage.push(line(i + 1));
		}

		return new Promise(resolve => {
			setTimeout(() => resolve(fullPage), 150);
		});
	}

	selectPage(page) {
		this.getPage(page).then((data: Array<Array<any>>) => {
			// set the data and update page
			this.model.data = this.prepareData(data);
			this.model.currentPage = page;
		});
	}

	onRowClick(index: number) {
		// eslint-disable-next-line no-console
		console.log("Row item selected:", index);
	}

	protected prepareData(data: Array<Array<any>>) {
		// create new data from the service data
		let newData = [];
		data.forEach(dataRow => {
			let row = [];
			dataRow.forEach(dataElement => {
				row.push(new TableItem({
					data: dataElement,
					template: typeof dataElement === "string" ? undefined : this.paginationTableItemTemplate
					// your template can handle all the data types so you don't have to conditionally set it
					// you can also set different templates for different columns based on index
				}));
			});
			newData.push(row);
		});
		return newData;
	}
}
