import { moduleMetadata, Meta } from "@storybook/angular";
import { FormsModule } from "@angular/forms";
import { CdsButton } from "../button";
import { CdsIcon } from "../icon";
import { OverflowMenu, OverflowMenuBody, OverflowMenuOption } from "../overflow-menu";
import { TableRow } from "./table-row.class";
import {
	TableStory,
	DynamicTableStory,
	ExpansionTableStory,
	FilterByFunctionOverrideStory,
	FilterWithModelStory,
	OverflowTableStory,
	PaginationTableStory,
	TableNoDataStory
} from "./stories";
import {
	TableModel,
	TableItem,
	TableHeaderItem,
	TableModule
} from "./";

const simpleModel = new TableModel();
simpleModel.data = [
	[new TableItem({ data: "Name 1" }), new TableItem({ data: "qwer" })],
	[new TableItem({ data: "Name 3" }), new TableItem({ data: "zwer" })],
	[new TableItem({ data: "Name 2" }), new TableItem({ data: "swer" })],
	[new TableItem({ data: "Name 4" }), new TableItem({ data: "twer" })]
];
simpleModel.header = [
	new TableHeaderItem({ data: "Name" }), new TableHeaderItem({ data: "hwer" })
];

const emptyModel = new TableModel();
emptyModel.header = [
	new TableHeaderItem({ data: "Name" }), new TableHeaderItem({ data: "hwer", style: { "width": "auto" } })
];

const getProps = (more = {}, type: "args" | "argTypes") => {
	const defaultProps = type === "args" ? {
		model: simpleModel,
		title: "Table title",
		description: "",
		size: "md",
		isSelectable: true,
		radio: false,
		useZebraStyles: false,
		isSortable: true
	} : {
		size: {
			options: ["xs", "sm", "md", "lg", "xl"],
			control: "select"
		}
	};
	return { ...defaultProps, ...more };
};

function getModelWithDisabledRows() {
	const disabledModel = new TableModel();
	const row1 = new TableRow(new TableItem({ data: "Name 1" }), new TableItem({ data: "Disabled 1" }));
	row1.disabled = true;
	const row2 = new TableRow(new TableItem({ data: "Name 3" }), new TableItem({ data: "Disabled 2" }));
	row2.disabled = true;
	const row3 = new TableRow(new TableItem({ data: "Name 2" }), new TableItem({ data: "Enabled 1" }));
	const row4 = new TableRow(new TableItem({ data: "Name 4" }), new TableItem({ data: "Enabled 2" }));
	disabledModel.header = [new TableHeaderItem({ data: "Name" }), new TableHeaderItem({ data: "State" })];
	disabledModel.data = [row1, row2, row3, row4];
	return disabledModel;
}

// Story starts here
export default {
	title: "Components/Table",
	decorators: [
		moduleMetadata({
			imports: [
				FormsModule,
				CdsButton,
				CdsIcon,
				TableModule,
				OverflowMenu,
				OverflowMenuBody,
				OverflowMenuOption,

				// stories
				TableStory,
				DynamicTableStory,
				ExpansionTableStory,
				FilterByFunctionOverrideStory,
				FilterWithModelStory,
				OverflowTableStory,
				PaginationTableStory,
				TableNoDataStory
			]
		})
	],
	argTypes: {
		model: {
			control: false,
			disabled: true
		}
	}
} as Meta;

/**
 * app-* components are for demo purposes only. Their source is in `src/table/stories`.
 * They render a `cds-table` and project their content into it, so the title, description
 * and toolbar below land in the table's `title`, `description` and `toolbar` slots.
 */
const Template = (args) => ({
	props: args,
	template: `
		<app-table
			[model]="model"
			[size]="size"
			[radio]="radio"
			[isSelectable]="isSelectable"
			[useZebraStyles]="useZebraStyles"
			[isSortable]="isSortable">
			<cds-table-header-title slot="title">{{title}}</cds-table-header-title>
			<cds-table-header-description slot="description">{{description}}</cds-table-header-description>
		</app-table>
	`
});
export const Basic = Template.bind({});
Basic.args = {
	...getProps({}, "args")
};
Basic.argTypes = {
	...getProps({}, "argTypes")
};

const NoDataTemplate = (args) => ({
	props: args,
	template: `
		<app-no-data-table
			[model]="model"
			[size]="size"
			[isSelectable]="isSelectable"
			[useZebraStyles]="useZebraStyles">
			<cds-table-header-title slot="title">{{title}}</cds-table-header-title>
			<cds-table-header-description slot="description">{{description}}</cds-table-header-description>
			<div class="no-data">No data.</div>
		</app-no-data-table>
	`,
	styles: [`
		.no-data {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 150px;
		}
	`]
});
export const WithoutData = NoDataTemplate.bind({});
WithoutData.args = {
	...getProps({
		model: emptyModel
	}, "args")
};

const ToolbarTemplate = (args) => ({
	props: args,
	template: `
		<app-table
			[model]="model"
			[size]="size"
			[isSelectable]="isSelectable"
			[radio]="radio"
			[useZebraStyles]="useZebraStyles"
			[isSortable]="isSortable">
			<cds-table-header-title slot="title">{{title}}</cds-table-header-title>
			<cds-table-header-description slot="description">{{description}}</cds-table-header-description>
			<cds-table-toolbar slot="toolbar">
				<cds-table-batch-actions [model]="model" (cancel)="cancelMethod()">
					<cds-button>
						Delete
						<cds-icon slot="icon" icon="trash-can" />
					</cds-button>
					<cds-button>
						Save
						<cds-icon slot="icon" icon="save" />
					</cds-button>
					<cds-button>
						Download
						<cds-icon slot="icon" icon="download" />
					</cds-button>
				</cds-table-batch-actions>
				<cds-table-toolbar-content>
					<cds-table-toolbar-search [persistent]="searchPersistent" [(ngModel)]="searchModel" />
					<cds-overflow-menu toolbar-action>
						<cds-icon slot="icon" icon="settings" />
						<span slot="tooltip-content">Settings</span>
						<cds-overflow-menu-body flipped>
							<cds-overflow-menu-item>Option 1</cds-overflow-menu-item>
							<cds-overflow-menu-item>Option 2</cds-overflow-menu-item>
							<cds-overflow-menu-item disabled>Disabled</cds-overflow-menu-item>
							<cds-overflow-menu-item type="danger">Danger option</cds-overflow-menu-item>
						</cds-overflow-menu-body>
					</cds-overflow-menu>
					<cds-button>
						Primary button
						<cds-icon slot="icon" icon="add" />
					</cds-button>
				</cds-table-toolbar-content>
			</cds-table-toolbar>
		</app-table>
	`
});
export const WithToolbar = ToolbarTemplate.bind({});
WithToolbar.args = {
	...getProps({
		description: "With toolbar",
		searchModel: "",
		searchPersistent: false,
		cancelMethod: () => {
			// eslint-disable-next-line no-console
			console.log("Custom cancel method");
		}
	}, "args")
};
WithToolbar.argTypes = {
	...getProps({}, "argTypes")
};

const DisabledRowsTemplate = (args) => ({
	props: args,
	template: `
		<app-no-data-table
			[model]="model"
			[size]="size"
			[isSelectable]="true"
			[useZebraStyles]="useZebraStyles">
			<cds-table-header-title slot="title">{{title}}</cds-table-header-title>
			<cds-table-header-description slot="description">{{description}}</cds-table-header-description>
			<cds-table-toolbar slot="toolbar">
				<cds-table-batch-actions [model]="model">
					<cds-button>
						Delete
						<cds-icon slot="icon" icon="trash-can" />
					</cds-button>
				</cds-table-batch-actions>
				<cds-table-toolbar-content>
					<cds-table-toolbar-search />
					<cds-button>
						Primary button
						<cds-icon slot="icon" icon="add" />
					</cds-button>
				</cds-table-toolbar-content>
			</cds-table-toolbar>
		</app-no-data-table>
	`
});
export const WithDisabledRows = DisabledRowsTemplate.bind({});
WithDisabledRows.storyName = "With toolbar and disabled rows";
WithDisabledRows.args = {
	...getProps({
		model: getModelWithDisabledRows(),
		description: "With toolbar & disabled rows"
	}, "args")
};
WithDisabledRows.argTypes = {
	...getProps({}, "argTypes")
};

const FilteringOverridingTemplate = (args) => ({
	props: args,
	template: `
		<app-function-override-filter-table
			[size]="size"
			[isSelectable]="isSelectable"
			[useZebraStyles]="useZebraStyles">
		</app-function-override-filter-table>
	`
});
export const FilteringOverriding = FilteringOverridingTemplate.bind({});
FilteringOverriding.storyName = "Filtering by overriding isRowFiltered [Recommended]";
FilteringOverriding.args = {
	...getProps({}, "args")
};

const FilteringTemplate = (args) => ({
	props: args,
	template: `
		<app-model-filter-table
			[size]="size"
			[isSelectable]="isSelectable"
			[useZebraStyles]="useZebraStyles">
		</app-model-filter-table>
	`
});
export const Filtering = FilteringTemplate.bind({});
Filtering.storyName = "Filtering by alteration of model data";
Filtering.args = {
	...getProps({}, "args")
};

const ExpansionTemplate = (args) => ({
	props: args,
	template: `
		<app-expansion-table
			[size]="size"
			[isSelectable]="isSelectable"
			[isSortable]="isSortable"
			[useZebraStyles]="useZebraStyles"
			[batchExpansion]="batchExpansion">
			<cds-table-header-title slot="title">{{title}}</cds-table-header-title>
			<cds-table-header-description slot="description">{{description}}</cds-table-header-description>
		</app-expansion-table>
	`
});
export const WithExpansion = ExpansionTemplate.bind({});
WithExpansion.args = {
	...getProps({
		description: "With expansion",
		batchExpansion: false
	}, "args")
};

const DynamicContentTemplate = (args) => ({
	props: args,
	template: `
		<app-custom-table
			[size]="size"
			[isSelectable]="isSelectable"
			[isSortable]="isSortable"
			[useZebraStyles]="useZebraStyles">
			<cds-table-header-title slot="title">{{title}}</cds-table-header-title>
			<cds-table-header-description slot="description">{{description}}</cds-table-header-description>
		</app-custom-table>
	`
});
export const WithDynamicContent = DynamicContentTemplate.bind({});
WithDynamicContent.args = {
	...getProps({
		description: "With dynamic content"
	}, "args")
};

const OverflowMenuTemplate = (args) => ({
	props: args,
	template: `
		<app-overflow-table
			[size]="size"
			[isSelectable]="isSelectable"
			[isSortable]="isSortable"
			[useZebraStyles]="useZebraStyles">
			<cds-table-header-title slot="title">{{title}}</cds-table-header-title>
			<cds-table-header-description slot="description">{{description}}</cds-table-header-description>
		</app-overflow-table>
	`
});
export const WithOverflowMenu = OverflowMenuTemplate.bind({});
WithOverflowMenu.args = {
	...getProps({
		description: "With overflow menu"
	}, "args")
};

const PaginationTemplate = (args) => ({
	props: args,
	template: `
		<app-pagination-table
			[isSortable]="isSortable"
			[totalDataLength]="totalDataLength"
			[isSelectable]="isSelectable">
			<cds-table-header-title slot="title">{{title}}</cds-table-header-title>
			<cds-table-header-description slot="description">{{description}}</cds-table-header-description>
		</app-pagination-table>
	`
});
export const WithPagination = PaginationTemplate.bind({});
WithPagination.args = {
	...getProps({
		totalDataLength: 105,
		description: "With pagination"
	}, "args")
};

const FromComponentsTemplate = (args) => ({
	props: args,
	template: `
		<!-- Without a model, the web component sorts, selects and filters the rows itself. -->
		<cds-table [isSortable]="isSortable" [isSelectable]="isSelectable" [size]="size" [useZebraStyles]="useZebraStyles">
			<cds-table-header-title slot="title">{{title}}</cds-table-header-title>
			<cds-table-header-description slot="description">Written as markup</cds-table-header-description>
			<cds-table-toolbar slot="toolbar">
				<cds-table-toolbar-content>
					<cds-table-toolbar-search persistent />
				</cds-table-toolbar-content>
			</cds-table-toolbar>
			<cds-table-head>
				<cds-table-header-row>
					@for (column of model.header; track $index) {
						<cds-table-header-cell>{{ column.data }}</cds-table-header-cell>
					}
				</cds-table-header-row>
			</cds-table-head>
			<cds-table-body>
				@for (row of model.data; track $index) {
					<cds-table-row>
						@for (item of row; track $index) {
							<cds-table-cell>{{ item.data }}</cds-table-cell>
						}
					</cds-table-row>
				}
			</cds-table-body>
		</cds-table>
	`
});
export const FromComponents = FromComponentsTemplate.bind({});
FromComponents.args = {
	...getProps({ size: "lg" }, "args")
};
FromComponents.argTypes = {
	...getProps({}, "argTypes")
};

const SkeletonTemplate = (args) => ({
	props: args,
	template: `
		<cds-table-skeleton
			[columnCount]="columnCount"
			[rowCount]="rowCount"
			[showHeader]="showHeader"
			[showToolbar]="showToolbar"
			[zebra]="zebra" />
	`
});
export const Skeleton = SkeletonTemplate.bind({});
Skeleton.args = {
	columnCount: 5,
	rowCount: 5,
	showHeader: true,
	showToolbar: true,
	zebra: false
};
