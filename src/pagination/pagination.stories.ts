/**
 * Storybook stories for the Angular pagination directive layer.
 * The directive maps the old `[model]` API onto the <cds-pagination>
 * web component.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { PaginationModule } from "./index";
import { PaginationModel } from "./pagination-model.class";

export default {
	title: "Components/Pagination",
	decorators: [
		moduleMetadata({
			imports: [PaginationModule]
		})
	],
	argTypes: {
		size: { control: "radio", options: ["sm", "md", "lg"] },
		disabled: { control: "boolean" },
		pageInputDisabled: { control: "boolean" },
		pagesUnknown: { control: "boolean" },
		selectPage: { action: "selectPage" }
	},
	args: {
		size: "md",
		disabled: false,
		pageInputDisabled: false,
		pagesUnknown: false
	}
} as Meta;

export const Basic = (args) => {
	const model = new PaginationModel();
	model.currentPage = 1;
	model.pageLength = 10;
	model.totalDataLength = 105;

	return {
		props: { ...args, model },
		template: `
			<cds-pagination
				[model]="model"
				[size]="size"
				[disabled]="disabled"
				[pageInputDisabled]="pageInputDisabled"
				[pagesUnknown]="pagesUnknown"
				(selectPage)="selectPage($event)">
			</cds-pagination>
		`
	};
};
