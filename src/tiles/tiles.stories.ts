/**
 * Storybook stories for the Angular tile directive layer.
 * The directives map the old @Input/@Output API onto the tile web components.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { TilesModule } from "./index";

export default {
	title: "Components/Tiles",
	decorators: [
		moduleMetadata({
			imports: [TilesModule]
		})
	]
} as Meta;

export const Basic = () => ({
	template: `
		<cds-tile>
			Tile content — anything can go here.
		</cds-tile>
	`
});

export const Clickable = () => ({
	template: `
		<cds-clickable-tile href="https://carbondesignsystem.com/">
			Clickable tile — navigates on click.
		</cds-clickable-tile>
	`
});

export const Expandable = () => ({
	template: `
		<cds-expandable-tile>
			<div cdsExpandableTileAbove style="height: 130px">
				Above the fold content
			</div>
			<div style="height: 200px">
				Below the fold content
			</div>
		</cds-expandable-tile>
	`
});

export const Selectable = (args) => ({
	props: { onSelected: (event) => console.log("selected", event) },
	template: `
		<cds-tile-group name="multi-tiles" (selected)="onSelected($event)">
			<cds-selectable-tile value="one">Option one</cds-selectable-tile>
			<cds-selectable-tile value="two">Option two</cds-selectable-tile>
			<cds-selectable-tile value="three">Option three</cds-selectable-tile>
		</cds-tile-group>
	`
});

export const RadioTiles = (args) => ({
	props: { onSelected: (event) => console.log("selected", event) },
	template: `
		<cds-tile-group name="radio-tiles" (selected)="onSelected($event)">
			<cds-radio-tile value="one">Option one</cds-radio-tile>
			<cds-radio-tile value="two">Option two</cds-radio-tile>
			<cds-radio-tile value="three">Option three</cds-radio-tile>
		</cds-tile-group>
	`
});
RadioTiles.storyName = "Radio Tiles (Single Select)";
