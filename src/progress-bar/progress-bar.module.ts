/**
 * Copyright IBM Corp. 2024
 *
 * ProgressBarModule
 *
 * Drop-in replacement for the old carbon-components-angular ProgressBarModule.
 * Registers the <cds-progress-bar> web component and exports the thin
 * Angular directive that maps the old @Input API onto it.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import CDSProgressBar from "@carbon/web-components/es/components/progress-bar/progress-bar.js";

import { CdsProgressBarDirective } from "./progress-bar.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-progress-bar", CDSProgressBar);

@NgModule({
	imports: [
		CommonModule,
		CdsProgressBarDirective
	],
	exports: [
		CdsProgressBarDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProgressBarModule { }
