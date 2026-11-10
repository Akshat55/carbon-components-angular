/**
 * Copyright IBM Corp. 2024
 *
 * TabsModule
 *
 * Drop-in replacement for the old carbon-components-angular TabsModule.
 * Registers the tabs web components and exports the thin Angular directives
 * that map the old @Input/@Output API onto them.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import CDSTabs from "@carbon/web-components/es/components/tabs/tabs.js";
import CDSTab from "@carbon/web-components/es/components/tabs/tab.js";
import CDSTabsSkeleton from "@carbon/web-components/es/components/tabs/tabs-skeleton.js";

import { CdsTabsDirective, CdsTabDirective } from "./tabs.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-tabs", CDSTabs);
safeDefine("cds-tab", CDSTab);
safeDefine("cds-tabs-skeleton", CDSTabsSkeleton);

@NgModule({
	imports: [
		CommonModule,
		CdsTabsDirective,
		CdsTabDirective
	],
	exports: [
		CdsTabsDirective,
		CdsTabDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TabsModule { }
