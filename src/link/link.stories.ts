import { moduleMetadata, Meta } from "@storybook/angular";
import { CdsLink } from "./";

import { IconDirective } from "../icon";

export default {
	title: "Components/Link",
	decorators: [
		moduleMetadata({
			imports: [CdsLink, IconDirective]
		})
	],
	component: CdsLink
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<cds-link
			href="#"
			[size]="size"
			[disabled]="disabled"
			[visited]="visited"
			[inline]="inline">
			link
		</cds-link>
	`
});
export const Basic = Template.bind({});
Basic.args = {
	disabled: false,
	inline: false,
	size: "md"
};

const IconTemplate = (args) => ({
	props: args,
	template: `
		<cds-link
			href="#"
			[disabled]="disabled"
			[size]="size"
			[inline]="inline"
			[visited]="visited">
			Link
			<svg cdsLinkIcon cdsIcon="close" size="16"></svg>
		</cds-link>
	`
});
export const WithIcon = IconTemplate.bind({});
WithIcon.args = {
	disabled: false,
	inline: false,
	size: "md"
};
