// modules
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

// imports
import { Number, NumberSkeleton } from "./number.component";
import { I18nModule } from "carbon-components-angular/i18n";
import { IconDirective } from "carbon-components-angular/icon";

@NgModule({
	exports: [
		Number,
		NumberSkeleton
	],
	imports: [
		FormsModule,
		CommonModule,
		I18nModule,
		IconDirective,
		Number,
		NumberSkeleton
	]
})
export class NumberModule {}
