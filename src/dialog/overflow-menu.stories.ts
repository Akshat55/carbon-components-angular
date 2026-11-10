/**
 * Storybook stories for the Angular overflow-menu directive layer.
 * The directives map the old API onto the overflow-menu web components.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { DialogModule } from "./index";

export default {
	title: "Components/Overflow Menu",
	decorators: [
		moduleMetadata({
			imports: [DialogModule]
		})
	],
	argTypes: {
		openChange: { action: "openChange" }
	}
} as Meta;

export const Basic = (args) => ({
	props: { ...args, onSelected: (name) => console.log("selected", name) },
	template: `
		<cds-overflow-menu (openChange)="openChange($event)">
			<svg slot="icon" width="16" height="16" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
				<circle cx="16" cy="8" r="2"></circle>
				<circle cx="16" cy="16" r="2"></circle>
				<circle cx="16" cy="24" r="2"></circle>
			</svg>
			<span slot="tooltip-content">Options</span>
			<cds-overflow-menu-body>
				<cds-overflow-menu-item (selected)="onSelected('one')">Option 1</cds-overflow-menu-item>
				<cds-overflow-menu-item (selected)="onSelected('two')">Option 2</cds-overflow-menu-item>
				<cds-overflow-menu-item [disabled]="true">Disabled option</cds-overflow-menu-item>
				<cds-overflow-menu-item [divider]="true" type="danger" (selected)="onSelected('delete')">
					Delete
				</cds-overflow-menu-item>
			</cds-overflow-menu-body>
		</cds-overflow-menu>
	`
});
