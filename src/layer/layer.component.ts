import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/layer/index.js";

/**
 * Adds Angular inputs to the `<cds-layer>` web component. Importing it registers the web component.
 *
 * Nested layers go one level up automatically.
 *
 * ```html
 * <cds-layer>
 * 	First layer
 * 	<cds-layer>Second layer</cds-layer>
 * </cds-layer>
 * ```
 */
@Component({
	selector: "cds-layer",
	template: "<ng-content />",
	host: {
		"[level]": "level ?? element.level",
		"[withBackground]": "withBackground ?? element.withBackground"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CdsLayer {
	/**
	 * Fixes the level instead of going one up from the parent layer.
	 */
	@Input() level: 0 | 1 | 2;
	/**
	 * Fills the layer with the layer's background color.
	 */
	@Input({ transform: booleanAttribute }) withBackground?: boolean;

	protected element = inject(ElementRef).nativeElement;
}
