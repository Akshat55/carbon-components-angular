// modules
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

// imports
import { I18nModule } from "carbon-components-angular/i18n";
import { Toggle } from "./toggle.component";
import { ToggleSkeleton } from "./toggle-skeleton.component";

@NgModule({
	exports: [
		Toggle,
		ToggleSkeleton
	],
	imports: [
		CommonModule,
		FormsModule,
		I18nModule,
		Toggle,
		ToggleSkeleton
	]
})
export class ToggleModule {}
