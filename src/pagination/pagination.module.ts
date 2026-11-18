import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { Pagination } from "./pagination.component";
import { I18nModule } from "carbon-components-angular/i18n";
import { ExperimentalModule } from "carbon-components-angular/experimental";
import { PaginationNav } from "./pagination-nav/pagination-nav.component";
import { IconDirective } from "carbon-components-angular/icon";


@NgModule({
	exports: [
		Pagination,
		PaginationNav
	],
	imports: [
		CommonModule,
		FormsModule,
		I18nModule,
		ExperimentalModule,
		IconDirective,
		Pagination,
		PaginationNav
	]
})
export class PaginationModule {}
