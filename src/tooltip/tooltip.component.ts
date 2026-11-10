import {
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
 * Wraps the `<cds-tooltip>` web component. The trigger goes in the default slot.
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
		@if (description && !disabled) {
			<cds-tooltip-content [id]="id">
				@if (isTemplate(description)) {
					<ng-template [ngTemplateOutlet]="description" [ngTemplateOutletContext]="{ $implicit: templateContext }" />
				} @else {
					{{ description }}
				}
			</cds-tooltip-content>
		}
	`,
	host: {
		"[enterDelayMs]": "enterDelayMs",
		"[leaveDelayMs]": "leaveDelayMs",
		"[caret]": "caret",
		"[dropShadow]": "dropShadow",
		"[highContrast]": "highContrast"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tooltip extends PopoverBase {
	static tooltipCount = 0;

	@Input() id = `tooltip-${Tooltip.tooltipCount++}`;
	@Input() enterDelayMs = 100;
	@Input() leaveDelayMs = 300;
	/**
	 * Hides the tooltip.
	 */
	@Input() disabled = false;
	@Input() description: string | TemplateRef<any>;
	/**
	 * Context (`$implicit`) for a template `description`.
	 */
	@Input() templateContext: any;
	@Input() caret = true;
	@Input() dropShadow = false;
	@Input() highContrast = true;
	/**
	 * Placement; tooltips default to `top`.
	 */
	@Input() align = "top";

	isTemplate(value: unknown): value is TemplateRef<any> {
		return value instanceof TemplateRef;
	}
}
