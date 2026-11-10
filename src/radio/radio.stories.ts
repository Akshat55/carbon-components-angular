import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { moduleMetadata, Meta } from "@storybook/angular";
import { RadioGroup, Radio, RadioSkeleton } from "./";

import { ReactiveFormsStory } from "./stories";
import { AILabelModule } from "../ai-label";
import { ButtonModule } from "../button";
import { IconModule } from "../icon";
import { AI_LABEL_INNER, AI_LABEL_STORY_STYLES } from "../storybook/ai-label-story-shared";

export default {
	title: "Components/Radio",
	decorators: [
		moduleMetadata({
			imports: [
				FormsModule,
				ReactiveFormsModule,
				Radio,
				RadioSkeleton,
				RadioGroup,
				AILabelModule,
				ButtonModule,
				IconModule,
				ReactiveFormsStory
			]
		})
	],
	component: RadioGroup,
	subcomponents: Radio
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<cds-radio-button-group
			[legend]="label"
			[disabled]="disabled"
			[helperText]="helperText"
			[invalid]="invalid"
			[invalidText]="invalidText"
			[warn]="warn"
			[warnText]="warnText"
			ariaLabel="radiogroup"
			[orientation]="orientation"
			[labelPlacement]="labelPlacement"
			(change)="onChange($event)">
			<cds-radio-button value="Zero" [checked]="true">
				Zero
			</cds-radio-button>
			<cds-radio-button [value]="One">One</cds-radio-button>
			<cds-radio-button [value]="Two">Two</cds-radio-button>
			<cds-radio-button [value]="Three">Three</cds-radio-button>
			<cds-radio-button [value]="Four" [disabled]="true">Four</cds-radio-button>
		</cds-radio-button-group>
	`
});
export const Basic = Template.bind({});
Basic.args = {
	label: "Radio button heading",
	helperText: "Helper text message goes here and can wrap lines",
	invalid: false,
	invalidText: "Error message goes here and can wrap lines",
	warn: false,
	warnText: "Warning message goes here and can wrap lines",
	orientation: "horizontal",
	labelPlacement: "right"
};
Basic.argTypes = {
	onChange: {
		control: "Changed!"
	},
	orientation: {
		options: ["horizontal", "vertical"],
		control: "radio"
	},
	labelPlacement: {
		options: ["left", "right"],
		control: "radio"
	}
};

const SkeletonTemplate = (args) => ({
	props: args,
	template: `
		<cds-radio-button-skeleton />
	`
});
export const Skeleton = SkeletonTemplate.bind({});

const ReactiveFormsTemplate = (args) => ({
	props: args,
	template: `
		<!--
		app-* components are for demo purposes only.
		You can create your own implementation by using the component source found at:
		https://github.com/IBM/carbon-components-angular/tree/master/src/radio/stories/app-reactive-form.component.ts
		-->
		<app-reactive-forms></app-reactive-forms>
	`
});
export const ReactiveForms = ReactiveFormsTemplate.bind({});
ReactiveForms.parameters = {
	controls: {
		disable: true
	}
};

const withAILabelTemplate = (args) => ({
	props: args,
	styles: AI_LABEL_STORY_STYLES,
	template: `
		<div class="ai-label-check-radio-container">
			<cds-radio-button-group
				legend="Group label"
				orientation="vertical"
				[decorator]="aiLabelDefaultTpl"
				ariaLabel="radiogroup"
				[invalid]="invalid"
				[invalidText]="invalidText"
				[warn]="warn"
				[warnText]="warnText">
				<cds-radio-button value="radio-1" id="radio-1" [checked]="true">Radio button label</cds-radio-button>
				<cds-radio-button value="radio-2" id="radio-2">Radio button label</cds-radio-button>
				<cds-radio-button value="radio-3" id="radio-3">Radio button label</cds-radio-button>
			</cds-radio-button-group>

			<cds-radio-button-group
				legend="Group label"
				orientation="vertical"
				ariaLabel="radiogroup"
				[invalid]="invalid"
				[invalidText]="invalidText"
				[warn]="warn"
				[warnText]="warnText">
				<cds-radio-button value="radio-4" id="radio-4" [checked]="true" [decorator]="aiLabelDefaultTpl">Radio button label</cds-radio-button>
				<cds-radio-button value="radio-5" id="radio-5" [decorator]="aiLabelDefaultTpl">Radio button label</cds-radio-button>
				<cds-radio-button value="radio-6" id="radio-6">Radio button label</cds-radio-button>
			</cds-radio-button-group>

			<cds-radio-button-group
				legend="Group label"
				orientation="vertical"
				ariaLabel="radiogroup"
				[invalid]="invalid"
				[invalidText]="invalidText"
				[warn]="warn"
				[warnText]="warnText">
				<cds-radio-button value="radio-7" id="radio-7" [checked]="true" [decorator]="aiLabelInlineTpl">Radio button label</cds-radio-button>
				<cds-radio-button value="radio-8" id="radio-8" [decorator]="aiLabelInlineTpl">Radio button label</cds-radio-button>
				<cds-radio-button value="radio-9" id="radio-9">Radio button label</cds-radio-button>
			</cds-radio-button-group>
		</div>

		<ng-template #aiLabelDefaultTpl>
			<cds-ai-label
				class="ai-label-container"
				kind="default"
				size="md"
				[autoAlign]="true"
				aiText="AI"
				ariaLabel="Show information">
				` + AI_LABEL_INNER + `
			</cds-ai-label>
		</ng-template>
		<ng-template #aiLabelInlineTpl>
			<cds-ai-label
				class="ai-label-container"
				kind="inline"
				size="md"
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
	invalidText: "Invalid message goes here",
	warn: false,
	warnText: "Warning message goes here"
};
