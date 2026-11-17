import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ColumnDirective } from "./column.directive";
import { RowDirective } from "./row.directive";
import { GridDirective } from "./grid.directive";
import { GridService } from "./grid.service";
import { CdsGrid, CdsColumn } from "./grid.component";

@NgModule({
	exports: [
		ColumnDirective,
		GridDirective,
		RowDirective,
		CdsGrid,
		CdsColumn
	],
	providers: [GridService],
	imports: [
		CommonModule,
		ColumnDirective,
		GridDirective,
		RowDirective,
		CdsGrid,
		CdsColumn
	]
})
export class GridModule {}
