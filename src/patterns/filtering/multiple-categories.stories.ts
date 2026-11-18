import { Component, OnInit, OnDestroy } from "@angular/core";
import { moduleMetadata, Meta } from "@storybook/angular";
import {
	TableModel,
	TableHeaderItem,
	TableItem,
	Table
} from "../../table";
import { Dropdown, DropdownList } from "../../dropdown";
import { StructuredList } from "../../structured-list";
import {
	CdsColumn,
	CdsGrid
} from "../../grid";
import { Radio, RadioGroup } from "../../radio";
import { CdsButton } from "../../button";
import { Tag } from "../../tag/index";
import { Checkbox } from "../../checkbox";
import { Hamburger, Header } from "../../ui-shell";
import { FormsModule } from "@angular/forms";

@Component({
	selector: "app-sample-multi-categories",
	template: `
	<div>
		<div class="header">
			<cds-header name="Patterns">
				<cds-header-menu-button></cds-header-menu-button>
			</cds-header>
		</div>
		<cds-grid>
			<cds-column lg="2" md="2" sm="1" class="multi-selection">
				<cds-button (click)="resetFilters()" class="reset-button">Reset Filters</cds-button>
				<fieldset class="cds--fieldset">
					<legend class="cds--label">Radio button label</legend>
					<cds-radio-button-group
						aria-label="radiogroup"
						orientation="vertical"
						labelPlacement="right"
						[(ngModel)]="radio"
						(change)="onRadioChange($event)">
						@for (radio of radios; track radio) {
							<cds-radio-button
								[value]="radio.color"
								[disabled]="radio.disabled">
								{{radio.color}}
							</cds-radio-button>
						}
					</cds-radio-button-group>
				</fieldset>
				<fieldset class="cds--fieldset">
					<cds-grid>
						<cds-column lg="2" md="2" sm="1">
							<legend class="cds--label">Type</legend>
						</cds-column>
						<cds-column lg="2" md="2" sm="1">
							@if (checkBoxFilters.size > 0) {
								<cds-dismissible-tag [text]="'' + checkBoxFilters.size" (close)="resetCheckboxList()" />
							}
						</cds-column>
					</cds-grid>
					@for (listItem of checkboxList; track listItem) {
						<cds-checkbox
							[hideLabel]="hideLabel"
							[checked]="listItem.checked"
							[value]="listItem.value"
							(change)="onCheckboxChange($event)">
							{{ listItem.value }}
						</cds-checkbox>
					}
				</fieldset>
			</cds-column>
			<cds-column lg="10" md="10" sm="3" class="data-table">
				<cds-table
					class="data-table"
					[model]="model"
					size="lg"
					[isSelectable]="false">
				</cds-table>
			</cds-column>
		</cds-grid>
	</div>
	`,
	styles: [`
		.header {
			margin-bottom: 80px;
		}

		.reset-button {
			margin-bottom: 20px;
		}

		.data-table {
			width: 100%;
		}
	`
	],
	imports: [
		CdsGrid,
		CdsColumn,
		Checkbox,
		Tag,
		Radio,
		Header,
		Hamburger,
		Table,
		RadioGroup,
		CdsButton,
		FormsModule
	],
	standalone: true
})
class SampleMultiCategories implements OnInit, OnDestroy {
	model = new TableModel();
	checkBoxFilters: any = [];
	radioFilter = null;

	dataset = [
		{ name: "Apple", type: ["Fruit"], color: "Red" },
		{ name: "Grape", type: ["Fruit"], color: "Purple" },
		{ name: "Eggplant", type: ["Fruit"], color: "Purple" },
		{ name: "FruitVegMeat", type: ["Fruit", "Vegetable", "Meat"], color: "White" },
		{ name: "Lettuce", type: ["Vegetable"], color: "Green" },
		{ name: "Daikon Radish", type: ["Vegetable"], color: "White" },
		{ name: "Beef", type: ["Meat"], color: "Red" }
	];

	radios = [
		{ color: "Red", checked: false },
		{ color: "Purple", checked: false },
		{ color: "Green", checked: false },
		{ color: "White", checked: false }
	];

	checkboxList = [
		{ value: "Fruit", checked: false },
		{ value: "Vegetable", checked: false },
		{ value: "Meat", checked: false }
	];

	onCheckboxChange(event) {
		if (event.checked) {
			this.checkBoxFilters.push(event.source.value);
		} else {
			this.checkBoxFilters.splice(this.checkBoxFilters.indexOf(event.source.value), 1);
		}
		this.applyFilters();
	}

	onRadioChange(event) {
		this.radioFilter = event.value;
		this.applyFilters();
	}

	resetFilters() {
		this.resetCheckboxList();
		this.resetRadios();
	}

	resetCheckboxList() {
		this.checkBoxFilters = [];
		this.checkboxList = this.checkboxList.map(obj => ({ value: obj.value, checked: false }));
		this.applyFilters();
	}

	resetRadios() {
		this.radioFilter = null;
		this.radios = this.radios.map(obj => ({ color: obj.color, checked: false }));
		this.applyFilters();
	}

	applyFilters() {
		this.model.data =
			this.dataset
				.filter(data =>
					(this.checkBoxFilters.every(filter => data.type.includes(filter))) &&
					(data.color === this.radioFilter || !this.radioFilter))
				.map(filteredData =>
					[
						new TableItem({ data: filteredData.name }),
						new TableItem({ data: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." })
					]);
	}

	ngOnInit() {
		document.querySelector(".sb-show-main")?.classList.add("full-page");

		this.model.header = [new TableHeaderItem({ data: "Name" }), new TableHeaderItem({ data: "Description" })];

		this.model.data = this.dataset.map(datapoint =>
			[
				new TableItem({ data: datapoint.name }),
				new TableItem({ data: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." })
			]
		);
	}
	ngOnDestroy() {
		document.querySelector(".sb-show-main")?.classList.remove("full-page");
	}
}

// Storybook starts here
export default {
	title: "Pattern/Filtering",
	decorators: [
		moduleMetadata({
			imports: [
				SampleMultiCategories
			]
		})
	]
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<!--
			app-* components are for demo purposes only.
			You can create your own implementation by using the component source as an example.
		-->
		<app-sample-multi-categories></app-sample-multi-categories>
	`
});
export const MultipleCategories = Template.bind({});
