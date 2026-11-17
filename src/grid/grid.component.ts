import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/grid/index.js";

/**
 * The CSS grid web component. Project `cds-column`s.
 *
 * Adds Angular inputs to the `<cds-grid>` web component. Importing it registers the web component.
 */
@Component({
	selector: "cds-grid",
	template: "<ng-content />",
	host: {
		"[align]": "align ?? element.align",
		"[condensed]": "condensed ?? element.condensed",
		"[narrow]": "narrow ?? element.narrow",
		"[fullWidth]": "fullWidth ?? element.fullWidth"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CdsGrid {
	@Input() align: "start" | "center" | "end";
	/**
	 * No gutters.
	 */
	@Input({ transform: booleanAttribute }) condensed: boolean;
	/**
	 * Gutters on one side only.
	 */
	@Input({ transform: booleanAttribute }) narrow: boolean;
	/**
	 * No maximum width.
	 */
	@Input({ transform: booleanAttribute }) fullWidth: boolean;

	protected element = inject(ElementRef).nativeElement;
}

/**
 * A column of `cds-grid`. Spans take a number, `"25%"` etc., or `"auto"`.
 *
 * Adds Angular inputs to the `<cds-column>` web component. Importing it registers the web component.
 */
@Component({
	selector: "cds-column",
	template: "<ng-content />",
	host: {
		"[sm]": "sm ?? element.sm",
		"[md]": "md ?? element.md",
		"[lg]": "lg ?? element.lg",
		"[xlg]": "xlg ?? element.xlg",
		"[max]": "max ?? element.max",
		"[span]": "span ?? element.span"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CdsColumn {
	@Input() sm: string | number;
	@Input() md: string | number;
	@Input() lg: string | number;
	@Input() xlg: string | number;
	@Input() max: string | number;
	/**
	 * Span at every breakpoint.
	 */
	@Input() span: string | number;

	protected element = inject(ElementRef).nativeElement;
}
