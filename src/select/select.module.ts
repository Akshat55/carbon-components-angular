/**
 * Copyright IBM Corp. 2024
 *
 * SelectModule
 *
 * Drop-in replacement for the old carbon-components-angular SelectModule.
 * Registers the select web components and exports the thin Angular
 * directives that map the old @Input/@Output API onto them.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import CDSSelect from "@carbon/web-components/es/components/select/select.js";
import CDSSelectItem from "@carbon/web-components/es/components/select/select-item.js";
import CDSSelectItemGroup from "@carbon/web-components/es/components/select/select-item-group.js";

import { CdsSelectDirective } from "./select.directive";
import { CdsSelectItemDirective } from "./option.directive";
import { CdsSelectItemGroupDirective } from "./optgroup.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-select", CDSSelect);
safeDefine("cds-select-item", CDSSelectItem);
safeDefine("cds-select-item-group", CDSSelectItemGroup);

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		CdsSelectDirective,
		CdsSelectItemDirective,
		CdsSelectItemGroupDirective
	],
	exports: [
		CdsSelectDirective,
		CdsSelectItemDirective,
		CdsSelectItemGroupDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SelectModule { }
