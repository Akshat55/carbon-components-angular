import { moduleMetadata, Meta } from "@storybook/angular";
import { ContainedListModule, ContainedList, ContainedListItem } from ".";
import { ButtonModule } from "../button";
import { IconModule } from "../icon";
import { LayerModule } from "../layer";
import { LayoutModule } from "../layout";
import { TagModule } from "../tag";
import { OverflowMenuModule } from "../overflow-menu";
import { TooltipModule } from "../tooltip";
import { SearchModule } from "../search";
import { ContainedListKind, ContainedListSize } from "./contained-list.enums";
import { ContainedListStoryModule  } from "./stories/contained-list-story.module";
import { I18n } from "../i18n";
import { PlaceholderService } from "../placeholder";

export default {
	title: "Components/Contained List",
	decorators: [
		moduleMetadata({
			imports: [
				ButtonModule,
				ContainedListModule,
				ContainedListStoryModule,
				IconModule,
				LayerModule,
				OverflowMenuModule,
				LayoutModule,
				SearchModule,
				TagModule,
				TooltipModule
			],
			providers: [
				I18n,
				PlaceholderService
			]
		})
	],
	component: ContainedList,
	subcomponents: {
		ContainedListItem
	},
	args: {
		isInset: false,
		kind: ContainedListKind.OnPage,
		label: "List title",
		size: ContainedListSize.Large
	},
	argTypes: {
		label: {
			type: { name: "string", required: true }
		},
		action: {
			table: {
				disable: true
			}
		}
	}
} as Meta;

const basicTemplate = () => ({
	template: `
		<cds-contained-list label="List title">
			<cds-contained-list-item>List item</cds-contained-list-item>
			<cds-contained-list-item>List item</cds-contained-list-item>
			<cds-contained-list-item>List item</cds-contained-list-item>
			<cds-contained-list-item>List item</cds-contained-list-item>
		</cds-contained-list>
		<cds-contained-list label="List title">
			<cds-contained-list-item>List item</cds-contained-list-item>
			<cds-contained-list-item>List item</cds-contained-list-item>
			<cds-contained-list-item>List item</cds-contained-list-item>
			<cds-contained-list-item>List item</cds-contained-list-item>
		</cds-contained-list>
	`
});
export const basic = basicTemplate.bind({});

const usageExamplesTemplate = () => ({
	template: `
		<ng-template #add let-item>
			<cds-icon-button
				type="button"
				kind="primary"
				align="left"
				description="Add">
				<svg cdsIcon="add" size="16"></svg>
			</cds-icon-button>
		</ng-template>
		<ng-template #overflowMenu let-item>
			<cds-overflow-menu description="Options" [flip]="true">
				<cds-overflow-menu-body [flipped]="true">
					<cds-overflow-menu-item>View details</cds-overflow-menu-item>
					<cds-overflow-menu-item>Edit</cds-overflow-menu-item>
					<cds-overflow-menu-item [divider]="true" type="danger">Remove</cds-overflow-menu-item>
				</cds-overflow-menu-body>
			</cds-overflow-menu>
		</ng-template>
		<cds-contained-list label="List title" [action]="add">
			<cds-contained-list-item [action]="overflowMenu">List item</cds-contained-list-item>
			<cds-contained-list-item [action]="overflowMenu">List item</cds-contained-list-item>
			<cds-contained-list-item [action]="overflowMenu">List item</cds-contained-list-item>
		</cds-contained-list>

		<ng-template #addGhost let-item>
			<cds-icon-button
				type="button"
				kind="ghost"
				align="left"
				description="Add">
				<svg cdsIcon="add" size="16"></svg>
			</cds-icon-button>
		</ng-template>
		<cds-contained-list label="List title" [action]="addGhost">
			<cds-contained-list-item>
				List item
				<cds-contained-list-description>Description text</cds-contained-list-description>
			</cds-contained-list-item>
			<cds-contained-list-item>
				List item
				<cds-contained-list-description>Description text</cds-contained-list-description>
			</cds-contained-list-item>
			<cds-contained-list-item>
				List item
				<cds-contained-list-description>Description text</cds-contained-list-description>
			</cds-contained-list-item>
		</cds-contained-list>

		<cds-contained-list label="List title">
			<cds-contained-list-item>
				<div style="display: 'grid'; gridTemplateColumns: repeat(3, 1fr); columnGap: 1rem">
					<span>List item</span>
					<span>List item details</span>
					<span>List item details</span>
				</div>
			</cds-contained-list-item>
			<cds-contained-list-item>
				<div style="display: 'grid'; gridTemplateColumns: repeat(3, 1fr); columnGap: 1rem">
					<span>List item</span>
					<span>List item details</span>
					<span>List item details</span>
				</div>
			</cds-contained-list-item>
			<cds-contained-list-item>
				<div style="display: 'grid'; gridTemplateColumns: repeat(3, 1fr); columnGap: 1rem">
					<span>List item</span>
					<span>List item details</span>
					<span>List item details</span>
				</div>
			</cds-contained-list-item>
		</cds-contained-list>
	`
});
export const usageExamples = usageExamplesTemplate.bind({});

const disclosedTemplate = () => ({
	template: `
		<cds-contained-list label="List title" kind="disclosed">
			<cds-contained-list-item>List item</cds-contained-list-item>
			<cds-contained-list-item>List item</cds-contained-list-item>
			<cds-contained-list-item>List item</cds-contained-list-item>
			<cds-contained-list-item>List item</cds-contained-list-item>
		</cds-contained-list>
		<cds-contained-list label="List title" kind="disclosed">
			<cds-contained-list-item>List item</cds-contained-list-item>
			<cds-contained-list-item>List item</cds-contained-list-item>
			<cds-contained-list-item>List item</cds-contained-list-item>
			<cds-contained-list-item>List item</cds-contained-list-item>
		</cds-contained-list>
	`
});
export const disclosed = disclosedTemplate.bind({});

const withActionsTemplate = () => ({
	template: `
		<ng-template #action let-item>
			<cds-icon-button kind="ghost" description="Action">
				<svg cdsIcon="subtract--alt" size="16"></svg>
			</cds-icon-button>
		</ng-template>

		<cds-contained-list label="List title" [size]="size">
			<cds-contained-list-item [action]="action">List item</cds-contained-list-item>
			<cds-contained-list-item [action]="action">List item</cds-contained-list-item>
			<cds-contained-list-item [action]="action">List item</cds-contained-list-item>
			<cds-contained-list-item [action]="action">List item</cds-contained-list-item>
		</cds-contained-list>
	`
});
export const withActions = withActionsTemplate.bind({});

export const withActionsAndContextData = (args) => {
	args = {
		...args,
		items: [
			{
				id: 1,
				label: "List Item"
			},
			{
				id: 2,
				label: "List Item"
			},
			{
				id: 3,
				label: "List Item"
			},
			{
				id: 4,
				label: "List Item"
			}
		],
		onActionClick: (item: any) => { alert(`${item.label} ${item.id} action click triggered`); }
	};

	return {
		props: args,
		template: `
			<ng-template #actionWithClick let-actionData>
				<cds-icon-button kind="ghost" description="Action" (click)="onActionClick(actionData)">
				<svg cdsIcon="add" size="16"></svg>
			</cds-icon-button>
			</ng-template>
			<cds-contained-list label="List title" [size]="size">
				@for (item of items; track item.id) {
					<cds-contained-list-item
						[action]="actionWithClick"
						[actionData]="item">
						{{ item.label }} {{ item.id }}
					</cds-contained-list-item>
				}
			</cds-contained-list>
		`
	};
};

const withIconsTemplate = () => ({
	template: `
		<ng-template #apple let-icon>
			<svg cdsIcon="apple" size="16"></svg>
		</ng-template>

		<ng-template #wheat let-icon>
			<svg cdsIcon="wheat" size="16"></svg>
		</ng-template>

		<cds-contained-list label="List title">
			<cds-contained-list-item [icon]="apple">List item</cds-contained-list-item>
			<cds-contained-list-item [icon]="wheat">List item</cds-contained-list-item>
			<cds-contained-list-item icon="strawberry">List item</cds-contained-list-item>
			<cds-contained-list-item icon="fish">List item</cds-contained-list-item>
		</cds-contained-list>
	`
});
export const withIcons = withIconsTemplate.bind({});

const withInteractiveItemsTemplate = () => ({
	template: `
		<cds-contained-list label="List title">
			<cds-contained-list-item [clickable]="true">
				List item
			</cds-contained-list-item>
			<cds-contained-list-item [clickable]="true" [disabled]="true">
				List item
			</cds-contained-list-item>
			<cds-contained-list-item [clickable]="true">
				List item
			</cds-contained-list-item>
			<cds-contained-list-item [clickable]="true">
				List item
			</cds-contained-list-item>
		</cds-contained-list>
	`
});
export const withInteractiveItems = withInteractiveItemsTemplate.bind({});

const withInteractiveItemsAndActionsTemplate = () => ({
	template: `
		<ng-template #action let-item>
			<cds-icon-button kind="ghost" description="Action">
				<svg cdsIcon="subtract--alt" size="16"></svg>
			</cds-icon-button>
		</ng-template>
		<ng-template #search>
			<cds-search [expandable]="true" size="lg"></cds-search>
		</ng-template>
		<cds-contained-list label="List title" [action]="search">
			<cds-contained-list-item [clickable]="true" [action]="action">
				List item
			</cds-contained-list-item>
			<cds-contained-list-item [clickable]="true" [action]="action">
				List item
			</cds-contained-list-item>
			<cds-contained-list-item [clickable]="true" [action]="action">
				List item
			</cds-contained-list-item>
			<cds-contained-list-item [clickable]="true" [action]="action">
				List item
			</cds-contained-list-item>
		</cds-contained-list>
	`
});
export const withInteractiveItemsAndActions = withInteractiveItemsAndActionsTemplate.bind({});

const withLayerTemplate = () => ({
	template: `
		<cds-stack orientation="vertical" [gap]="5">
			<cds-contained-list label="List title">
				<cds-contained-list-item>List item</cds-contained-list-item>
				<cds-contained-list-item>List item</cds-contained-list-item>
				<cds-contained-list-item>List item</cds-contained-list-item>
				<cds-contained-list-item>List item</cds-contained-list-item>
			</cds-contained-list>
			<cds-layer>
				<cds-stack orientation="vertical" [gap]="5">
					<cds-contained-list label="List title">
						<cds-contained-list-item>List item</cds-contained-list-item>
						<cds-contained-list-item>List item</cds-contained-list-item>
					</cds-contained-list>
					<cds-layer>
						<cds-contained-list label="List title">
							<cds-contained-list-item>List item</cds-contained-list-item>
							<cds-contained-list-item>List item</cds-contained-list-item>
						</cds-contained-list>
					</cds-layer>
				</cds-stack>
			</cds-layer>
		</cds-stack>
	`
});
export const withLayer = withLayerTemplate.bind({});

const withListTitleDecoratorsTemplate = () => ({
	template: `
		<ng-template #label let-item>
			<div style="display: flex; alignItems: center; justifyContent: space-between">
		    	<span>List title</span>
		    	<cds-tag size="sm">4</cds-tag>
		    </div>
		</ng-template>
		<cds-contained-list [label]="label">
			<cds-contained-list-item>List item</cds-contained-list-item>
			<cds-contained-list-item>List item</cds-contained-list-item>
			<cds-contained-list-item>List item</cds-contained-list-item>
			<cds-contained-list-item>List item</cds-contained-list-item>
		</cds-contained-list>
	`
});
export const withListTitleDecorators = withListTitleDecoratorsTemplate.bind({});
