/**
 * Copyright IBM Corp. 2024
 *
 * LinkModule
 *
 * Drop-in replacement for the old carbon-components-angular LinkModule.
 * Registers the <cds-link> web component and exports the thin Angular
 * directives that map the old @Input API onto web component attributes.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

// Web component class — tree-shakeable, no side-effect auto-registration.
import CDSLink from "@carbon/web-components/es/components/link/link.js";

import { CdsLinkDirective } from "./link.directive";
import { CdsLinkIconDirective } from "./link-icon.directive";

// Register web components once when the module is first loaded.
function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-link", CDSLink);

@NgModule({
	imports: [
		CommonModule,
		CdsLinkDirective,
		CdsLinkIconDirective
	],
	exports: [
		CdsLinkDirective,
		CdsLinkIconDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LinkModule { }
