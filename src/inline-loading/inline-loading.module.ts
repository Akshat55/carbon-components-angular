/**
 * Copyright IBM Corp. 2024
 *
 * InlineLoadingModule
 *
 * Drop-in replacement for the old carbon-components-angular InlineLoadingModule.
 * Registers the <cds-inline-loading> web component and exports the thin
 * Angular directive that maps the old @Input/@Output API onto it.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import CDSInlineLoading from "@carbon/web-components/es/components/inline-loading/inline-loading.js";

import { CdsInlineLoadingDirective } from "./inline-loading.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-inline-loading", CDSInlineLoading);

@NgModule({
	imports: [
		CommonModule,
		CdsInlineLoadingDirective
	],
	exports: [
		CdsInlineLoadingDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InlineLoadingModule { }
