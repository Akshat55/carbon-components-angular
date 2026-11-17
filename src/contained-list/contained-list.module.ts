import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContainedList } from "./contained-list.component";
import { ContainedListItem } from "./contained-list-item.component";
import { IconModule } from "carbon-components-angular/icon";
import { ContainedListDescription } from "./contained-list-description.component";

@NgModule({
	exports: [ContainedList, ContainedListItem, ContainedListDescription],
	imports: [
		CommonModule,
		IconModule,
		ContainedList,
		ContainedListItem,
		ContainedListDescription
	]
})
export class ContainedListModule {}
