import { moduleMetadata, Meta } from "@storybook/angular";
import { CdsLayer } from "../layer";
import { TileGroup, RadioTile, SelectableTile } from "./";
import { AILabelModule } from "../ai-label";
import { ButtonModule } from "../button";
import { IconModule } from "../icon";
import { AI_LABEL_INNER } from "../storybook/ai-label-story-shared";

export default {
	title: "Components/Tiles/Grouped",
	decorators: [
		moduleMetadata({
			imports: [TileGroup, RadioTile, SelectableTile, CdsLayer, AILabelModule, ButtonModule, IconModule]
		})
	],
	component: TileGroup,
	subcomponents: {
		TileGroup,
		RadioTile,
		SelectableTile
	}
} as Meta;

const SelectableTemplate = (args) => ({
	props: args,
	template: `
		<cds-tile-group (selected)="selected($event)">
			<cds-radio-tile value="tile1" [selected]="true">Selectable Tile</cds-radio-tile>
			<cds-radio-tile value="tile2">Selectable Tile</cds-radio-tile>
			<cds-radio-tile value="tile3">Selectable Tile</cds-radio-tile>
		</cds-tile-group>
	`
});
export const Selectable = SelectableTemplate.bind({});
Selectable.argTypes = {
	selected: {
		action: "Tile selected!"
	}
};

const withAILabelTemplate = (args) => ({
	props: args,
	template: `
		<cds-tile-group (selected)="selected($event)">
			<cds-radio-tile value="t1" [decorator]="decoratorTpl">Tile with decorator</cds-radio-tile>
			<cds-radio-tile value="t2">Plain tile</cds-radio-tile>
		</cds-tile-group>
		<ng-template #decoratorTpl>
			<cds-ai-label
				kind="default"
				size="mini"
				[autoAlign]="true"
				[align]="'bottom-end'"
				aiText="AI"
				ariaLabel="Show information">
				` + AI_LABEL_INNER + `
			</cds-ai-label>
		</ng-template>
	`
});
export const withAILabel = withAILabelTemplate.bind({});
withAILabel.argTypes = {
	selected: {
		action: "Tile selected!"
	}
};

const MultiTemplate = (args) => ({
	props: args,
	template: `
		<cds-tile-group (selected)="selected($event)">
			<cds-selectable-tile value="tile1" [selected]="true">Selectable Tile</cds-selectable-tile>
			<cds-selectable-tile value="tile2">Selectable Tile</cds-selectable-tile>
			<cds-selectable-tile value="tile3">Selectable Tile</cds-selectable-tile>
		</cds-tile-group>
	`
});
export const Multiselect = MultiTemplate.bind({});
Multiselect.argTypes = {
	selected: {
		action: "Tile selected!"
	}
};

const LayerTemplate = (args) => ({
	props: args,
	template: `
		<cds-tile-group (selected)="selected($event)">
			<cds-radio-tile value="tile1" [selected]="true">First Layer</cds-radio-tile>
			<cds-radio-tile value="tile2">First Layer</cds-radio-tile>
		</cds-tile-group>
		<cds-layer>
			<cds-tile-group (selected)="selected($event)">
				<cds-radio-tile value="tile1" [selected]="true">Second Layer</cds-radio-tile>
				<cds-radio-tile value="tile2">Second Layer</cds-radio-tile>
			</cds-tile-group>
			<cds-layer>
				<cds-tile-group (selected)="selected($event)">
					<cds-radio-tile value="tile1" [selected]="true">Third Layer</cds-radio-tile>
					<cds-radio-tile value="tile2">Third Layer</cds-radio-tile>
				</cds-tile-group>
			</cds-layer>
		</cds-layer>
	`
});
export const WithLayers = LayerTemplate.bind({});
