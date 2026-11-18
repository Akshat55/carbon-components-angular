import { NgModule } from "@angular/core";
import { Table } from "./table.component";
import {
	TableBatchActions,
	TableBody,
	TableCell,
	TableExpandedRow,
	TableHead,
	TableHeaderCell,
	TableHeaderDescription,
	TableHeaderRow,
	TableHeaderTitle,
	TableRowComponent,
	TableSkeleton,
	TableToolbar,
	TableToolbarContent,
	TableToolbarSearch
} from "./table-parts.component";

const COMPONENTS = [
	Table,
	TableBatchActions,
	TableBody,
	TableCell,
	TableExpandedRow,
	TableHead,
	TableHeaderCell,
	TableHeaderDescription,
	TableHeaderRow,
	TableHeaderTitle,
	TableRowComponent,
	TableSkeleton,
	TableToolbar,
	TableToolbarContent,
	TableToolbarSearch
];

/**
 * The data table. Importing it registers the `cds-table*` web components.
 */
@NgModule({
	imports: COMPONENTS,
	exports: COMPONENTS
})
export class TableModule {}
