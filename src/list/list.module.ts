import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ListItemDirective } from "./list-item.directive";
import { List } from "./list.directive";
import { CdsUnorderedList, CdsOrderedList, CdsListItem } from "./list.component";

@NgModule({
	exports: [
		ListItemDirective,
		List,
		CdsUnorderedList,
		CdsOrderedList,
		CdsListItem
	],
	imports: [
		CommonModule,
		ListItemDirective,
		List,
		CdsUnorderedList,
		CdsOrderedList,
		CdsListItem
	]
})
export class ListModule {}
