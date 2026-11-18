

import { CommonModule } from "@angular/common";
import { moduleMetadata, Meta } from "@storybook/angular";
import { ButtonModule } from "../button";
import { IconModule } from "../icon";
import { AILabelModule } from "../ai-label";
import { TableModule } from "./";
import {
	TableAiLabelColumnExpansionStory,
	TableAiLabelColumnSortStory,
	TableAiLabelExpansionOnlyStory,
	TableAiLabelFullTableStory,
	TableAiLabelRadioSelectionStory,
	TableAiLabelSelectionExpansionStory,
	TableAiLabelWithSelectionStory
} from "./stories";
import { AI_LABEL_STORY_STYLES } from "../storybook/ai-label-story-shared";

export default {
	title: "Components/Table/WithAILabel",
	component: TableAiLabelWithSelectionStory,
	decorators: [
		moduleMetadata({
			imports: [
				CommonModule,
				TableModule,
				AILabelModule,
				ButtonModule,
				IconModule,
				TableAiLabelWithSelectionStory,
				TableAiLabelRadioSelectionStory,
				TableAiLabelSelectionExpansionStory,
				TableAiLabelExpansionOnlyStory,
				TableAiLabelColumnExpansionStory,
				TableAiLabelColumnSortStory,
				TableAiLabelFullTableStory
			]
		})
	]
} as Meta;

const columnTableStyles = [
	...AI_LABEL_STORY_STYLES,
	`
		#storybook-root .ai-label-column-table .cds--data-table-content,
		.ai-label-column-table .cds--data-table-content {
			overflow: visible;
		}
	`
];

export const AILabelWithSelection = () => ({
	template: `
		<app-table-ai-label-selection class="ai-label-column-table">
			<cds-table-header-title slot="title">DataTable</cds-table-header-title>
			<cds-table-header-description slot="description">With selection</cds-table-header-description>
		</app-table-ai-label-selection>
	`,
	styles: columnTableStyles
});

export const AILabelWithRadioSelection = () => ({
	template: `
		<app-table-ai-label-radio class="ai-label-column-table">
			<cds-table-header-title slot="title">DataTable</cds-table-header-title>
			<cds-table-header-description slot="description">With radio selection</cds-table-header-description>
		</app-table-ai-label-radio>
	`,
	styles: columnTableStyles
});

export const AILabelWithSelectionAndExpansion = () => ({
	template: `
		<app-table-ai-label-selection-expansion class="ai-label-column-table">
			<cds-table-header-title slot="title">DataTable</cds-table-header-title>
			<cds-table-header-description slot="description">With expansion</cds-table-header-description>
		</app-table-ai-label-selection-expansion>
	`,
	styles: columnTableStyles
});

export const AILabelWithExpansion = () => ({
	template: `
		<app-table-ai-label-expansion-only class="ai-label-column-table">
			<cds-table-header-title slot="title">DataTable</cds-table-header-title>
			<cds-table-header-description slot="description">With expansion</cds-table-header-description>
		</app-table-ai-label-expansion-only>
	`,
	styles: columnTableStyles
});

export const ColumnAILabelWithSelectionAndExpansion = () => ({
	template: `
		<app-table-ai-label-column-expansion class="ai-label-column-table">
			<cds-table-header-title slot="title">DataTable</cds-table-header-title>
			<cds-table-header-description slot="description">With expansion</cds-table-header-description>
		</app-table-ai-label-column-expansion>
	`,
	styles: columnTableStyles
});

export const ColumnAILabelSort = () => ({
	template: `
		<app-table-ai-label-column-sort class="ai-label-column-table">
			<cds-table-header-title slot="title">DataTable</cds-table-header-title>
			<cds-table-header-description slot="description">With sorting</cds-table-header-description>
		</app-table-ai-label-column-sort>
	`,
	styles: columnTableStyles
});

export const FullTableAI = () => ({
	template: `<app-table-ai-label-full-table></app-table-ai-label-full-table>`,
	styles: columnTableStyles
});
