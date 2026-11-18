import { NgModule } from "@angular/core";
import { CdsUnorderedList, CdsOrderedList, CdsListItem } from "./list.component";

@NgModule({
	exports: [CdsUnorderedList, CdsOrderedList, CdsListItem],
	imports: [CdsUnorderedList, CdsOrderedList, CdsListItem]
})
export class ListModule {}
