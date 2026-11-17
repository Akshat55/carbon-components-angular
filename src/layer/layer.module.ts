import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LayerDirective } from "./layer.directive";
import { CdsLayer } from "./layer.component";

@NgModule({
	exports: [LayerDirective, CdsLayer],
	imports: [
		CommonModule,
		LayerDirective,
		CdsLayer
	]
})
export class LayerModule {}
