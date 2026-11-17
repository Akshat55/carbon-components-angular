import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { moduleMetadata, Meta } from "@storybook/angular";
import { Dropdown, DropdownItem, DropdownList, MultiSelect, MultiSelectItem } from "./";
import { Placeholder } from "../placeholder";

import { ReactiveFormsStory } from "./stories";
import { JsonPipe } from "@angular/common";
import { AILabelModule } from "../ai-label";
import { ButtonModule } from "../button";
import { IconModule } from "../icon";
import { AI_LABEL_INNER } from "../storybook/ai-label-story-shared";

export default {
	title: "Components/Dropdown",
	decorators: [
		moduleMetadata({
			imports: [
				FormsModule,
				ReactiveFormsModule,
				Dropdown,
				DropdownItem,
				MultiSelect,
				MultiSelectItem,
				DropdownList,
				Placeholder,
				ReactiveFormsStory,
				JsonPipe,
				AILabelModule,
				ButtonModule,
				IconModule
			]
		})
	],
	args: {
		label: "Label",
		hideLabel: false,
		helperText: "Optional helper text",
		disabled: false,
		readonly: false,
		invalid: false,
		invalidText: "A valid value is required",
		warn: false,
		warnText: "This is a warning",
		items: [
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
			},
			{
				content: "five"
			},
			{
				content: "six"
			},
			{
				content: "seven"
			},
			{
				content: "eight"
			},
			{
				content: "nine"
			},
			{
				content: "ten"
			}
		],
		appendInline: false,
		dropUp: false,
		size: "md",
		theme: "dark",
		fluid: false,
		isOpen: false,
		itemValueKey: "content"
	},
	argTypes: {
		type: {
			control: false
		},
		size: {
			options: ["sm", "md", "lg"],
			control: "radio"
		},
		theme: {
			options: ["light", "dark"],
			control: "radio"
		},
		selected: { action: "Selection changed!" },
		onClose: { action: "Closed!" }
	},
	component: Dropdown
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<cds-dropdown
			[label]="label"
			[hideLabel]="hideLabel"
			[skeleton]="skeleton"
			[helperText]="helperText"
			[size]="size"
			[dropUp]="dropUp"
			[invalid]="invalid"
			[invalidText]="invalidText"
			[warn]="warn"
			[warnText]="warnText"
			[theme]="theme"
			placeholder="Select"
			[disabled]="disabled"
			[readonly]="readonly"
			[fluid]="fluid"
			[isOpen]="isOpen"
			[itemValueKey]="itemValueKey"
			(selected)="selected($event)"
			(onClose)="onClose($event)">
			<cds-dropdown-list [items]="items"></cds-dropdown-list>
		</cds-dropdown>
	`
});
export const Basic = Template.bind({});

export const Fluid = Template.bind({});
Fluid.args = {
	fluid: true
};

const MultiTemplate = (args) => ({
	props: args,
	template: `
		<cds-multi-select
			[selectionFeedback]="selectionFeedback"
			[(ngModel)]="model"
			[label]="label"
			[hideLabel]="hideLabel"
			[helperText]="helperText"
			[size]="size"
			[dropUp]="dropUp"
			[invalid]="invalid"
			[invalidText]="invalidText"
			[warn]="warn"
			[warnText]="warnText"
			[theme]="theme"
			placeholder="Select"
			[disabled]="disabled"
			[readonly]="readonly"
			[fluid]="fluid"
			[isOpen]="isOpen"
			[itemValueKey]="itemValueKey"
			(selected)="selected($event)"
			(onClose)="onClose($event)">
			<cds-dropdown-list [items]="items"></cds-dropdown-list>
		</cds-multi-select>
		<span>{{model | json}}</span>
	`
});
export const Multiselect = MultiTemplate.bind({});

const ReactiveTemplate = (args) => ({
	props: args,
	template: `
		<!--
		app-* components are for demo purposes only.
		You can create your own implementation by using the component source found at:
		https://github.com/IBM/carbon-components-angular/tree/master/src/dropdown/stories/app-reactive-forms.component.ts
		-->
		<app-reactive-forms
			[label]="label"
			[hideLabel]="hideLabel"
			[helperText]="helperText"
			[invalid]="invalid"
			[invalidText]="invalidText"
			[disabled]="disabled"
			[items]="items"
			[selectionFeedback]="selectionFeedback"
			[itemValueKey]="itemValueKey"
			(selected)="selected($event)"
			(onClose)="onClose($event)">
		</app-reactive-forms>
	`
});
export const ReactiveForms = ReactiveTemplate.bind({});

const NgTemplate = (args) => ({
	props: args,
	template: `
		<cds-dropdown
			[label]="label"
			[hideLabel]="hideLabel"
			[theme]="theme"
			placeholder="Select"
			[displayValue]="dropdownRenderer"
			[size]="size"
			[invalid]="invalid"
			[invalidText]="invalidText"
			[disabled]="disabled"
			[readonly]="readonly"
			[itemValueKey]="itemValueKey"
			(selected)="selected($event)"
			(onClose)="onClose($event)">
			<cds-dropdown-list [items]="items" [listTpl]="dropdownRenderer"></cds-dropdown-list>
		</cds-dropdown>
		<ng-template #dropdownRenderer let-item="item">
			@if (item && item.content) {
				<div style="font-size: 14px;">
					<svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg"
							width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style="will-change: transform;">
						<path d="M9.3 3.7l3.8 3.8H1v1h12.1l-3.8 3.8.7.7 5-5-5-5z"></path>
					</svg>
					&nbsp;{{item.content}}
				</div>
			}
		</ng-template>
	`
});
export const WithTemplate = NgTemplate.bind({});

const withAILabelTemplate = (args) => ({
	props: args,
	template: `
		<div style="width: 400px">
			<cds-dropdown
				[label]="label"
				[hideLabel]="hideLabel"
				[helperText]="helperText"
				[size]="size"
				[invalid]="invalid"
				[invalidText]="invalidText"
				[theme]="theme"
				placeholder="Select"
				[disabled]="disabled"
				[readonly]="readonly"
				[dropUp]="false"
				[decorator]="decoratorTpl"
				[itemValueKey]="itemValueKey"
				(selected)="selected($event)"
				(onClose)="onClose($event)">
				<cds-dropdown-list [items]="items"></cds-dropdown-list>
			</cds-dropdown>
		</div>
		<ng-template #decoratorTpl>
			<cds-ai-label
				kind="default"
				size="mini"
				[autoAlign]="true"
				aiText="AI"
				ariaLabel="Show information">
				` + AI_LABEL_INNER + `
			</cds-ai-label>
		</ng-template>
	`
});
export const withAILabel = withAILabelTemplate.bind({});
withAILabel.args = {
	invalid: false,
	invalidText: "Error message goes here",
	warn: false,
	warnText: "Warning message goes here"
};

const multiselectWithAILabelTemplate = (args) => ({
	props: args,
	template: `
		<div style="width: 400px">
			<cds-multi-select
				[selectionFeedback]="selectionFeedback"
				[(ngModel)]="model"
				[label]="label"
				[hideLabel]="hideLabel"
				[helperText]="helperText"
				[size]="size"
				[dropUp]="dropUp"
				[invalid]="invalid"
				[invalidText]="invalidText"
				[warn]="warn"
				[warnText]="warnText"
				[theme]="theme"
				placeholder="Select"
				[disabled]="disabled"
				[readonly]="readonly"
				[dropUp]="false"
				[fluid]="fluid"
				[decorator]="decoratorTpl"
				[itemValueKey]="itemValueKey"
				(selected)="selected($event)"
				(onClose)="onClose($event)">
				<cds-dropdown-list [items]="items"></cds-dropdown-list>
			</cds-multi-select>
		</div>
		<ng-template #decoratorTpl>
			<cds-ai-label
				kind="default"
				size="mini"
				[autoAlign]="true"
				aiText="AI"
				ariaLabel="Show information">
				` + AI_LABEL_INNER + `
			</cds-ai-label>
		</ng-template>
	`
});
export const multiselectWithAILabel = multiselectWithAILabelTemplate.bind({});

const ChildOptionsTemplate = (args) => ({
	props: { fruit: "pear", colors: ["blue"], ...args },
	template: `
		<!-- Options written as children, like the web component. The model is the option's value. -->
		<div style="width: 300px">
			<cds-dropdown [label]="label" [helperText]="helperText" [(ngModel)]="fruit">
				<cds-dropdown-item value="apple">Apple</cds-dropdown-item>
				<cds-dropdown-item value="pear">Pear</cds-dropdown-item>
				<cds-dropdown-item value="plum" [disabled]="true">Plum</cds-dropdown-item>
			</cds-dropdown>
			<p>Selected: {{ fruit }}</p>
			<br />
			<cds-multi-select [label]="label" [(ngModel)]="colors">
				<cds-multi-select-item value="red">Red</cds-multi-select-item>
				<cds-multi-select-item value="green">Green</cds-multi-select-item>
				<cds-multi-select-item value="blue">Blue</cds-multi-select-item>
			</cds-multi-select>
			<p>Selected: {{ colors | json }}</p>
		</div>
	`
});
export const ChildOptions = ChildOptionsTemplate.bind({});
