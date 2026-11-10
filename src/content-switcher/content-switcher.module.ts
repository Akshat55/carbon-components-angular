/**
 * Copyright IBM Corp. 2024
 *
 * ContentSwitcherModule
 *
 * Drop-in replacement for the old carbon-components-angular ContentSwitcherModule.
 * Registers the content-switcher web components and exports the thin Angular
 * directives that map the old @Input/@Output API onto them.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import CDSContentSwitcher from "@carbon/web-components/es/components/content-switcher/content-switcher.js";
import CDSContentSwitcherItem from "@carbon/web-components/es/components/content-switcher/content-switcher-item.js";

import { CdsContentSwitcherDirective, CdsContentSwitcherItemDirective } from "./content-switcher.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-content-switcher", CDSContentSwitcher);
safeDefine("cds-content-switcher-item", CDSContentSwitcherItem);

@NgModule({
	imports: [
		CommonModule,
		CdsContentSwitcherDirective,
		CdsContentSwitcherItemDirective
	],
	exports: [
		CdsContentSwitcherDirective,
		CdsContentSwitcherItemDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContentSwitcherModule { }
