import { NgModule } from "@angular/core";
import { ThemeDirective } from "./theme.directive";

@NgModule({
	exports: [ThemeDirective],
	imports: [ThemeDirective]
})
export class ThemeModule {}
