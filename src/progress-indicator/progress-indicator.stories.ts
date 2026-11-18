import { moduleMetadata, Meta } from "@storybook/angular";
import { ProgressIndicator, ProgressIndicatorSkeleton, ProgressStep, ProgressStepSkeleton } from "./";

export default {
	title: "Components/Progress Indicator",
	decorators: [
		moduleMetadata({
			imports: [ProgressIndicator, ProgressStep, ProgressIndicatorSkeleton, ProgressStepSkeleton]
		})
	],
	component: ProgressIndicator
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<cds-progress-indicator
			[steps]="steps"
			[orientation]="orientation"
			[current]="current"
			(stepSelected)="stepSelected($event)"
			[spacing]="spacing">
		</cds-progress-indicator>
	`
});
export const Basic = Template.bind({});
Basic.args = {
	current: 1,
	steps: [
		{
			label: "First step",
			complete: true,
			secondaryLabel: "optional text",
			onClick: () => {
				alert("First step clicked!");
			}
		},
		{
			label: "Second step",
			complete: false,
			current: true
		},
		{
			label: "Third step",
			complete: false
		},
		{
			label: "Fourth step",
			complete: false,
			invalid: true
		},
		{
			label: "Fifth step",
			complete: false,
			disabled: true
		}
	],
	align: "default",
	orientation: "horizontal"
};
Basic.argTypes = {
	steps: {
		control: false
	},
	StepSelected: {
		control: "Step selected!"
	},
	align: {
		options: ["default", "equal"],
		control: "radio"
	},
	orientation: {
		options: ["horizontal", "vertical"],
		control: "radio"
	}
};

const ChildStepsTemplate = (args) => ({
	props: { current: 1, ...args },
	template: `
		<!-- Steps written as children, like the web component -->
		<cds-progress-indicator [current]="current" (stepSelected)="current = $event.index">
			<cds-progress-step label="First step" secondaryLabel="Optional label" description="Step 1: Getting started" />
			<cds-progress-step label="Second step" description="Step 2: Getting started" />
			<cds-progress-step label="Third step" description="Step 3: Getting started" invalid />
			<cds-progress-step label="Fourth step" description="Step 4: Getting started" [disabled]="true" />
		</cds-progress-indicator>
	`
});
export const ChildSteps = ChildStepsTemplate.bind({});

const SkeletonTemplate = () => ({
	template: `
		<cds-progress-indicator-skeleton>
			<cds-progress-step-skeleton />
			<cds-progress-step-skeleton />
			<cds-progress-step-skeleton />
		</cds-progress-indicator-skeleton>
	`
});
export const Skeleton = SkeletonTemplate.bind({});
