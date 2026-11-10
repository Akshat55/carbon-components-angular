import { NgModule } from "@angular/core";
import {
	TableV2,
	TableV2BatchActions,
	TableV2Body,
	TableV2Cell,
	TableV2ExpandedRow,
	TableV2Head,
	TableV2HeaderCell,
	TableV2HeaderDescription,
	TableV2HeaderRow,
	TableV2HeaderTitle,
	TableV2Row,
	TableV2Skeleton,
	TableV2Toolbar,
	TableV2ToolbarContent,
	TableV2ToolbarSearch
} from "./table-v2.component";

const COMPONENTS = [
	TableV2,
	TableV2BatchActions,
	TableV2Body,
	TableV2Cell,
	TableV2ExpandedRow,
	TableV2Head,
	TableV2HeaderCell,
	TableV2HeaderDescription,
	TableV2HeaderRow,
	TableV2HeaderTitle,
	TableV2Row,
	TableV2Skeleton,
	TableV2Toolbar,
	TableV2ToolbarContent,
	TableV2ToolbarSearch
];

/**
 * The web component data table. Importing it registers the `cds-table*` web components.
 */
@NgModule({
	imports: COMPONENTS,
	exports: COMPONENTS
})
export class TableV2Module {}
