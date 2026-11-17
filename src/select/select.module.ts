// modules
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

// imports
import { Select } from "./select.component";
import { Option } from "./option.directive";
import { OptGroup } from "./optgroup.directive";
import { IconDirective } from "carbon-components-angular/icon";
import { SelectItem, SelectItemGroup, SelectSkeleton } from "./select-item.component";

@NgModule({
	exports: [
		Select,
		Option,
		OptGroup,
		SelectItem,
		SelectItemGroup,
		SelectSkeleton
	],
	imports: [
		CommonModule,
		FormsModule,
		IconDirective,
		Select,
		Option,
		OptGroup,
		SelectItem,
		SelectItemGroup,
		SelectSkeleton
	]
})
export class SelectModule {}
