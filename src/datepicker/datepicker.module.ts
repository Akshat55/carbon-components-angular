/**
 * Copyright IBM Corp. 2024
 *
 * DatePickerModule
 *
 * Drop-in replacement for the old carbon-components-angular DatePickerModule.
 * Registers the date-picker web components and exports the thin Angular
 * directive that maps the old @Input/@Output API onto them.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import CDSDatePicker from "@carbon/web-components/es/components/date-picker/date-picker.js";
import CDSDatePickerInput from "@carbon/web-components/es/components/date-picker/date-picker-input.js";

import { CdsDatePickerDirective } from "./datepicker.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-date-picker", CDSDatePicker);
safeDefine("cds-date-picker-input", CDSDatePickerInput);

@NgModule({
	imports: [
		CommonModule,
		CdsDatePickerDirective
	],
	exports: [
		CdsDatePickerDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DatePickerModule { }
