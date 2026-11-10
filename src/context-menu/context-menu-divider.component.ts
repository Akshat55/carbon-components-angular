import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA
} from "@angular/core";
import "@carbon/web-components/es/components/menu/index.js";

/**
 * The `<cds-menu-item-divider>` web component. Importing it (or its module) registers the element.
 */
@Component({
	selector: "cds-menu-item-divider",
	template: "",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContextMenuDividerComponent {}
