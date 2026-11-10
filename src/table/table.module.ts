/**
 * Copyright IBM Corp. 2024
 *
 * TableModule
 *
 * Drop-in replacement for the old carbon-components-angular TableModule.
 * Registers the data-table web components and exports the thin Angular
 * directive that maps the old TableModel-driven API onto them.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import CDSTable from "@carbon/web-components/es/components/data-table/table.js";
import CDSTableHead from "@carbon/web-components/es/components/data-table/table-head.js";
import CDSTableHeaderRow from "@carbon/web-components/es/components/data-table/table-header-row.js";
import CDSTableHeaderCell from "@carbon/web-components/es/components/data-table/table-header-cell.js";
import CDSTableBody from "@carbon/web-components/es/components/data-table/table-body.js";
import CDSTableRow from "@carbon/web-components/es/components/data-table/table-row.js";
import CDSTableCell from "@carbon/web-components/es/components/data-table/table-cell.js";
import CDSTableToolbar from "@carbon/web-components/es/components/data-table/table-toolbar.js";
import CDSTableToolbarContent from "@carbon/web-components/es/components/data-table/table-toolbar-content.js";
import CDSTableToolbarSearch from "@carbon/web-components/es/components/data-table/table-toolbar-search.js";

import { CdsTableDirective } from "./table.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-table", CDSTable);
safeDefine("cds-table-head", CDSTableHead);
safeDefine("cds-table-header-row", CDSTableHeaderRow);
safeDefine("cds-table-header-cell", CDSTableHeaderCell);
safeDefine("cds-table-body", CDSTableBody);
safeDefine("cds-table-row", CDSTableRow);
safeDefine("cds-table-cell", CDSTableCell);
safeDefine("cds-table-toolbar", CDSTableToolbar);
safeDefine("cds-table-toolbar-content", CDSTableToolbarContent);
safeDefine("cds-table-toolbar-search", CDSTableToolbarSearch);

@NgModule({
	imports: [
		CommonModule,
		CdsTableDirective
	],
	exports: [
		CdsTableDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableModule { }
