/**
 * Copyright IBM Corp. 2024
 *
 * ComboButtonModule
 *
 * Drop-in replacement for the old carbon-components-angular ComboButtonModule.
 * Registers the combo-button web components and exports the thin Angular
 * directive that maps the old @Input/@Output API onto them.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import CDSComboButton from "@carbon/web-components/es/components/combo-button/combo-button.js";
import CDSMenu from "@carbon/web-components/es/components/menu/menu.js";
import CDSMenuItem from "@carbon/web-components/es/components/menu/menu-item.js";

import { CdsComboButtonDirective } from "./combo-button.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-combo-button", CDSComboButton);
safeDefine("cds-menu", CDSMenu);
safeDefine("cds-menu-item", CDSMenuItem);

@NgModule({
	imports: [
		CommonModule,
		CdsComboButtonDirective
	],
	exports: [
		CdsComboButtonDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComboButtonModule { }
