import { OnInit } from "@angular/core";
import { Component, Inject, ViewChild, TemplateRef } from "@angular/core";

import { SampleComponent } from "./sample.component";

import { ModalService } from "../../modal";
import {
	TableHeaderItem,
	TableItem,
	TableModel
} from "../../table";

@Component({
	selector: "app-root",
	template: `
		<ibm-table
			class="table-content-div"
			[model]="tableDataModel"
			[size]="'md'"
			[showSelectionColumn]="false"
			[enableSingleSelect]="false"
			[striped]="false"
			[stickyHeader]="false"
			[isDataGrid]="false">
		</ibm-table>

		<!-- Changing the selected functions to openModal
		since others don't exist & angular throws an error -->
		<ng-template #actionsTemplate let-data="data">
		<ibm-overflow-menu [flip]="true" [offset]="{ x: 0, y: 0 }">
			<ibm-overflow-menu-option (selected)="openModal(data)">
			Overflow 1
			</ibm-overflow-menu-option>
			<ibm-overflow-menu-option (selected)="openModal(data)">
			Overflow 2
			</ibm-overflow-menu-option>
			<ibm-overflow-menu-option (selected)="openModal(data)">
			Overflow 3
			</ibm-overflow-menu-option>
		</ibm-overflow-menu>
		</ng-template>

		<ibm-placeholder></ibm-placeholder>
	`
})
export class AppComponent implements OnInit {
	// Not initialized, so adding !
	@ViewChild("actionsTemplate", { static: true }) actionsTemplate: TemplateRef<
		any
	>;

	tableDataModel = new TableModel();

	constructor(@Inject(ModalService) public modalService: ModalService) { }

	ngOnInit(): void {
		this.populateData();
		console.log("21211");
	}

	populateData() {
		// this.populateTableHeader();
		this.populateTableData();
	}

	populateTableHeader() {
		this.tableDataModel.header = [
			new TableHeaderItem({ data: "Column 1" }),
			new TableHeaderItem({ data: "Column 2" }),
			new TableHeaderItem({ data: "Column 3" }),
			new TableHeaderItem({ data: "Column 4" }),
			new TableHeaderItem({ data: "Column 5" }),
			new TableHeaderItem({ data: "Column 6" }),
			new TableHeaderItem({ data: "Column 7" }),
			new TableHeaderItem({ data: "" })
		];
	}

	populateTableData() {
		// this.tableDataModel.data = [];
		// this.tableDataModel.data.pop();
		let tableDataList: any = [];

		for (let i = 0; i < 250; i++) {
			let tableDataRow: any = [
				new TableItem({ data: "1" }),
				new TableItem({ data: "2" }),
				new TableItem({ data: "3" }),
				new TableItem({ data: "4" }),
				new TableItem({ data: "5" }),
				new TableItem({ data: "6" }),
				new TableItem({ data: "7" }),
				new TableItem({ data: "", template: this.actionsTemplate })
			];
			tableDataList.push(tableDataRow);
		}

		this.tableDataModel.data = tableDataList;
	}

	openModal(data: any) {
		console.log(data);
		console.log("reached");

		this.modalService.create({
			component: SampleComponent
		});
	}
}
