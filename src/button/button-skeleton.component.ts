import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/button/index.js";

/**
 * Loading state of a button.
 *
 * Adds Angular inputs to the `<cds-button-skeleton>` web component. Importing it registers the web component.
 */
@Component({
	selector: "cds-button-skeleton",
	template: "<ng-content />",
	host: {
		"[size]": "size ?? element.size",
		"[href]": "href ?? element.href"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ButtonSkeleton {
	@Input() size: "sm" | "md" | "lg" | "xl" | "2xl";
	@Input() href: string;

	protected element = inject(ElementRef).nativeElement;
}
