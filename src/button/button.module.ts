/**
 * Copyright IBM Corp. 2024
 *
 * ButtonModule
 *
 * Drop-in replacement for the old carbon-components-angular ButtonModule.
 * Registers the button web components and exports the thin Angular directives
 * that map the old @Input API onto them.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import CDSButton from "@carbon/web-components/es/components/button/button.js";
import CDSButtonSet from "@carbon/web-components/es/components/button/button-set.js";
import CDSButtonSkeleton from "@carbon/web-components/es/components/button/button-skeleton.js";
import CDSIconButton from "@carbon/web-components/es/components/icon-button/icon-button.js";

import { CdsButtonDirective } from "./button.directive";
import { CdsButtonSetDirective } from "./button-set.directive";
import { CdsIconButtonDirective } from "./icon-button.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-button", CDSButton);
safeDefine("cds-button-set", CDSButtonSet);
safeDefine("cds-button-skeleton", CDSButtonSkeleton);
safeDefine("cds-icon-button", CDSIconButton);

@NgModule({
	imports: [
		CommonModule,
		CdsButtonDirective,
		CdsButtonSetDirective,
		CdsIconButtonDirective
	],
	exports: [
		CdsButtonDirective,
		CdsButtonSetDirective,
		CdsIconButtonDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ButtonModule { }
