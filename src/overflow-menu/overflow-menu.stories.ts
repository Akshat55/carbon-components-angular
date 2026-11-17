import { moduleMetadata, Meta } from "@storybook/angular";
import { OverflowMenu, OverflowMenuBody, OverflowMenuOption } from "./";
import { IconDirective } from "../icon";

export default {
	title: "Components/Overflow Menu",
	decorators: [
		moduleMetadata({
			imports: [
				OverflowMenu,
				OverflowMenuBody,
				OverflowMenuOption,
				IconDirective
			]
		})
	],
	args: {
		placement: "bottom"
	},
	subcomponents: {
		OverflowMenuBody,
		OverflowMenuOption
	},
	argTypes: {
		code: {
			control: false
		}
	},
	docs: {
		story: {
			inline: false,
			height: "30rem"
		}
	},
	layout: "centered",
	component: OverflowMenu
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<cds-overflow-menu
			[open]="open"
			[flip]="flip">
			<cds-overflow-menu-body [flipped]="flip" [direction]="placement">
				<cds-overflow-menu-item (selected)="selected($event)" (click)="click($event)">
					An example option that is really long to show what should be done to handle long text
				</cds-overflow-menu-item>
				<cds-overflow-menu-item (selected)="selected($event)">Option 2</cds-overflow-menu-item>
				<cds-overflow-menu-item (selected)="selected($event)">Option 3</cds-overflow-menu-item>
				<cds-overflow-menu-item (selected)="selected($event)">Option 4</cds-overflow-menu-item>
				<cds-overflow-menu-item disabled="true" (selected)="selected($event)" [divider]="true">Disabled</cds-overflow-menu-item>
				<cds-overflow-menu-item type="danger" (selected)="selected($event)">Danger option</cds-overflow-menu-item>
			</cds-overflow-menu-body>
		</cds-overflow-menu>
	`
});
export const Basic = Template.bind({});
Basic.args = {
	show: true,
	open: false,
	flip: false
};
Basic.argTypes = {
	click: {
		type: "function",
		// eslint-disable-next-line no-console
		defaultValue: () => { console.log("clicked!"); },
		control: false
	},
	selected: {
		type: "function",
		// eslint-disable-next-line no-console
		defaultValue: () => { console.log("selected!"); },
		control: false
	}
};
Basic.parameters = {
	layout: "centered"
};

const LinkTemplate = (args) => ({
	props: args,
	template: `
		<div>
			<h1 style="margin-bottom: 1rem">Bottom placement</h1>
			<cds-overflow-menu
				[flip]="flip">
				<cds-overflow-menu-body [flipped]="flip" [direction]="placement">
					<cds-overflow-menu-item href="https://www.ibm.com" (selected)="selected($event)" (click)="click($event)">
						An example option that is really long to show what should be done to handle long text
					</cds-overflow-menu-item>
					<cds-overflow-menu-item
						href="https://www.ibm.com"
						target="_blank"
						(selected)="selected($event)">
						Option 2
					</cds-overflow-menu-item>
					<cds-overflow-menu-item href="https://www.ibm.com" (selected)="selected($event)">Option 3</cds-overflow-menu-item>
					<cds-overflow-menu-item href="https://www.ibm.com" (selected)="selected($event)">Option 4</cds-overflow-menu-item>
					<cds-overflow-menu-item
						href="https://www.ibm.com"
						disabled="true"
						(selected)="selected($event)">
						Disabled
					</cds-overflow-menu-item>
					<cds-overflow-menu-item href="https://www.ibm.com" type="danger" (selected)="selected($event)">
						Danger option
					</cds-overflow-menu-item>
				</cds-overflow-menu-body>
			</cds-overflow-menu>
		</div>
	`
});
export const WithLink = LinkTemplate.bind({});
WithLink.args = {
	flip: false
};
WithLink.argTypes = {
	click: {
		type: "function",
		// eslint-disable-next-line no-console
		defaultValue: () => { console.log("clicked!"); },
		control: false
	},
	selected: {
		type: "function",
		// eslint-disable-next-line no-console
		defaultValue: () => { console.log("selected!"); },
		control: false
	}
};

const CustomTriggerTemplate = (args) => ({
	props: args,
	template: `
		<span>Overflow menu with custom trigger icon</span>
		<cds-overflow-menu
			[flip]="flip"
			[open]="open"
			[customTrigger]="customTrigger">
			<cds-overflow-menu-body [flipped]="flip">
				<cds-overflow-menu-item (selected)="selected($event)" (click)="click($event)">Option 1</cds-overflow-menu-item>
				<cds-overflow-menu-item (selected)="selected($event)">Option 2</cds-overflow-menu-item>
				<cds-overflow-menu-item disabled="true" (selected)="selected($event)">Disabled</cds-overflow-menu-item>
				<cds-overflow-menu-item type="danger" (selected)="selected($event)">Danger option</cds-overflow-menu-item>
			</cds-overflow-menu-body>
		</cds-overflow-menu>
		<ng-template #customTrigger><svg cdsIcon="document" size="16"></svg></ng-template>
	`
});
export const CustomTrigger = CustomTriggerTemplate.bind({});
CustomTrigger.storyName = "With custom trigger";
