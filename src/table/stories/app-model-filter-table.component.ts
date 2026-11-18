import {
	Component,
	inject,
	Input,
	OnInit
} from "@angular/core";
import { TableModel } from "../table-model.class";
import { TableHeaderItem } from "../table-header-item.class";
import { TableItem } from "../table-item.class";

import { IconService } from "../../icon/icon.service";
import Add16 from "@carbon/icons/es/add/16";
import Filter16 from "@carbon/icons/es/filter/16";
import { Table } from "../table.component";
import { CdsButton } from "../../button";
import { CdsIcon } from "../../icon";
import {
	TableHeaderDescription,
	TableHeaderTitle,
	TableToolbar,
	TableToolbarContent,
	TableToolbarSearch
} from "../table-parts.component";
import { Checkbox } from "../../checkbox";
import { PopoverContainer, PopoverContent } from "../../popover";

@Component({
	selector: "app-model-filter-table",
	template: `
	<cds-table
		[model]="model"
		[isSortable]="false"
		[size]="size"
		[isSelectable]="isSelectable"
		[radio]="radio"
		[useZebraStyles]="useZebraStyles">
		<cds-table-header-title slot="title">Filter table</cds-table-header-title>
		<cds-table-header-description slot="description">
			Use the toolbar's search functionality to filter node names
			or click the filter icon to filter country names
		</cds-table-header-description>
		<cds-table-toolbar slot="toolbar">
			<cds-table-toolbar-content>
				<cds-table-toolbar-search (valueChange)="filterNodeNames($event)" />
				<cds-popover [(isOpen)]="filterOpen" align="bottom-end" [dropShadow]="true" [caret]="false">
					<cds-button kind="ghost" aria-label="Filter countries" (click)="filterOpen = !filterOpen">
						<cds-icon slot="icon" icon="filter" />
					</cds-button>
					<cds-popover-content>
						<div style="padding: 0 1rem 0.5rem;">
							<div style="padding-top: 0.5rem; color: grey;">Countries shown</div>
							@for (country of countries; track country) {
								<cds-checkbox
									[checked]="displayedCountries.includes(country)"
									(checkedChange)="filterCountries(country, $event)">
									{{ country }}
								</cds-checkbox>
							}
						</div>
					</cds-popover-content>
				</cds-popover>
				<cds-button>
					Primary button
					<cds-icon slot="icon" icon="add" />
				</cds-button>
			</cds-table-toolbar-content>
		</cds-table-toolbar>
		<ng-content />
	</cds-table>
	`,
	standalone: true,
	imports: [
		Table,
		TableHeaderTitle,
		TableHeaderDescription,
		TableToolbar,
		TableToolbarContent,
		TableToolbarSearch,
		CdsButton,
		CdsIcon,
		PopoverContainer,
		PopoverContent,
		Checkbox
	]
})
export class FilterWithModelStory implements OnInit {
	@Input() size = "md";
	@Input() isSelectable = true;
	@Input() radio = false;
	@Input() useZebraStyles = true;
	@Input() noData = false;

	model = new TableModel();
	countries = ["US", "France", "Argentina", "Japan"];
	displayedCountries = [...this.countries];
	filterOpen = false;

	dataset = [
		[
			new TableItem({ data: "800" }),
			new TableItem({ data: "East Sadye" }),
			new TableItem({ data: "Store" }),
			new TableItem({ data: "US" })
		],
		[
			new TableItem({ data: "500" }),
			new TableItem({ data: "Lueilwitzview" }),
			new TableItem({ data: "Store" }),
			new TableItem({ data: "US" })
		],
		[
			new TableItem({ data: "120" }),
			new TableItem({ data: "East Arcelyside" }),
			new TableItem({ data: "Store" }),
			new TableItem({ data: "France" })
		],
		[
			new TableItem({ data: "119" }),
			new TableItem({ data: "West Dylan" }),
			new TableItem({ data: "Store" }),
			new TableItem({ data: "Argentina" })
		],
		[
			new TableItem({ data: "54" }),
			new TableItem({ data: "Brandynberg" }),
			new TableItem({ data: "Store" }),
			new TableItem({ data: "Japan" })
		],
		[
			new TableItem({ data: "15" }),
			new TableItem({ data: "Stoltenbergport" }),
			new TableItem({ data: "Store" }),
			new TableItem({ data: "Canada" })
		],
		[
			new TableItem({ data: "12" }),
			new TableItem({ data: "Rheabury" }),
			new TableItem({ data: "Store" }),
			new TableItem({ data: "US" })
		]
	];

	protected iconService = inject(IconService);

	filterNodeNames(searchString: string) {
		this.model.data = this.dataset
			.filter((row: TableItem[]) => row[1].data.toLowerCase().includes(searchString.toLowerCase()));
	}

	filterCountries(countryName: string, checked: boolean) {
		if (checked) {
			this.displayedCountries.push(countryName);
		} else {
			this.displayedCountries.splice(this.displayedCountries.indexOf(countryName), 1);
		}

		this.model.data = this.dataset.filter((row: TableItem[]) => this.displayedCountries.includes(row[3].data));
	}

	ngOnInit() {
		this.iconService.registerAll([
			Add16, Filter16
		]);

		this.model.header = [
			new TableHeaderItem({
				data: "Node ID"
			}),
			new TableHeaderItem({
				data: "Node name"
			}),
			new TableHeaderItem({
				data: "Node type"
			}),
			new TableHeaderItem({
				data: "Country"
			})
		];

		this.model.data = this.dataset;
	}
}
