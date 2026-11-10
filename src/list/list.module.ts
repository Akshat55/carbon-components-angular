/**
 * Copyright IBM Corp. 2024
 *
 * ListModule
 *
 * Drop-in replacement for the old carbon-components-angular ListModule.
 * Registers the list web components and exports the thin Angular directives.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import CDSOrderedList from "@carbon/web-components/es/components/list/ordered-list.js";
import CDSUnorderedList from "@carbon/web-components/es/components/list/unordered-list.js";
import CDSListItem from "@carbon/web-components/es/components/list/list-item.js";

import { CdsOrderedListDirective, CdsUnorderedListDirective } from "./list.directive";
import { CdsListItemDirective } from "./list-item.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-ordered-list", CDSOrderedList);
safeDefine("cds-unordered-list", CDSUnorderedList);
safeDefine("cds-list-item", CDSListItem);

@NgModule({
	imports: [
		CommonModule,
		CdsOrderedListDirective,
		CdsUnorderedListDirective,
		CdsListItemDirective
	],
	exports: [
		CdsOrderedListDirective,
		CdsUnorderedListDirective,
		CdsListItemDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListModule { }
