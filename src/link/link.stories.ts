/**
 * Storybook stories for the Angular link directive layer.
 * Templates are identical to the old carbon-components-angular stories —
 * the directive maps the old @Input API onto the <cds-link> web component.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";
import { LinkModule } from "./index";

export default {
	title: "Components/Link",
	decorators: [
		moduleMetadata({
			imports: [LinkModule, CommonModule]
		})
	],
	argTypes: {
		size: { control: "radio", options: ["sm", "md", "lg"] },
		inline: { control: "boolean" },
		visited: { control: "boolean" },
		disabled: { control: "boolean" },
		href: { control: "text" }
	},
	args: {
		size: "md",
		inline: false,
		visited: false,
		disabled: false,
		href: "#"
	}
} as Meta;

export const Basic = (args) => ({
	props: args,
	template: `
		<cds-link
			[href]="href"
			[size]="size"
			[inline]="inline"
			[visited]="visited"
			[disabled]="disabled">
			Link
		</cds-link>
	`
});

export const Inline = (args) => ({
	props: args,
	template: `
		Some text
		<cds-link [href]="href" [inline]="true">an inline link</cds-link>
		inside a sentence.
	`
});

export const PairedWithIcon = (args) => ({
	props: args,
	template: `
		<cds-link [href]="href" [size]="size" [disabled]="disabled">
			Link with icon
			<svg cdsLinkIcon width="16" height="16" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
				<path d="M17 15L17 8 15 8 15 15 8 15 8 17 15 17 15 24 17 24 17 17 24 17 24 15z"></path>
			</svg>
		</cds-link>
	`
});
PairedWithIcon.storyName = "Paired with Icon";
