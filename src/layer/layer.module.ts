/**
 * Copyright IBM Corp. 2024
 *
 * LayerModule
 *
 * Drop-in replacement for the old carbon-components-angular LayerModule.
 * Registers the <cds-layer> web component and exports the thin Angular
 * directive that maps the old @Input API onto it.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import CDSLayer from "@carbon/web-components/es/components/layer/layer.js";

import { CdsLayerDirective } from "./layer.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-layer", CDSLayer);

@NgModule({
	imports: [
		CommonModule,
		CdsLayerDirective
	],
	exports: [
		CdsLayerDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LayerModule { }
