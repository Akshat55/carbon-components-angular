import { moduleMetadata, Meta } from "@storybook/angular";
import { ContentSwitcher, ContentSwitcherOption } from "./";

export default {
	title: "Components/Content Switcher",
	decorators: [
		moduleMetadata({
			imports: [
				ContentSwitcher,
				ContentSwitcherOption
			]
		})
	],
	component: ContentSwitcher,
	subcomponents: {ContentSwitcherOption}
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<cds-content-switcher
			[lowContrast]="lowContrast"
			[selectionMode]="selectionMode"
			[selectedIndex]="selectedIndex"
			(selected)="selected($event)">
			<cds-content-switcher-item name="First">First section</cds-content-switcher-item>
			<cds-content-switcher-item name="Second">Second section</cds-content-switcher-item>
			<cds-content-switcher-item name="Third">Third section</cds-content-switcher-item>
		</cds-content-switcher>
	`
});
export const Basic = Template.bind({});
Basic.args = {
	lowContrast: false,
	selectionMode: "automatic",
	selectedIndex: 0
};
Basic.argTypes = {
	selected: { action: "selected" }
};
