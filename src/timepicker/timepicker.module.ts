/**
 * Copyright IBM Corp. 2024
 *
 * TimePickerModule
 *
 * Drop-in replacement for the old carbon-components-angular TimePickerModule.
 * Registers the time-picker web components and exports the thin Angular
 * directive that maps the old @Input/@Output API onto them.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import CDSTimePicker from "@carbon/web-components/es/components/time-picker/time-picker.js";
import CDSTimePickerSelect from "@carbon/web-components/es/components/time-picker/time-picker-select.js";

import { CdsTimePickerDirective } from "./timepicker.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-time-picker", CDSTimePicker);
safeDefine("cds-time-picker-select", CDSTimePickerSelect);

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		CdsTimePickerDirective
	],
	exports: [
		CdsTimePickerDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimePickerModule { }
