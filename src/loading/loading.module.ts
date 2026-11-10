/**
 * Copyright IBM Corp. 2024
 *
 * LoadingModule
 *
 * Drop-in replacement for the old carbon-components-angular LoadingModule.
 * Registers the <cds-loading> web component and exports the thin Angular
 * directive that maps the old @Input API onto web component attributes.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import CDSLoading from "@carbon/web-components/es/components/loading/loading.js";

import { CdsLoadingDirective } from "./loading.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-loading", CDSLoading);

@NgModule({
	imports: [
		CommonModule,
		CdsLoadingDirective
	],
	exports: [
		CdsLoadingDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoadingModule { }
