/**
 * Copyright IBM Corp. 2024
 *
 * ToggleModule
 *
 * Drop-in replacement for the old carbon-components-angular ToggleModule.
 * Registers the <cds-toggle> web component and exports the thin Angular
 * directive that maps the old @Input/@Output API onto it.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import CDSToggle from "@carbon/web-components/es/components/toggle/toggle.js";

import { CdsToggleDirective } from "./toggle.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-toggle", CDSToggle);

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		CdsToggleDirective
	],
	exports: [
		CdsToggleDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ToggleModule { }
