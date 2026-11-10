import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { StructuredList } from "./structured-list.component";
import { ListBody, ListRow } from "./list-row.component";
import { ListHeader, ListHeaderRow } from "./list-header.component";
import { ListColumn, ListHeaderColumn, ListHeaderColumnSkeleton } from "./list-column.component";
import { IconDirective } from "carbon-components-angular/icon";

@NgModule({
	exports: [
		StructuredList,
		ListRow,
		ListBody,
		ListHeader,
		ListHeaderRow,
		ListColumn,
		ListHeaderColumn,
		ListHeaderColumnSkeleton
	],
	imports: [
		CommonModule,
		IconDirective,
		StructuredList,
		ListRow,
		ListBody,
		ListHeader,
		ListHeaderRow,
		ListColumn,
		ListHeaderColumn,
		ListHeaderColumnSkeleton
	]
})
export class StructuredListModule {}
