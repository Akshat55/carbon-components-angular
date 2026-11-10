/**
 * Copyright IBM Corp. 2024
 *
 * StructuredListModule
 *
 * Drop-in replacement for the old carbon-components-angular StructuredListModule.
 * Registers the structured-list web components and exports the thin Angular
 * directives that map the old @Input/@Output API onto them.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import CDSStructuredList from "@carbon/web-components/es/components/structured-list/structured-list.js";
import CDSStructuredListHead from "@carbon/web-components/es/components/structured-list/structured-list-head.js";
import CDSStructuredListHeaderRow from "@carbon/web-components/es/components/structured-list/structured-list-header-row.js";
import CDSStructuredListHeaderCell from "@carbon/web-components/es/components/structured-list/structured-list-header-cell.js";
import CDSStructuredListBody from "@carbon/web-components/es/components/structured-list/structured-list-body.js";
import CDSStructuredListRow from "@carbon/web-components/es/components/structured-list/structured-list-row.js";
import CDSStructuredListCell from "@carbon/web-components/es/components/structured-list/structured-list-cell.js";

import { CdsStructuredListDirective, CdsStructuredListRowDirective } from "./structured-list.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-structured-list", CDSStructuredList);
safeDefine("cds-structured-list-head", CDSStructuredListHead);
safeDefine("cds-structured-list-header-row", CDSStructuredListHeaderRow);
safeDefine("cds-structured-list-header-cell", CDSStructuredListHeaderCell);
safeDefine("cds-structured-list-body", CDSStructuredListBody);
safeDefine("cds-structured-list-row", CDSStructuredListRow);
safeDefine("cds-structured-list-cell", CDSStructuredListCell);

@NgModule({
	imports: [
		CommonModule,
		CdsStructuredListDirective,
		CdsStructuredListRowDirective
	],
	exports: [
		CdsStructuredListDirective,
		CdsStructuredListRowDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StructuredListModule { }
