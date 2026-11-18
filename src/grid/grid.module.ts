import { NgModule } from "@angular/core";
import { CdsGrid, CdsColumn } from "./grid.component";

@NgModule({
	exports: [CdsGrid, CdsColumn],
	imports: [CdsGrid, CdsColumn]
})
export class GridModule {}
