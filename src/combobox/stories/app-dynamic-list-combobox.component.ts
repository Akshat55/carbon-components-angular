import { Component, AfterViewInit } from "@angular/core";
import { ComboBox } from "../combobox.component";
import { DropdownList, MultiSelect } from "carbon-components-angular/dropdown";

@Component({
	selector: "app-dynamic-list-combobox",
	template: `
		<cds-multi-select filterable
			[(items)]="items"
			itemValueKey="content"
			(selected)="updateSelected($event)">
			<cds-dropdown-list></cds-dropdown-list>
		</cds-multi-select>
	`,
	imports: [ComboBox, MultiSelect, DropdownList]
})
export class DynamicListComboBox implements AfterViewInit {
	items = [
		{
			content: "one"
		},
		{
			content: "two"
		},
		{
			content: "three"
		},
		{
			content: "four"
		}
	];

	updateSelected(event) {
		this.items.forEach((item: any) => {
			if (event.some(selectedItem => selectedItem.content === item.content)) {
				item.selected = true;
			} else {
				item.selected = false;
			}
		});
	}

	ngAfterViewInit() {
		setTimeout(() => {
			const newItems = JSON.parse(JSON.stringify(this.items));
			newItems.push({ content: `New ${newItems.length}` });
			this.items = newItems;
		}, 4000);
	}
}
