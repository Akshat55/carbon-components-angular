import { moduleMetadata, Meta } from "@storybook/angular";
import { CdsLink } from "../link";
import { CdsButton } from "../button";
import {
	Toggletip,
	ToggletipAction,
	ToggletipContent
} from "./";

export default {
	title: "Components/Toggletip",
	decorators: [
		moduleMetadata({
			imports: [
				Toggletip,
				ToggletipAction,
				ToggletipContent,
				CdsLink,
				CdsButton
			]
		})
	],
	args: {
		isOpen: true,
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
				"bottom",
				"left",
				"right"
			],
			control: "select"
		}
	},
	component: Toggletip,
	subcomponents: {
		ToggletipAction,
		ToggletipContent
	}
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<cds-toggletip
			[isOpen]="isOpen"
			[align]="align"
			(isOpenChange)="isOpenChange($event)"
			(onClose)="onClose($event)"
			(onOpen)="onOpen($event)">
			Toggletip label
			<p cdsToggletipContent>
				Lorem ipsum dolor sit amet, di os consectetur adipiscing elit, sed
				do eiusmod tempor incididunt ut fsil labore et dolore magna aliqua.
			</p>
			<div cdsToggletipAction>
				<cds-link href="#">Link action</cds-link>
				<cds-button size="sm">Some button</cds-button>
			</div>
		</cds-toggletip>
	`
});
export const Basic = Template.bind({});
Basic.parameters = {
	docs: {
		story: {
			inline: false,
			height: "30rem"
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
				<cds-toggletip
					[isOpen]="isOpen"
					[align]="align"
					[autoAlign]="true"
					(isOpenChange)="isOpenChange($event)"
					(onClose)="onClose($event)"
					(onOpen)="onOpen($event)">
					Toggletip label
					<p cdsToggletipContent>
						Lorem ipsum dolor sit amet, di os consectetur adipiscing elit, sed
						do eiusmod tempor incididunt ut fsil labore et dolore magna aliqua.
					</p>
					<div cdsToggletipAction>
						<cds-link href="#">Link action</cds-link>
						<cds-button size="sm">Some button</cds-button>
					</div>
				</cds-toggletip>
			</div>
		</div>
	`
});
export const WithAutoAlign = AutoAlignTemplate.bind({});
WithAutoAlign.args = {
	autoAlign: true,
	align: "top"
};
