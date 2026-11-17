import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/list/index.js";

/**
 * A bulleted list of `cds-list-item`s.
 *
 * Adds Angular inputs to the `<cds-unordered-list>` web component. Importing it registers the web component.
 */
@Component({
	selector: "cds-unordered-list",
	template: "<ng-content />",
	host: {
		"[isExpressive]": "isExpressive ?? element.isExpressive",
		"[nested]": "nested ?? element.nested"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CdsUnorderedList {
	@Input({ transform: booleanAttribute }) isExpressive: boolean;
	@Input({ transform: booleanAttribute }) nested: boolean;

	protected element = inject(ElementRef).nativeElement;
}

/**
 * A numbered list of `cds-list-item`s.
 *
 * Adds Angular inputs to the `<cds-ordered-list>` web component. Importing it registers the web component.
 */
@Component({
	selector: "cds-ordered-list",
	template: "<ng-content />",
	host: {
		"[native]": "native ?? element.native",
		"[isExpressive]": "isExpressive ?? element.isExpressive",
		"[nested]": "nested ?? element.nested"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CdsOrderedList {
	/**
	 * Uses the browser's numbering.
	 */
	@Input({ transform: booleanAttribute }) native: boolean;
	@Input({ transform: booleanAttribute }) isExpressive: boolean;
	@Input({ transform: booleanAttribute }) nested: boolean;

	protected element = inject(ElementRef).nativeElement;
}

/**
 * An item of `cds-unordered-list` or `cds-ordered-list`.
 *
 * Angular class for the `<cds-list-item>` web component, so templates can use it without
 * `CUSTOM_ELEMENTS_SCHEMA`. Importing it registers the web component.
 */
@Component({
	selector: "cds-list-item",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CdsListItem {}
