import { CdsButton } from "../button";
import { moduleMetadata, Meta } from "@storybook/angular";
import { Tooltip } from "./";

export default {
	title: "Components/Tooltip",
	decorators: [
		moduleMetadata({
			imports: [CdsButton, Tooltip]
		})
	],
	args: {
		isOpen: true,
		caret: true,
		description: "Occassionally, services are updated in a specified time window to ensure no down time for customers.",
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
				"top-start",
				"top-end",
				"right",
				"right-start",
				"right-end",
				"bottom",
				"bottom-start",
				"bottom-end",
				"left",
				"left-start",
				"left-end"
			],
			control: "select"
		}
	},
	component: Tooltip
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<cds-tooltip
			[isOpen]="isOpen"
			[caret]="caret"
			[align]="align"
			(onOpen)="onOpen($event)"
			(onClose)="onClose($event)"
			(isOpenChange)="isOpenChange($event)"
			[description]="description">
			<cds-button kind="tertiary" size="sm">Trigger</cds-button>
		</cds-tooltip>
	`
});
export const Basic = Template.bind({});
Basic.parameters = {
	docs: {
		story: {
			inline: false,
			iframeHeight: "18rem"
		}
	},
	layout: "centered"
};

const EllipsesTemplate = (args) => ({
	props: args,
	template: `
		<cds-tooltip
			[isOpen]="isOpen"
			[caret]="caret"
			[align]="align"
			description="Tooltip for ellipsis because I can and I am really really long">
			<span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100px; display: inline-block">
				Tooltip for ellipsis because I can and I am really really long
			</span>
		</cds-tooltip>
	`
});
export const Ellipses = EllipsesTemplate.bind({});
Ellipses.argTypes = {
	description: {
		control: false
	}
};
Ellipses.parameters = {
	docs: {
		story: {
			inline: false,
			iframeHeight: "18rem"
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
				<cds-tooltip
					[isOpen]="isOpen"
					[caret]="caret"
					[align]="align"
					[autoAlign]="true"
					(onOpen)="onOpen($event)"
					(onClose)="onClose($event)"
					(isOpenChange)="isOpenChange($event)"
					[description]="description">
					<cds-button kind="tertiary" size="sm">Trigger</cds-button>
				</cds-tooltip>
			</div>
		</div>
	`
});
export const WithAutoAlign = AutoAlignTemplate.bind({});
WithAutoAlign.args = {
	autoAlign: true,
	align: "top"
};
