import { CdsButton } from "../button";
import { moduleMetadata, Meta } from "@storybook/angular";
import { PopoverContainer, PopoverContent } from "./";

export default {
	title: "Components/Popover",
	decorators: [
		moduleMetadata({
			imports: [
				CdsButton,
				PopoverContainer,
				PopoverContent
			]
		})
	],
	args: {
		isOpen: true,
		caret: true,
		dropShadow: true,
		highContrast: false,
		align: "bottom",
		autoAlign: false
	},
	argTypes: {
		autoAlign: {
			control: false
		},
		onOpen: {
			action: "onOpen"
		},
		onClose: {
			action: "onClose"
		},
		isOpenChange: {
			action: "isOpenChange"
		},
		align: {
			options: [
				"top",
				"top-left",
				"top-right",
				"bottom",
				"bottom-left",
				"bottom-right",
				"left",
				"left-bottom",
				"left-top",
				"right",
				"right-bottom",
				"right-top"
			],
			control: "select"
		}
	},
	component: PopoverContainer,
	subcomponents: { PopoverContent }
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<cds-popover
			[isOpen]="isOpen"
			[dropShadow]="dropShadow"
			[align]="align"
			[caret]="caret"
			[highContrast]="highContrast"
			(onOpen)="onOpen($event)"
			(onClose)="onClose($event)"
			(isOpenChange)="isOpenChange($event)">
			<cds-button kind="tertiary" size="sm">Trigger</cds-button>
			<cds-popover-content>
				<div style="padding: 1rem">
					<p><strong>Available storage</strong></p>
					<p>This server has 150GB of block storage remaining</p>
				</div>
			</cds-popover-content>
		</cds-popover>
	`
});
export const Basic = Template.bind({});
Basic.parameters = {
	docs: {
		story: {
			inline: false,
			height: "15rem"
		}
	},
	layout: "centered"
};

const AutoAlignTemplate = (args) => ({
	props: args,
	template: `
		<div style="height:3000px">
			Scrolling will update the position of the popover:
			<div style="position: absolute; top: 500px; left: 500px;">
				<cds-popover
					[isOpen]="isOpen"
					[dropShadow]="dropShadow"
					[align]="align"
					[caret]="caret"
					[highContrast]="highContrast"
					[autoAlign]="autoAlign"
					(onOpen)="onOpen($event)"
					(onClose)="onClose($event)"
					(isOpenChange)="isOpenChange($event)">
					<cds-button kind="tertiary" size="sm">Trigger</cds-button>
					<cds-popover-content>
						<div style="padding: 1rem">
							<p><strong>Available storage</strong></p>
							<p>This server has 150GB of block storage remaining</p>
						</div>
					</cds-popover-content>
				</cds-popover>
			</div>
		</div>
	`
});
export const WithAutoAlign = AutoAlignTemplate.bind({});
WithAutoAlign.args = {
	autoAlign: true,
	align: "top"
};
