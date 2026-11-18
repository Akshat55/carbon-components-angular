import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { Dropdown, MultiSelect } from "./dropdown.component";
import { DropdownItem, MultiSelectItem } from "./dropdown-item.component";
import { DropdownList } from "./list/dropdown-list.component";
import { AbstractDropdownView } from "./abstract-dropdown-view.class";

import { I18nModule } from "carbon-components-angular/i18n";
import { PlaceholderModule } from "carbon-components-angular/placeholder";
import { DropdownService } from "./dropdown.service";
import { UtilsModule } from "carbon-components-angular/utils";
import { IconModule } from "carbon-components-angular/icon";
import { DropdownSkeleton } from "./dropdown-skeleton.component";

@NgModule({
	exports: [
		Dropdown,
		MultiSelect,
		DropdownItem,
		MultiSelectItem,
		DropdownList,
		AbstractDropdownView,
		DropdownSkeleton
	],
	imports: [
		CommonModule,
		FormsModule,
		I18nModule,
		PlaceholderModule,
		UtilsModule,
		IconModule,
		Dropdown,
		MultiSelect,
		DropdownItem,
		MultiSelectItem,
		DropdownList,
		AbstractDropdownView,
		DropdownSkeleton
	],
	providers: [ DropdownService ]
})
export class DropdownModule {}
