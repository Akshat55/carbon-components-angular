/**
 * Copyright IBM Corp. 2024
 *
 * SearchModule
 *
 * Drop-in replacement for the old carbon-components-angular SearchModule.
 * Registers the <cds-search> web component and exports the thin Angular
 * directive that maps the old @Input/@Output API onto it.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import CDSSearch from "@carbon/web-components/es/components/search/search.js";

import { CdsSearchDirective } from "./search.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-search", CDSSearch);

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		CdsSearchDirective
	],
	exports: [
		CdsSearchDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SearchModule { }
