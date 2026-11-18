import { NgModule } from "@angular/core";
import { CdsLayer } from "./layer.component";

@NgModule({
	exports: [CdsLayer],
	imports: [CdsLayer]
})
export class LayerModule {}
