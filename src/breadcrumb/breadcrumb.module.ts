/**
 * Copyright IBM Corp. 2024
 *
 * BreadcrumbModule
 *
 * Drop-in replacement for the old carbon-components-angular BreadcrumbModule.
 * Registers the breadcrumb web components and exports the thin Angular
 * directives that map the old @Input API onto them.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import CDSBreadcrumb from "@carbon/web-components/es/components/breadcrumb/breadcrumb.js";
import CDSBreadcrumbItem from "@carbon/web-components/es/components/breadcrumb/breadcrumb-item.js";
import CDSBreadcrumbLink from "@carbon/web-components/es/components/breadcrumb/breadcrumb-link.js";
import CDSBreadcrumbSkeleton from "@carbon/web-components/es/components/breadcrumb/breadcrumb-skeleton.js";

import { CdsBreadcrumbDirective } from "./breadcrumb.directive";
import { CdsBreadcrumbItemDirective } from "./breadcrumb-item.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-breadcrumb", CDSBreadcrumb);
safeDefine("cds-breadcrumb-item", CDSBreadcrumbItem);
safeDefine("cds-breadcrumb-link", CDSBreadcrumbLink);
safeDefine("cds-breadcrumb-skeleton", CDSBreadcrumbSkeleton);

@NgModule({
	imports: [
		CommonModule,
		CdsBreadcrumbDirective,
		CdsBreadcrumbItemDirective
	],
	exports: [
		CdsBreadcrumbDirective,
		CdsBreadcrumbItemDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BreadcrumbModule { }
