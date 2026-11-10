/**
 * Copyright IBM Corp. 2024
 *
 * SliderModule
 *
 * Drop-in replacement for the old carbon-components-angular SliderModule.
 * Registers the slider web components and exports the thin Angular
 * directive that maps the old @Input/@Output API onto them.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import CDSSlider from "@carbon/web-components/es/components/slider/slider.js";
import CDSSliderInput from "@carbon/web-components/es/components/slider/slider-input.js";

import { CdsSliderDirective } from "./slider.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-slider", CDSSlider);
safeDefine("cds-slider-input", CDSSliderInput);

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		CdsSliderDirective
	],
	exports: [
		CdsSliderDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SliderModule { }
