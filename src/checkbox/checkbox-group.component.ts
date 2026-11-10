import {
	ChangeDetectionStrategy,
	CUSTOM_ELEMENTS_SCHEMA,
	Component,
	ContentChildren,
	ElementRef,
	forwardRef,
	Input,
	OnChanges,
	QueryList,
	TemplateRef,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/checkbox/index.js";
import { TemplateContent, TemplateSlot } from "carbon-components-angular/utils";
import { Checkbox } from "./checkbox.component";
import { CHECKBOX_GROUP_HOST, CheckboxGroupHost } from "./checkbox-group-host";

/**
 * Wraps the `<cds-checkbox-group>` web component. Child `cds-checkbox` elements inherit
 * `readOnly`, `invalid` and `warn` unless they set their own.
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
		"[legendId]": "legendId",
		"[ariaLabelledBy]": "fieldsetAriaLabelledby",
		"[orientation]": "orientation",
		"[helperText]": "content.render('helperText', helperText)",
		"[invalid]": "invalid",
		"[invalidText]": "content.render('invalidText', invalidText)",
		"[warn]": "warn",
		"[warnText]": "content.render('warnText', warnText)",
		"[attr.readonly]": "readOnly ? '' : null"
	},
	providers: [{ provide: CHECKBOX_GROUP_HOST, useExisting: CheckboxGroup }],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CheckboxGroup implements CheckboxGroupHost, OnChanges {
	@ContentChildren(forwardRef(() => Checkbox), { descendants: true }) checkboxes: QueryList<Checkbox>;

	@Input() legend: string | TemplateRef<any>;
	@Input() legendId: string;
	@Input() fieldsetAriaLabelledby: string;
	@Input() orientation: "horizontal" | "vertical" = "vertical";
	@Input() helperText: string | TemplateRef<any>;
	@Input() invalid = false;
	@Input() invalidText: string | TemplateRef<any>;
	@Input() warn = false;
	@Input() warnText: string | TemplateRef<any>;
	@Input() readOnly = false;
	/**
	 * Optional decorator (e.g. AI label) rendered next to the legend.
	 */
	@Input() decorator: TemplateRef<any>;

	protected content = new TemplateContent();
	private element = inject(ElementRef).nativeElement;

	ngOnChanges() {
		// Child checkboxes read inherited state from this group. Refresh them once the
		// web component group has rendered (it copies `readonly` onto every child).
		Promise.resolve().then(() => this.element.updateComplete).then(() => {
			this.checkboxes?.forEach(checkbox => checkbox.markForCheckFromGroup());
		});
	}
}
