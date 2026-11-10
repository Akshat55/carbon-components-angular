/**
 * Copyright IBM Corp. 2024
 *
 * MenuButtonModule
 *
 * Drop-in replacement for the old carbon-components-angular MenuButtonModule.
 * Registers the menu-button web components and exports the thin Angular
 * directive that maps the old @Input API onto them.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import CDSMenuButton from "@carbon/web-components/es/components/menu-button/menu-button.js";
import CDSMenu from "@carbon/web-components/es/components/menu/menu.js";
import CDSMenuItem from "@carbon/web-components/es/components/menu/menu-item.js";

import { CdsMenuButtonDirective } from "./menu-button.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-menu-button", CDSMenuButton);
safeDefine("cds-menu", CDSMenu);
safeDefine("cds-menu-item", CDSMenuItem);

@NgModule({
	imports: [
		CommonModule,
		CdsMenuButtonDirective
	],
	exports: [
		CdsMenuButtonDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MenuButtonModule { }
