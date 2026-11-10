/**
 * Copyright IBM Corp. 2024
 *
 * SkeletonModule
 *
 * Drop-in replacement for the old carbon-components-angular SkeletonModule.
 * Registers the skeleton web components and exports the thin Angular
 * directives.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import CDSSkeletonText from "@carbon/web-components/es/components/skeleton-text/skeleton-text.js";
import CDSSkeletonPlaceholder from "@carbon/web-components/es/components/skeleton-placeholder/skeleton-placeholder.js";
import CDSSkeletonIcon from "@carbon/web-components/es/components/skeleton-icon/skeleton-icon.js";

import {
	CdsSkeletonTextDirective,
	CdsSkeletonPlaceholderDirective,
	CdsSkeletonIconDirective
} from "./skeleton.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-skeleton-text", CDSSkeletonText);
safeDefine("cds-skeleton-placeholder", CDSSkeletonPlaceholder);
safeDefine("cds-skeleton-icon", CDSSkeletonIcon);

@NgModule({
	imports: [
		CommonModule,
		CdsSkeletonTextDirective,
		CdsSkeletonPlaceholderDirective,
		CdsSkeletonIconDirective
	],
	exports: [
		CdsSkeletonTextDirective,
		CdsSkeletonPlaceholderDirective,
		CdsSkeletonIconDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SkeletonModule { }
