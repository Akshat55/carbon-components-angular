/**
 * Copyright IBM Corp. 2024
 *
 * TagModule
 *
 * Drop-in replacement for the old carbon-components-angular TagModule.
 * Registers the tag web components and exports the thin Angular directives
 * that map the old @Input/@Output API onto them.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import CDSTag from "@carbon/web-components/es/components/tag/tag.js";
import CDSDismissibleTag from "@carbon/web-components/es/components/tag/dismissible-tag.js";
import CDSSelectableTag from "@carbon/web-components/es/components/tag/selectable-tag.js";
import CDSOperationalTag from "@carbon/web-components/es/components/tag/operational-tag.js";
import CDSTagSkeleton from "@carbon/web-components/es/components/tag/tag-skeleton.js";

import { CdsTagDirective } from "./tag.directive";
import { CdsDismissibleTagDirective } from "./tag-dismissible.directive";
import { CdsSelectableTagDirective } from "./tag-selectable.directive";
import { CdsOperationalTagDirective } from "./tag-operational.directive";
import { CdsTagIconDirective } from "./tag-icon.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-tag", CDSTag);
safeDefine("cds-dismissible-tag", CDSDismissibleTag);
safeDefine("cds-selectable-tag", CDSSelectableTag);
safeDefine("cds-operational-tag", CDSOperationalTag);
safeDefine("cds-tag-skeleton", CDSTagSkeleton);

@NgModule({
	imports: [
		CommonModule,
		CdsTagDirective,
		CdsDismissibleTagDirective,
		CdsSelectableTagDirective,
		CdsOperationalTagDirective,
		CdsTagIconDirective
	],
	exports: [
		CdsTagDirective,
		CdsDismissibleTagDirective,
		CdsSelectableTagDirective,
		CdsOperationalTagDirective,
		CdsTagIconDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TagModule { }
