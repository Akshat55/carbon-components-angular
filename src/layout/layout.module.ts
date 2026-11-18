import { NgModule } from "@angular/core";
import { CdsStack } from "./stack.component";

@NgModule({
	exports: [CdsStack],
	imports: [CdsStack]
})
export class LayoutModule {}
