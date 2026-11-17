import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input,
	TemplateRef
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import "@carbon/web-components/es/components/tooltip/index.js";
import { PopoverBase } from "carbon-components-angular/popover";

/**
 * Adds Angular inputs and outputs to the `<cds-tooltip>` web component. The trigger goes in the default slot.
 *
 * ```html
 * <cds-tooltip description="Copy to clipboard" align="top">
 * 	<button>Copy</button>
 * </cds-tooltip>
 * ```
 *
 * [See demo](../../?path=/story/components-tooltip--basic)
 */
@Component({
	selector: "cds-tooltip",
	template: `
		<ng-content />
		<!-- Always present: the web component updates its content element without a null check.
			It is hidden without a description, and comes after any cds-tooltip-content you project. -->
		<cds-tooltip-content [id]="id" [hidden]="!description || disabled">
			@if (isTemplate(description)) {
				<ng-template [ngTemplateOutlet]="description" [ngTemplateOutletContext]="{ $implicit: templateContext }" />
			} @else {
				{{ description }}
			}
		</cds-tooltip-content>
	`,
	host: {
		"[align]": "align ?? element.align",
		// The web component sets `open` from `defaultOpen` whenever `defaultOpen` changes.
		"[defaultOpen]": "isOpen ?? element.defaultOpen",
		"[enterDelayMs]": "enterDelayMs ?? element.enterDelayMs",
		"[leaveDelayMs]": "leaveDelayMs ?? element.leaveDelayMs",
		"[caret]": "caret ?? element.caret",
		"[dropShadow]": "dropShadow ?? element.dropShadow",
		"[highContrast]": "highContrast ?? element.highContrast",
		"[alignmentAxisOffset]": "alignmentAxisOffset ?? element.alignmentAxisOffset"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tooltip extends PopoverBase {
	static tooltipCount = 0;

	@Input() id = `tooltip-${Tooltip.tooltipCount++}`;
	/**
	 * The web component's default is 100.
	 */
	@Input() enterDelayMs?: number;
	/**
	 * The web component's default is 300.
	 */
	@Input() leaveDelayMs?: number;
	/**
	 * Hides the tooltip.
	 */
	@Input({ transform: booleanAttribute }) disabled = false;
	@Input() description: string | TemplateRef<any>;
	/**
	 * Context (`$implicit`) for a template `description`.
	 */
	@Input() templateContext: any;
	@Input({ transform: booleanAttribute }) caret?: boolean;
	/**
	 * The web component's default is `true` (v6 tooltips had no drop shadow).
	 */
	@Input({ transform: booleanAttribute }) dropShadow?: boolean;
	/**
	 * The web component sets it itself.
	 */
	@Input({ transform: booleanAttribute }) highContrast?: boolean;
	/**
	 * **Experimental:** offset along the alignment axis, in px. Only used with `autoAlign`.
	 */
	@Input() alignmentAxisOffset?: number;

	isTemplate(value: unknown): value is TemplateRef<any> {
		return value instanceof TemplateRef;
	}
}
