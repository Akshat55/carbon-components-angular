/**
 * Copyright IBM Corp. 2024
 *
 * ComboBoxModule
 *
 * Drop-in replacement for the old carbon-components-angular ComboBoxModule.
 * Registers the combo-box web components and exports the thin Angular
 * directive that maps the old @Input/@Output API onto them.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import CDSComboBox from "@carbon/web-components/es/components/combo-box/combo-box.js";
import CDSComboBoxItem from "@carbon/web-components/es/components/combo-box/combo-box-item.js";

import { CdsComboBoxDirective } from "./combobox.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-combo-box", CDSComboBox);
safeDefine("cds-combo-box-item", CDSComboBoxItem);

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		CdsComboBoxDirective
	],
	exports: [
		CdsComboBoxDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComboBoxModule { }
