import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/stack/index.js";

/**
 * Adds Angular inputs to the `<cds-stack>` web component, which lays its children out with
 * a gap between them.
 *
 * ```html
 * <cds-stack orientation="horizontal" [gap]="5">
 * 	<div>Item 1</div>
 * 	<div>Item 2</div>
 * </cds-stack>
 * ```
 *
 * [See demo](../../?path=/story/layout-stack--basic)
 */
@Component({
	selector: "cds-stack",
	template: "<ng-content />",
	host: {
		"[orientation]": "orientation ?? element.orientation",
		"[gap]": "gap ?? element.gap",
		"[useCustomGapValue]": "useCustomGapValue ?? element.useCustomGapValue"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CdsStack {
	/**
	 * The web component's default is `"vertical"`.
	 */
	@Input() orientation: "vertical" | "horizontal";
	/**
	 * A step of the spacing scale (1-13), or with `useCustomGapValue` any CSS length (e.g. `"2rem"`).
	 */
	@Input() gap: number | string;
	@Input({ transform: booleanAttribute }) useCustomGapValue: boolean;

	protected element = inject(ElementRef).nativeElement;
}
