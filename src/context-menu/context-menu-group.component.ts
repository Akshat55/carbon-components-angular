import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/menu/index.js";

/**
 * Adds Angular inputs to the `<cds-menu-item-group>` web component, a labelled group of menu items.
 *
 * For selectable items use `cds-menu-item-selectable` (checkboxes) or
 * `cds-menu-item-radio-group` (one selected item), as the web components do.
 */
@Component({
	selector: "cds-menu-item-group",
	template: "<ng-content />",
	host: {
		"[label]": "label ?? element.label"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContextMenuGroupComponent {
	@Input() label?: string;

	protected element: any = inject(ElementRef).nativeElement;
}
