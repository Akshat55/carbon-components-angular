/**
 * Copyright IBM Corp. 2024
 *
 * DialogModule
 *
 * The old dialog-service infrastructure (DialogService, Dialog,
 * DialogDirective) has been removed — the web components manage their own
 * floating panes. This module now registers the overflow-menu web components
 * and exports the thin directives that preserve the old overflow-menu API.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import CDSOverflowMenu from "@carbon/web-components/es/components/overflow-menu/overflow-menu.js";
import CDSOverflowMenuBody from "@carbon/web-components/es/components/overflow-menu/overflow-menu-body.js";
import CDSOverflowMenuItem from "@carbon/web-components/es/components/overflow-menu/overflow-menu-item.js";

import { CdsOverflowMenuDirective, CdsOverflowMenuItemDirective } from "./overflow-menu.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-overflow-menu", CDSOverflowMenu);
safeDefine("cds-overflow-menu-body", CDSOverflowMenuBody);
safeDefine("cds-overflow-menu-item", CDSOverflowMenuItem);

@NgModule({
	imports: [
		CommonModule,
		CdsOverflowMenuDirective,
		CdsOverflowMenuItemDirective
	],
	exports: [
		CdsOverflowMenuDirective,
		CdsOverflowMenuItemDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DialogModule { }
