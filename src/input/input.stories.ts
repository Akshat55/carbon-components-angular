import { moduleMetadata, Meta } from "@storybook/angular";
import { FormsModule } from "@angular/forms";
import { CdsTextInput, TextInputSkeleton } from "./";
import { AILabelModule } from "../ai-label";
import { ButtonModule } from "../button";
import { IconModule } from "../icon";
import { AI_LABEL_INNER } from "../storybook/ai-label-story-shared";

export default {
	title: "Components/Input",
	decorators: [
		moduleMetadata({
			imports: [
				CdsTextInput,
				TextInputSkeleton,
				AILabelModule,
				ButtonModule,
				IconModule,
				FormsModule
			]
		})
	],
	args: {
		disabled: false,
		invalid: false,
		invalidText: "Invalid entry",
		warn: false,
		warnText: "This is a warning!",
		label: "Text input label",
		helperText: "Optional helper text",
		placeholder: "Placeholder",
		autocomplete: "on",
		size: "md",
		readonly: false,
		fluid: false,
		inline: false,
		hideLabel: false,
		enableCounter: false,
		maxCount: 500
	},
	argTypes: {
		autocomplete: {
			options: ["on", "off"],
			control: "radio"
		},
		size: {
			options: ["sm", "md", "lg"],
			control: "select"
		}
	},
	component: CdsTextInput
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<cds-text-input
			[label]="label"
			[helperText]="helperText"
			[placeholder]="placeholder"
			[autocomplete]="autocomplete"
			[size]="size"
			[disabled]="disabled"
			[readonly]="readonly"
			[invalid]="invalid"
			[invalidText]="invalidText"
			[warn]="warn"
			[warnText]="warnText"
			[fluid]="fluid"
			[inline]="inline"
			[hideLabel]="hideLabel"
			[enableCounter]="enableCounter"
			[maxCount]="maxCount"
			[(ngModel)]="value" />
	`
});
export const Basic = Template.bind({});

export const Fluid = Template.bind({});
Fluid.args = {
	fluid: true
};

const SkeletonTemplate = (args) => ({
	props: args,
	template: `<cds-text-input-skeleton [hideLabel]="hideLabel" [size]="size" />`
});
export const Skeleton = SkeletonTemplate.bind({});

export const withAILabel = () => ({
	template: `
		<cds-text-input label="Text input with decorator" placeholder="Placeholder" [decorator]="decoratorTpl" />
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
