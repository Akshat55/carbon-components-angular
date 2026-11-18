import { moduleMetadata, Meta } from "@storybook/angular";
import { ThemeDirective } from "./";
import { CdsLayer } from "../layer";

export default {
	title: "Components/Theme",
	decorators: [
		moduleMetadata({
			imports: [ThemeDirective, CdsLayer]
		})
	],
	component: ThemeDirective
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<div cdsTheme>
			<div class="theme-section">
				<p>White theme</p>
			</div>
		</div>
		<div cdsTheme="g10">
			<div class="theme-section">
				<p>G10 theme</p>
			</div>
		</div>
		<div cdsTheme="g90">
			<div class="theme-section">
				<p>G90 theme</p>
			</div>
		</div>
		<div cdsTheme="g100">
			<div class="theme-section">
				<p>G100 theme</p>
			</div>
		</div>
	`,
	styles: [`
		.theme-section {
			padding: 1rem;
			background: var(--cds-background);
			color: var(--cds-text-primary);
		}
	`]
});
export const Basic = Template.bind({});

const LayeredTemplate = (args) => ({
	props: args,
	template: `
		<div cdsTheme>
			<article class="theme-layer-example">
				<header class="theme-layer-header">White theme</header>
				<div class="theme-with-layer">Layer one</div>
				<!-- The theme is the first layer; cds-layer starts at level 0, so set the next one. -->
				<cds-layer [level]="1">
					<div class="theme-with-layer">Layer two</div>
					<cds-layer>
						<div class="theme-with-layer">Layer three</div>
					</cds-layer>
				</cds-layer>
			</article>
		</div>
		<div cdsTheme="g10">
			<article class="theme-layer-example">
				<header class="theme-layer-header">G10 theme</header>
				<div class="theme-with-layer">Layer one</div>
				<!-- The theme is the first layer; cds-layer starts at level 0, so set the next one. -->
				<cds-layer [level]="1">
					<div class="theme-with-layer">Layer two</div>
					<cds-layer>
						<div class="theme-with-layer">Layer three</div>
					</cds-layer>
				</cds-layer>
			</article>
		</div>
		<div cdsTheme="g90">
			<article class="theme-layer-example">
				<header class="theme-layer-header">G90 theme</header>
				<div class="theme-with-layer">Layer one</div>
				<!-- The theme is the first layer; cds-layer starts at level 0, so set the next one. -->
				<cds-layer [level]="1">
					<div class="theme-with-layer">Layer two</div>
					<cds-layer>
						<div class="theme-with-layer">Layer three</div>
					</cds-layer>
				</cds-layer>
			</article>
		</div>
		<div cdsTheme="g100">
			<article class="theme-layer-example">
				<header class="theme-layer-header">G100 theme</header>
				<div class="theme-with-layer">Layer one</div>
				<!-- The theme is the first layer; cds-layer starts at level 0, so set the next one. -->
				<cds-layer [level]="1">
					<div class="theme-with-layer">Layer two</div>
					<cds-layer>
						<div class="theme-with-layer">Layer three</div>
					</cds-layer>
				</cds-layer>
			</article>
		</div>
	`,
	styles: [`
		.theme-layer-example {
			padding: 1rem;
			background: var(--cds-background);
			color: var(--cds-text-primary);
		}
		.theme-layer-header {
			margin-bottom: 1rem;
		}
		.theme-with-layer {
			padding: 1rem;
			background: var(--cds-layer);
			color: var(--cds-text-primary);
		}
	`]
});
export const WithLayer = LayeredTemplate.bind({});
