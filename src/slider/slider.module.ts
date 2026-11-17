import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Slider } from "./slider.component";
import { UtilsModule } from "carbon-components-angular/utils";
import { SliderSkeleton } from "./slider-skeleton.component";

@NgModule({
	exports: [Slider, SliderSkeleton],
	imports: [
		CommonModule,
		UtilsModule,
		Slider,
		SliderSkeleton
	]
})
export class SliderModule {}
