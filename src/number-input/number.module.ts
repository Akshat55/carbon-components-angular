/**
 * Copyright IBM Corp. 2024
 *
 * NumberModule
 *
 * Drop-in replacement for the old carbon-components-angular NumberModule.
 * Registers the <cds-number-input> web component and exports the thin
 * Angular directive that maps the old @Input/@Output API onto it.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import CDSNumberInput from "@carbon/web-components/es/components/number-input/number-input.js";

import { CdsNumberInputDirective } from "./number.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-number-input", CDSNumberInput);

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		CdsNumberInputDirective
	],
	exports: [
		CdsNumberInputDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NumberModule { }
