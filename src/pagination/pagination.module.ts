/**
 * Copyright IBM Corp. 2024
 *
 * PaginationModule
 *
 * Drop-in replacement for the old carbon-components-angular PaginationModule.
 * Registers the pagination web components and exports the thin Angular
 * directive that maps the old @Input/@Output API onto them.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import CDSPagination from "@carbon/web-components/es/components/pagination/pagination.js";
import CDSSelectItem from "@carbon/web-components/es/components/select/select-item.js";

import { CdsPaginationDirective } from "./pagination.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-pagination", CDSPagination);
safeDefine("cds-select-item", CDSSelectItem);

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		CdsPaginationDirective
	],
	exports: [
		CdsPaginationDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PaginationModule { }
