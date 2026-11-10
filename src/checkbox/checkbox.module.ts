/**
 * Copyright IBM Corp. 2024
 *
 * CheckboxModule
 *
 * Drop-in replacement for the old carbon-components-angular CheckboxModule.
 * Registers the checkbox web components and exports the thin Angular
 * directives that map the old @Input/@Output API onto them.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import CDSCheckbox from "@carbon/web-components/es/components/checkbox/checkbox.js";
import CDSCheckboxGroup from "@carbon/web-components/es/components/checkbox/checkbox-group.js";
import CDSCheckboxSkeleton from "@carbon/web-components/es/components/checkbox/checkbox-skeleton.js";

import { CdsCheckboxDirective } from "./checkbox.directive";
import { CdsCheckboxGroupDirective } from "./checkbox-group.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-checkbox", CDSCheckbox);
safeDefine("cds-checkbox-group", CDSCheckboxGroup);
safeDefine("cds-checkbox-skeleton", CDSCheckboxSkeleton);

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		CdsCheckboxDirective,
		CdsCheckboxGroupDirective
	],
	exports: [
		CdsCheckboxDirective,
		CdsCheckboxGroupDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CheckboxModule { }
