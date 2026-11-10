import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input,
	TemplateRef
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import "@carbon/web-components/es/components/tooltip/index.js";

/**
 * Renders the `<cds-definition-tooltip>` web component. The term goes in the default slot.
 *
 * ```html
 * <cds-tooltip-definition description="Uniform Resource Locator">URL</cds-tooltip-definition>
 * ```
 *
 * [See demo](../../?path=/story/components-tooltip-definition--basic)
 */
@Component({
	selector: "cds-tooltip-definition",
	template: `
		<cds-definition-tooltip [id]="id" [align]="align" [autoalign]="autoAlign" [openOnHover]="openOnHover" [defaultOpen]="isOpen">
			<ng-content />
			<span slot="definition">
				@if (isTemplate(description)) {
					<ng-template [ngTemplateOutlet]="description" [ngTemplateOutletContext]="{ $implicit: templateContext }" />
				} @else {
					{{ description }}
				}
			</span>
		</cds-definition-tooltip>
	`,
	styles: [":host { display: inline; }"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TooltipDefinition {
	static tooltipCount = 0;

	@Input() id = `tooltip-definition-${TooltipDefinition.tooltipCount++}`;
	@Input() description: string | TemplateRef<any>;
	@Input() templateContext: any;
	@Input() openOnHover = false;
	@Input() align = "bottom";
	@Input() autoAlign = false;
	/**
	 * Initial open state.
	 */
	@Input() isOpen = false;

	isTemplate(value: unknown): value is TemplateRef<any> {
		return value instanceof TemplateRef;
	}
}
