/**
 * Copyright IBM Corp. 2024
 *
 * DropdownModule
 *
 * Drop-in replacement for the old carbon-components-angular DropdownModule.
 * Registers the dropdown web components and exports the thin Angular
 * directive that maps the old @Input/@Output API onto them.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import CDSDropdown from "@carbon/web-components/es/components/dropdown/dropdown.js";
import CDSDropdownItem from "@carbon/web-components/es/components/dropdown/dropdown-item.js";
import CDSDropdownSkeleton from "@carbon/web-components/es/components/dropdown/dropdown-skeleton.js";

import { CdsDropdownDirective } from "./dropdown.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-dropdown", CDSDropdown);
safeDefine("cds-dropdown-item", CDSDropdownItem);
safeDefine("cds-dropdown-skeleton", CDSDropdownSkeleton);

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		CdsDropdownDirective
	],
	exports: [
		CdsDropdownDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DropdownModule { }
