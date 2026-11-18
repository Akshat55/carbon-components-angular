import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { moduleMetadata, Meta } from "@storybook/angular";
import {
	BaseModal,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader
} from "../../modal";
import {
	Table,
	TableHeaderItem,
	TableItem,
	TableModel,
	TableToolbar,
	TableToolbarContent,
	TableToolbarSearch
} from "../../table/index";
import { CdsButton } from "../../button";
import { ProgressIndicator } from "../../progress-indicator";
import { CdsLink } from "../../link";

@Component({
	selector: "app-modal-with-table",
	template: `
		<cds-modal
			size="lg"
			[open]="true"
			(overlaySelected)="closeModal()">
			<cds-modal-header>
				<cds-modal-heading>Create workspace</cds-modal-heading>
			</cds-modal-header>
			<cds-modal-body>
				<div class="progress-wrapper">
					<cds-progress-indicator
						[steps]="steps"
						[current]="current"
						spacing="equal">
					</cds-progress-indicator>
				</div>
				<cds-table
					[model]="model"
					size="sm"
					[isSelectable]="true"
					[isSortable]="false"
					[useZebraStyles]="false">
					<cds-table-toolbar slot="toolbar">
						<cds-table-toolbar-content>
							<cds-table-toolbar-search
								placeholder="Search node ID"
								(valueChange)="onSearch($event)" />
						</cds-table-toolbar-content>
					</cds-table-toolbar>
				</cds-table>
			</cds-modal-body>
			<cds-modal-footer>
				<cds-link href="#" [disabled]="disabled" [inline]="inline">Cancel</cds-link>
				<div class="buttons-wrapper">
					<cds-button class="modal-button" kind="secondary">Previous</cds-button>
					<cds-button class="modal-button" kind="primary">Next</cds-button>
				</div>
			</cds-modal-footer>
		</cds-modal>
	`,
	encapsulation: ViewEncapsulation.None,
	styles: [`
		.cds--modal-content {
			/* !important is needed to prevent override from media queries. */
			padding-left: 0 !important;
			padding-right: 0 !important;
		}

		.progress-wrapper {
			margin-top: 2rem;
			margin-bottom: 1rem;
			padding-left: 1rem;
			padding-right: 1rem;
			width: 100%;
		}

		.buttons-wrapper {
			width: 50%;
		}

		.modal-button{
			width: 50%;
		}

		.cds--link {
			position: absolute;
			align-self: center;
			left: 1rem;
		}
	`
	],
	imports: [
		Modal,
		ModalHeader,
		ModalBody,
		ModalFooter,
		Table,
		TableToolbar,
		TableToolbarContent,
		TableToolbarSearch,
		CdsButton,
		ProgressIndicator,
		CdsLink
	],
	standalone: true
})
class ModalWithTableStory extends BaseModal implements OnInit {
	steps = [
		{
			text: "General",
			state: ["complete"]
		},
		{
			text: "Select nodes",
			state: ["current"]
		},
		{
			text: "Select widgets",
			state: ["incomplete"]
		}
	];

	current = 1;

	model = new TableModel();

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

	ngOnInit() {
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

	onSearch(searchString: string) {
		this.model.data = this.dataset.filter(row => row[0].data.toLowerCase().includes(searchString));
	}
}

// Storybook starts here
export default {
	title: "Pattern/Dialogs",
	decorators: [
		moduleMetadata({
			declarations: [],
			imports: [

				// Story
				ModalWithTableStory
			]
		})
	],
	parameters:{
		docs: {
			story: {
				inline: false,
				height: "30rem"
			}
		},
		layout: "centered"
	}
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<!--
		app-* components are for demo purposes only.
		You can create your own implementation by using the component source as an example.
		-->
		<app-modal-with-table></app-modal-with-table>
	`
});
export const WithDataTable = Template.bind({});
