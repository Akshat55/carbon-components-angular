/**
 * Copyright IBM Corp. 2024
 *
 * ToggletipModule
 *
 * Drop-in replacement for the old carbon-components-angular ToggletipModule.
 * Registers the <cds-toggletip> web component and exports the thin Angular
 * directives that map the old API onto it.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import CDSToggletip from "@carbon/web-components/es/components/toggle-tip/toggletip.js";

import {
	CdsToggletipDirective,
	CdsToggletipButtonDirective,
	CdsToggletipContentDirective,
	CdsToggletipActionDirective
} from "./toggletip.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-toggletip", CDSToggletip);

@NgModule({
	imports: [
		CommonModule,
		CdsToggletipDirective,
		CdsToggletipButtonDirective,
		CdsToggletipContentDirective,
		CdsToggletipActionDirective
	],
	exports: [
		CdsToggletipDirective,
		CdsToggletipButtonDirective,
		CdsToggletipContentDirective,
		CdsToggletipActionDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ToggletipModule { }
