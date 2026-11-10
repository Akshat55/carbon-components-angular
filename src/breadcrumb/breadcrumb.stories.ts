/**
 * Storybook stories for the Angular breadcrumb directive layer.
 * The directives map the old @Input API onto the breadcrumb web components.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { BreadcrumbModule } from "./index";

export default {
	title: "Components/Breadcrumb",
	decorators: [
		moduleMetadata({
			imports: [BreadcrumbModule]
		})
	],
	argTypes: {
		noTrailingSlash: { control: "boolean" }
	},
	args: {
		noTrailingSlash: false
	}
} as Meta;

export const Basic = (args) => ({
	props: args,
	template: `
		<cds-breadcrumb [noTrailingSlash]="noTrailingSlash">
			<cds-breadcrumb-item href="#first">Breadcrumb 1</cds-breadcrumb-item>
			<cds-breadcrumb-item href="#second">Breadcrumb 2</cds-breadcrumb-item>
			<cds-breadcrumb-item href="#third" [current]="true">Breadcrumb 3</cds-breadcrumb-item>
		</cds-breadcrumb>
	`
});

export const FromItemsArray = (args) => ({
	props: {
		...args,
		items: [
			{ content: "Breadcrumb 1", href: "#1" },
			{ content: "Breadcrumb 2", href: "#2" },
			{ content: "Breadcrumb 3", href: "#3", current: true }
		]
	},
	template: `
		<cds-breadcrumb [items]="items" [noTrailingSlash]="noTrailingSlash"></cds-breadcrumb>
	`
});
FromItemsArray.storyName = "From Items Array";

export const Skeleton = () => ({
	template: `<cds-breadcrumb-skeleton></cds-breadcrumb-skeleton>`
});
Skeleton.parameters = { controls: { disable: true } };
