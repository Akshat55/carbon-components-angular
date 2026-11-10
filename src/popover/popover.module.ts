/**
 * Copyright IBM Corp. 2024
 *
 * PopoverModule
 *
 * Drop-in replacement for the old carbon-components-angular PopoverModule.
 * Registers the popover web components and exports the thin Angular
 * directive that maps the old @Input/@Output API onto them.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import CDSPopover from "@carbon/web-components/es/components/popover/popover.js";
import CDSPopoverContent from "@carbon/web-components/es/components/popover/popover-content.js";

import { CdsPopoverDirective } from "./popover.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-popover", CDSPopover);
safeDefine("cds-popover-content", CDSPopoverContent);

@NgModule({
	imports: [
		CommonModule,
		CdsPopoverDirective
	],
	exports: [
		CdsPopoverDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PopoverModule { }
