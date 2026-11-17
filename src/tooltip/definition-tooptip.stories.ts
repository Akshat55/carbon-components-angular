import { moduleMetadata, Meta } from "@storybook/angular";
import { TooltipDefinition } from "./";

export default {
	title: "Components/Definition Tooltip",
	decorators: [
		moduleMetadata({
			imports: [TooltipDefinition]
		})
	],
	parameters: {
		docs: {
			story: {
				inline: false,
				iframeHeight: "18rem"
			}
		}
	},
	args: {
		isOpen: true,
		description: "Uniform Resource Locator; the address of a resource (such as a document or website) on the Internet.",
		align: "bottom",
		autoAlign: false,
		openOnHover: true
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
				"bottom-right"
			],
			control: "select"
		}
	},
	component: TooltipDefinition
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<div style="height:3000px">
			Scrolling will update the position of the popover:
			<div style="position: absolute; top: 500px; left: 500px;">
				<p>Custom domains direct requests for your apps in this Cloud Foundry organization to a
				<cds-definition-tooltip
					[isOpen]="isOpen"
					[openOnHover]="openOnHover"
					[align]="align"
					(onOpen)="onOpen($event)"
					(onClose)="onClose($event)"
					(isOpenChange)="isOpenChange($event)"
					[description]="description">
					URL
				</cds-definition-tooltip>
				that you own. A custom domain can be a shared domain, a shared subdomain, or a shared domain and host.</p>
			</div>
		</div>
	`
});
export const Basic = Template.bind({});

const AutoAlignTemplate = (args) => ({
	props: args,
	template: `
		<div style="height:3000px">
			Scrolling will update the position of the popover:
			<div style="position: absolute; top: 500px; left: 500px;">
				<p>Custom domains direct requests for your apps in this Cloud Foundry organization to a
				<cds-definition-tooltip
					[isOpen]="isOpen"
					[openOnHover]="openOnHover"
					[align]="align"
					[autoAlign]="true"
					(onOpen)="onOpen($event)"
					(onClose)="onClose($event)"
					(isOpenChange)="isOpenChange($event)"
					[description]="description">
					URL
				</cds-definition-tooltip>
				that you own. A custom domain can be a shared domain, a shared subdomain, or a shared domain and host.</p>
			</div>
		</div>
	`
});
export const WithAutoAlign = AutoAlignTemplate.bind({});
WithAutoAlign.args = {
	autoAlign: true,
	align: "top"
};
