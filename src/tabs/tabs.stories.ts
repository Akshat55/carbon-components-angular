import { moduleMetadata, Meta } from "@storybook/angular";
import { IconModule } from "../icon/icon.module";

import {
	Tab,
	TabItemSkeleton,
	TabSkeleton,
	Tabs,
	TabsVertical
} from "./";

import { TabsStoryModule } from "./stories";

export default {
	title: "Components/Tabs",
	decorators: [
		moduleMetadata({
			imports: [
				Tabs,
				Tab,
				TabsVertical,
				TabSkeleton,
				TabItemSkeleton,
				IconModule,
				TabsStoryModule
			]
		})
	],
	component: Tabs,
	subcomponents: { Tab, TabsVertical }
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<cds-tabs
			[type]="type"
			[size]="size"
			[fullWidth]="fullWidth"
			[selectionMode]="selectionMode"
			[(value)]="value"
			(selected)="selected($event)">
			<cds-tab value="one" target="panel-one">Tab label 1</cds-tab>
			<cds-tab value="two" target="panel-two" secondaryLabel="(21/25)">Tab label 2</cds-tab>
			<cds-tab value="three" target="panel-three" [disabled]="true">Tab label 3</cds-tab>
			<cds-tab value="four" target="panel-four">Tab label 4</cds-tab>
		</cds-tabs>
		<div id="panel-one" role="tabpanel" hidden>Tab Panel 1</div>
		<div id="panel-two" role="tabpanel" hidden>Tab Panel 2</div>
		<div id="panel-three" role="tabpanel" hidden>Tab Panel 3</div>
		<div id="panel-four" role="tabpanel" hidden>
			<!-- With [(value)], panels can also be rendered only when their tab is selected -->
			@if (value === "four") {
				Tab Panel 4
			}
		</div>
	`
});
export const Basic = Template.bind({});
Basic.args = {
	type: "line",
	size: "md",
	fullWidth: false,
	selectionMode: "automatic",
	value: "one"
};
Basic.argTypes = {
	type: {
		options: ["line", "contained"],
		control: "radio"
	},
	size: {
		options: ["sm", "md", "lg"],
		control: "radio"
	},
	selectionMode: {
		options: ["automatic", "manual"],
		control: "radio"
	},
	selected: { action: "selected" }
};

export const Contained = Template.bind({});
Contained.args = {
	...Basic.args,
	type: "contained"
};
Contained.argTypes = Basic.argTypes;

const IconTemplate = (args) => ({
	props: args,
	template: `
		<cds-tabs [type]="type" [iconSize]="iconSize">
			<cds-tab target="icon-panel-1" [iconOnly]="true" ariaLabel="Dashboard">
				<svg cdsIcon="dashboard" size="16"></svg>
			</cds-tab>
			<cds-tab target="icon-panel-2" [iconOnly]="true" ariaLabel="Monitoring">
				<svg cdsIcon="cloud--monitoring" size="16"></svg>
			</cds-tab>
			<cds-tab target="icon-panel-3" [iconOnly]="true" ariaLabel="Activity">
				<svg cdsIcon="activity" size="16"></svg>
			</cds-tab>
			<cds-tab target="icon-panel-4" [iconOnly]="true" ariaLabel="Settings" [badgeIndicator]="true">
				<svg cdsIcon="settings" size="16"></svg>
			</cds-tab>
		</cds-tabs>
		<div id="icon-panel-1" role="tabpanel" hidden>Dashboard</div>
		<div id="icon-panel-2" role="tabpanel" hidden>Monitoring</div>
		<div id="icon-panel-3" role="tabpanel" hidden>Activity</div>
		<div id="icon-panel-4" role="tabpanel" hidden>Settings</div>
	`
});
export const IconOnly = IconTemplate.bind({});
IconOnly.args = {
	type: "line",
	iconSize: "default"
};
IconOnly.argTypes = {
	type: {
		options: ["line", "contained"],
		control: "radio"
	},
	iconSize: {
		options: ["default", "lg"],
		control: "radio"
	}
};

const DismissableTemplate = (args) => ({
	props: {
		...args,
		tabs: [1, 2, 3, 4, 5],
		close(index: number) {
			this.tabs = this.tabs.filter((_, i) => i !== index);
		}
	},
	template: `
		<cds-tabs [type]="type" [dismissable]="true" (tabClose)="close($event)">
			@for (tab of tabs; track tab) {
				<cds-tab [target]="'dismissable-panel-' + tab">Tab label {{tab}}</cds-tab>
			}
		</cds-tabs>
		@for (tab of tabs; track tab) {
			<div [id]="'dismissable-panel-' + tab" role="tabpanel" hidden>Tab Panel {{tab}}</div>
		}
	`
});
export const Dismissable = DismissableTemplate.bind({});
Dismissable.args = {
	type: "line"
};
Dismissable.argTypes = {
	type: {
		options: ["line", "contained"],
		control: "radio"
	}
};

const VerticalTemplate = (args) => ({
	props: args,
	template: `
		<cds-tabs-vertical [height]="height">
			<cds-tabs slot="tabs">
				<cds-tab target="vertical-panel-1">Dashboard</cds-tab>
				<cds-tab target="vertical-panel-2">Extra long label that will go two lines then truncate</cds-tab>
				<cds-tab target="vertical-panel-3">Activity</cds-tab>
				<cds-tab target="vertical-panel-4" [disabled]="true">Settings</cds-tab>
			</cds-tabs>
			<div slot="panel" id="vertical-panel-1" role="tabpanel" hidden>Dashboard panel</div>
			<div slot="panel" id="vertical-panel-2" role="tabpanel" hidden>Long label panel</div>
			<div slot="panel" id="vertical-panel-3" role="tabpanel" hidden>Activity panel</div>
			<div slot="panel" id="vertical-panel-4" role="tabpanel" hidden>Settings panel</div>
		</cds-tabs-vertical>
	`
});
export const Vertical = VerticalTemplate.bind({});
Vertical.args = {
	height: "400px"
};

const SkeletonTemplate = (args) => ({
	props: args,
	template: `
		<cds-tabs-skeleton [contained]="contained" [numOfTabs]="5" />
	`
});
export const Skeleton = SkeletonTemplate.bind({});
Skeleton.args = {
	contained: false
};
