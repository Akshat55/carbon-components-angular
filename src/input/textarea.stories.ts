import { moduleMetadata, Meta } from "@storybook/angular";
import { FormsModule } from "@angular/forms";
import { CdsTextarea, TextareaSkeleton } from "./";
import { AILabelModule } from "../ai-label";
import { ButtonModule } from "../button";
import { IconModule } from "../icon";
import { AI_LABEL_INNER } from "../storybook/ai-label-story-shared";

export default {
	title: "Components/Input/Text area",
	decorators: [
		moduleMetadata({
			imports: [
				CdsTextarea,
				TextareaSkeleton,
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
		cols: 50,
		rows: 4,
		readonly: false,
		fluid: false,
		enableCounter: true,
		maxCount: 500,
		counterMode: "character"
	},
	argTypes: {
		counterMode: {
			options: ["word", "character"],
			control: "radio"
		}
	},
	component: CdsTextarea
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<cds-textarea
			[label]="label"
			[helperText]="helperText"
			[placeholder]="placeholder"
			[rows]="rows"
			[cols]="cols"
			[disabled]="disabled"
			[readonly]="readonly"
			[invalid]="invalid"
			[invalidText]="invalidText"
			[warn]="warn"
			[warnText]="warnText"
			[fluid]="fluid"
			[enableCounter]="enableCounter"
			[maxCount]="maxCount"
			[counterMode]="counterMode"
			[(ngModel)]="value" />
	`
});
export const Basic = Template.bind({});

export const Fluid = Template.bind({});
Fluid.args = {
	fluid: true
};

const SkeletonTemplate = () => ({
	template: `<cds-textarea-skeleton />`
});
export const Skeleton = SkeletonTemplate.bind({});

export const withAILabel = () => ({
	template: `
		<cds-textarea label="Text area with decorator" placeholder="Placeholder" [decorator]="decoratorTpl" />
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
