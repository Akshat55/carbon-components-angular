// modules
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

// imports
import { I18nModule } from "carbon-components-angular/i18n";
import { Search } from "./search.component";
import { IconDirective } from "carbon-components-angular/icon";
import { SearchSkeleton } from "./search-skeleton.component";

@NgModule({
	exports: [
		Search,
		SearchSkeleton
	],
	imports: [
		FormsModule,
		CommonModule,
		I18nModule,
		IconDirective,
		Search,
		SearchSkeleton
	]
})
export class SearchModule {}
