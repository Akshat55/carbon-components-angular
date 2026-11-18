import { moduleMetadata, Meta } from "@storybook/angular";
import { CdsLayer } from "../layer";
import { IconDirective } from "../icon";
import { ClickableTile } from "./";
import { LayerModule } from "../layer";
import { IconModule } from "../icon";
import { AILabelModule } from "../ai-label";
import { ButtonModule } from "../button";
import { AI_LABEL_INNER } from "../storybook/ai-label-story-shared";

export default {
	title: "Components/Tiles/Clickable",
	decorators: [
		moduleMetadata({
			imports: [
				ClickableTile,
				CdsLayer,
				IconDirective,
				LayerModule,
				IconModule,
				AILabelModule,
				ButtonModule
			]
		})
	],
	component: ClickableTile
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<cds-clickable-tile
			[disabled]="disabled"
			[href]="href"
			target="_blank">
			Click the tile to open the Carbon Design System
			<svg
				cdsIcon="caret--right"
				size="16">
			</svg>
		</cds-clickable-tile>
	`
});
export const Basic = Template.bind({});
Basic.args = {
	href: "https://www.carbondesignsystem.com/"
};

const LayerTemplate = (args) => ({
	props: args,
	template: `
		<cds-clickable-tile>
			First layer
		</cds-clickable-tile>
		<cds-layer>
			<cds-clickable-tile>
				Second layer
			</cds-clickable-tile>
			<cds-layer>
				<cds-clickable-tile>Third layer</cds-clickable-tile>
			</cds-layer>
		</cds-layer>
	`
});
export const WithLayers = LayerTemplate.bind({});
WithLayers.parameters = {
	controls: {
		disable: true
	}
};

export const withAILabel = () => ({
	template: `
		<cds-clickable-tile [href]="href" [decorator]="decoratorTpl" target="_blank">
			Clickable tile with decorator
		</cds-clickable-tile>
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
	`,
	props: { href: "https://www.carbondesignsystem.com/" }
});
