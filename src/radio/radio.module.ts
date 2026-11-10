/**
 * Copyright IBM Corp. 2024
 *
 * RadioModule
 *
 * Drop-in replacement for the old carbon-components-angular RadioModule.
 * Registers the radio-button web components and exports the thin Angular
 * directives that map the old @Input/@Output API onto them.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import CDSRadioButton from "@carbon/web-components/es/components/radio-button/radio-button.js";
import CDSRadioButtonGroup from "@carbon/web-components/es/components/radio-button/radio-button-group.js";

import { CdsRadioDirective } from "./radio.directive";
import { CdsRadioGroupDirective } from "./radio-group.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-radio-button", CDSRadioButton);
safeDefine("cds-radio-button-group", CDSRadioButtonGroup);

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		CdsRadioDirective,
		CdsRadioGroupDirective
	],
	exports: [
		CdsRadioDirective,
		CdsRadioGroupDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RadioModule { }
