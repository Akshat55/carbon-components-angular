import { moduleMetadata, Meta } from "@storybook/angular";
import {
	Tag,
	TagFilter,
	TagOperationalComponent,
	TagSelectableComponent
} from "./";
import { IconDirective } from "../icon";
import { PopoverContainer, PopoverContent } from "../popover";
import { AILabelModule } from "../ai-label";
import { ButtonModule } from "../button";
import { AI_LABEL_INNER, AI_LABEL_STORY_STYLES } from "../storybook/ai-label-story-shared";

export default {
	title: "Components/Tag",
	decorators: [
		moduleMetadata({
			imports: [
				Tag,
				IconDirective,
				PopoverContainer,
				PopoverContent,
				TagOperationalComponent,
				TagFilter,
				TagSelectableComponent,
				AILabelModule,
				ButtonModule
			]
		})
	],
	args: {
		size: "md",
		type: "red",
		skeleton: false
	},
	argTypes: {
		type: {
			options: [
				"warm-gray",
				"red",
				"magenta",
				"purple",
				"blue",
				"cyan",
				"teal",
				"green",
				"cool-gray",
				"high-contrast",
				"outline"
			],
			control: "select"
		}
	},
	component: Tag
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<cds-tag
			[type]="type"
			[skeleton]="skeleton"
			[size]="size">
			<div cdsTagIcon>
				<svg ibmIcon="settings" size="16"></svg>
			</div>
			Read only
		</cds-tag>
	`
});
export const Basic = Template.bind({});

const FilteredTemplate = (args) => ({
	props: args,
	template: `
		<cds-dismissible-tag
			text="Filtered"
			[type]="type"
			[size]="size"
			title="Filter"
			closeButtonLabel="Clear">
			<div cdsTagIcon>
				<svg ibmIcon="settings" size="16"></svg>
			</div>
		</cds-dismissible-tag>
	`
});
export const Filter = FilteredTemplate.bind({});

const SelectedTagTemplate = (args) => ({
	props: args,
	template: `
		<cds-selectable-tag
			text="Selectable"
			[size]="size"
			[selected]="selected"
			(selectedChange)="selectedChange($event)"
			(click)="onClick($event)">
			<div cdsTagIcon>
				<svg ibmIcon="settings" size="16"></svg>
			</div>
		</cds-selectable-tag>
	`
});
export const SelectedTag = SelectedTagTemplate.bind({});
SelectedTag.args = {
	selected: false
};
SelectedTag.argTypes = {
	onClick: { action: "clicked" },
	selectedChange: { action: "Selected change" }
};

const OperationalTagTemplate = (args) => ({
	props: args,
	template: `
		<cds-operational-tag
			text="Operational"
			type="cyan"
			[size]="size"
			(click)="onClick($event)">
			<div cdsTagIcon>
				<svg ibmIcon="settings" size="16"></svg>
			</div>
		</cds-operational-tag>


		<cds-popover
			[isOpen]="isOpen"
			[highContrast]="true">
			<cds-operational-tag
				text="Operational w/ popover"
				[type]="type"
				[size]="size"
				(click)="isOpen = !isOpen">
				<div cdsTagIcon>
					<svg ibmIcon="settings" size="16"></svg>
				</div>
			</cds-operational-tag>
			<cds-popover-content>
				<div class="popover-content">
					Tag 1 name <br>
					Tag 2 name <br>
					Tag 3 name <br>
					Tag 4 name <br>
					<cds-tag type="green">Tag 5 name</cds-tag>
				</div>
			</cds-popover-content>
		</cds-popover>
	`,
	styles: [
		`.popover-content {
			line-height: 1.5;
			padding: 1rem;
			font-size: 14px;
		}`
	]
});
export const OperationalTag = OperationalTagTemplate.bind({});
// OperationalTag.args = {
// 	isOpen: false
// };
OperationalTag.argTypes = {
	onClick: { action: "clicked" }
};

export const withAILabel = () => ({
	styles: AI_LABEL_STORY_STYLES,
	template: `
		<cds-tag [type]="'gray'" [decorator]="decoratorTpl">
			Tag with decorator
		</cds-tag>
		<ng-template #decoratorTpl>
			<cds-ai-label
				class="ai-label-container"
				kind="inline"
				size="sm"
				[autoAlign]="true"
				aiText="AI"
				ariaLabel="Show information">
				` + AI_LABEL_INNER + `
			</cds-ai-label>
		</ng-template>
	`
});
