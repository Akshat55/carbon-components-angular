import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/dropdown/index.js";

/**
 * Loading state of a dropdown, multi select or combo box.
 *
 * Adds Angular inputs to the `<cds-dropdown-skeleton>` web component. Importing it registers the web component.
 */
@Component({
	selector: "cds-dropdown-skeleton",
	template: "<ng-content />",
	host: {
		"[hideLabel]": "hideLabel ?? element.hideLabel",
		"[size]": "size ?? element.size"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DropdownSkeleton {
	@Input({ transform: booleanAttribute }) hideLabel: boolean;
	@Input() size: "sm" | "md" | "lg";

	protected element = inject(ElementRef).nativeElement;
}
