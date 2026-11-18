// modules
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

// imports
import { Select } from "./select.component";
import { IconDirective } from "carbon-components-angular/icon";
import { SelectItem, SelectItemGroup, SelectSkeleton } from "./select-item.component";

@NgModule({
	exports: [
		Select,
		SelectItem,
		SelectItemGroup,
		SelectSkeleton
	],
	imports: [
		CommonModule,
		FormsModule,
		IconDirective,
		Select,
		SelectItem,
		SelectItemGroup,
		SelectSkeleton
	]
})
export class SelectModule {}
