/**
 * Storybook stories for the Angular layer directive layer.
 * The directive maps the old `[cdsLayer]` API onto the <cds-layer>
 * web component, which handles nested layer levels itself.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { LayerModule } from "./index";

export default {
	title: "Components/Layer",
	decorators: [
		moduleMetadata({
			imports: [LayerModule]
		})
	]
} as Meta;

export const Basic = () => ({
	template: `
		<cds-layer>
			<div style="padding: 1rem">Layer one</div>
			<cds-layer>
				<div style="padding: 1rem">Layer two</div>
				<cds-layer>
					<div style="padding: 1rem">Layer three</div>
				</cds-layer>
			</cds-layer>
		</cds-layer>
	`
});

export const ExplicitLevel = () => ({
	template: `
		<div [cdsLayer]="2">
			<cds-layer level="2">
				<div style="padding: 1rem">Explicit layer level 2</div>
			</cds-layer>
		</div>
	`
});
ExplicitLevel.storyName = "Explicit Level";
