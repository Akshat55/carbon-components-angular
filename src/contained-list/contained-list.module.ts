/**
 * Copyright IBM Corp. 2024
 *
 * ContainedListModule
 *
 * Drop-in replacement for the old carbon-components-angular ContainedListModule.
 * Registers the contained-list web components and exports the thin Angular
 * directives that map the old @Input API onto them.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import CDSContainedList from "@carbon/web-components/es/components/contained-list/contained-list.js";
import CDSContainedListItem from "@carbon/web-components/es/components/contained-list/contained-list-item.js";

import { CdsContainedListDirective, CdsContainedListItemDirective } from "./contained-list.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-contained-list", CDSContainedList);
safeDefine("cds-contained-list-item", CDSContainedListItem);

@NgModule({
	imports: [
		CommonModule,
		CdsContainedListDirective,
		CdsContainedListItemDirective
	],
	exports: [
		CdsContainedListDirective,
		CdsContainedListItemDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContainedListModule { }
