import {
	booleanAttribute,
	ChangeDetectionStrategy,
	CUSTOM_ELEMENTS_SCHEMA,
	Component,
	ElementRef,
	Input,
	TemplateRef,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/checkbox/index.js";
import { TemplateContent, TemplateSlot } from "carbon-components-angular/utils";

/**
 * Adds Angular inputs and outputs to the `<cds-checkbox-group>` web component. The web component passes
 * `disabled`, `readOnly` and `orientation` on to its `cds-checkbox` children. `invalid` marks the whole group.
 *
 * [See demo](../../?path=/story/components-checkbox--group)
 */
@Component({
	selector: "cds-checkbox-group",
	template: `
		<ng-content />
		<ng-container cdsSlot="decorator" [cdsSlotTemplate]="decorator" />
	`,
	host: {
		"[legendText]": "content.render('legend', legend)",
		"[legendId]": "legendId ?? element.legendId",
		"[ariaLabelledBy]": "fieldsetAriaLabelledby ?? element.ariaLabelledBy",
		"[orientation]": "orientation ?? element.orientation",
		"[helperText]": "content.render('helperText', helperText)",
		"[disabled]": "disabled ?? element.disabled",
		"[invalid]": "invalid ?? element.invalid",
		"[invalidText]": "content.render('invalidText', invalidText)",
		"[warn]": "warn ?? element.warn",
		"[warnText]": "content.render('warnText', warnText)",
		// Angular would bind `[readonly]` to the `readOnly` DOM property; the web component's is `readonly`.
		"[attr.readonly]": "readOnly ? '' : null"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CheckboxGroup {
	@Input() legend: string | TemplateRef<any>;
	@Input() legendId: string;
	@Input() fieldsetAriaLabelledby: string;
	/**
	 * The web component's default is `"vertical"`.
	 */
	@Input() orientation?: "horizontal" | "vertical";
	@Input() helperText: string | TemplateRef<any>;
	/**
	 * Disables every checkbox.
	 */
	@Input({ transform: booleanAttribute }) disabled?: boolean;
	@Input({ transform: booleanAttribute }) invalid?: boolean;
	@Input() invalidText: string | TemplateRef<any>;
	@Input({ transform: booleanAttribute }) warn?: boolean;
	@Input() warnText: string | TemplateRef<any>;
	/**
	 * Makes every checkbox read-only.
	 */
	@Input({ transform: booleanAttribute }) readOnly?: boolean;
	/**
	 * Optional decorator (e.g. AI label) rendered next to the legend.
	 */
	@Input() decorator: TemplateRef<any>;

	protected content = new TemplateContent();
	protected element = inject(ElementRef).nativeElement;
}
