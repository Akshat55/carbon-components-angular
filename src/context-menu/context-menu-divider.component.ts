import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA
} from "@angular/core";
import "@carbon/web-components/es/components/menu/index.js";

/**
 * A menu divider. Renders the `<cds-menu-item-divider>` web component.
 */
@Component({
	selector: "cds-menu-divider",
	template: "<cds-menu-item-divider />",
	styles: [":host { display: contents; }"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContextMenuDividerComponent {}
