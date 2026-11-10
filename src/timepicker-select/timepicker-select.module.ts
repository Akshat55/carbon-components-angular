/**
 * Copyright IBM Corp. 2024
 *
 * TimePickerSelectModule
 *
 * Drop-in replacement for the old carbon-components-angular
 * TimePickerSelectModule. Registers the time-picker-select web components
 * and exports the thin Angular directive that maps the old API onto them.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import CDSTimePickerSelect from "@carbon/web-components/es/components/time-picker/time-picker-select.js";
import CDSSelectItem from "@carbon/web-components/es/components/select/select-item.js";

import { CdsTimePickerSelectDirective } from "./timepicker-select.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-time-picker-select", CDSTimePickerSelect);
safeDefine("cds-select-item", CDSSelectItem);

@NgModule({
	imports: [
		CommonModule,
		CdsTimePickerSelectDirective
	],
	exports: [
		CdsTimePickerSelectDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimePickerSelectModule { }
