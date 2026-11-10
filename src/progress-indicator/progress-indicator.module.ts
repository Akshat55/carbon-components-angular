/**
 * Copyright IBM Corp. 2024
 *
 * ProgressIndicatorModule
 *
 * Drop-in replacement for the old carbon-components-angular
 * ProgressIndicatorModule. Registers the progress-indicator web components
 * and exports the thin Angular directive that maps the old @Input/@Output
 * API onto them.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import CDSProgressIndicator from "@carbon/web-components/es/components/progress-indicator/progress-indicator.js";
import CDSProgressStep from "@carbon/web-components/es/components/progress-indicator/progress-step.js";

import { CdsProgressIndicatorDirective } from "./progress-indicator.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-progress-indicator", CDSProgressIndicator);
safeDefine("cds-progress-step", CDSProgressStep);

@NgModule({
	imports: [
		CommonModule,
		CdsProgressIndicatorDirective
	],
	exports: [
		CdsProgressIndicatorDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProgressIndicatorModule { }
