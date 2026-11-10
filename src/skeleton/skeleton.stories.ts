/**
 * Storybook stories for the Angular skeleton directive layer.
 * The directives map onto the skeleton web components.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { SkeletonModule } from "./index";

export default {
	title: "Components/Skeleton",
	decorators: [
		moduleMetadata({
			imports: [SkeletonModule]
		})
	],
	argTypes: {
		lines: { control: "number" },
		heading: { control: "boolean" }
	},
	args: {
		lines: 5,
		heading: false
	}
} as Meta;

export const Text = (args) => ({
	props: args,
	template: `
		<div style="width: 300px">
			<cds-skeleton-text [lines]="lines" [heading]="heading"></cds-skeleton-text>
		</div>
	`
});

export const Placeholder = () => ({
	template: `<cds-skeleton-placeholder style="width: 100px; height: 100px"></cds-skeleton-placeholder>`
});
Placeholder.parameters = { controls: { disable: true } };

export const Icon = () => ({
	template: `<cds-skeleton-icon style="width: 24px; height: 24px"></cds-skeleton-icon>`
});
Icon.parameters = { controls: { disable: true } };
