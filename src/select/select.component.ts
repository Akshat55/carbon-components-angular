import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output,
	TemplateRef
} from "@angular/core";
import "@carbon/web-components/es/components/select/index.js";
import { provideValueAccessor, TemplateContent, TemplateSlot, WebComponentValueAccessor } from "carbon-components-angular/utils";

/*
 * The web component reads `cds-select-item(-group)` children. Let it read native
 * `<option>` / `<optgroup>` children too, so v6 templates keep working unchanged.
 */
const CDSSelect = customElements.get("cds-select") as any;
if (CDSSelect && !CDSSelect.selectorItem.includes("option")) {
	Object.defineProperty(CDSSelect, "selectorItem", { get: () => "cds-select-item-group,cds-select-item,optgroup,option" });
	Object.defineProperty(CDSSelect, "selectorLeafItem", { get: () => "cds-select-item,option" });
}

/**
 * Wraps the `<cds-select>` web component. Works with `ngModel` / reactive forms.
 * Options can be `<option>`/`<optgroup>` or `<cds-select-item>`/`<cds-select-item-group>`.
 *
 * ```html
 * <cds-select label="Pick one" [(ngModel)]="value">
 * 	<option value="a">A</option>
 * </cds-select>
 * ```
 *
 * [See demo](../../?path=/story/components-select--basic)
 */
@Component({
	selector: "cds-select",
	template: `
		<ng-container cdsSlot="label-text" [cdsSlotTemplate]="isTemplate(label) ? label : null" />
		<ng-content />
		<ng-container cdsSlot="ai-label" [cdsSlotTemplate]="decorator" />
	`,
	host: {
		"[id]": "id",
		"[value]": "value ?? ''",
		"[labelText]": "isTemplate(label) ? '' : label",
		"[helperText]": "content.render('helperText', helperText)",
		"[invalid]": "invalid",
		"[invalidText]": "content.render('invalidText', invalidText)",
		"[warn]": "warn",
		"[warnText]": "content.render('warnText', warnText)",
		"[size]": "size",
		"[disabled]": "disabled",
		"[attr.readonly]": "readonly ? '' : null",
		"[inline]": "display === 'inline'",
		"[hideLabel]": "hideLabel",
		"[isFluid]": "fluid",
		"[attr.aria-label]": "ariaLabel || null",
		"(cds-select-selected)": "onSelected($event)"
	},
	providers: [provideValueAccessor(() => Select)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Select extends WebComponentValueAccessor {
	static selectCount = 0;

	@Input() value: any;
	@Input() display: "inline" | "default" = "default";
	@Input() label: string | TemplateRef<any>;
	@Input() helperText: string | TemplateRef<any>;
	@Input() invalid = false;
	@Input() invalidText: string | TemplateRef<any>;
	@Input() warn = false;
	@Input() warnText: string | TemplateRef<any>;
	@Input() id = `select-${Select.selectCount++}`;
	@Input() size: "sm" | "md" | "lg" = "md";
	@Input() readonly = false;
	@Input() ariaLabel: string;
	@Input() hideLabel = false;
	@Input() fluid = false;
	@Input() decorator: TemplateRef<any>;
	/**
	 * @deprecated the web component follows the surrounding theme / layer.
	 */
	@Input() theme: "light" | "dark" = "dark";
	/**
	 * @deprecated use `<cds-select-skeleton>` instead.
	 */
	@Input() skeleton = false;

	@Output() valueChange = new EventEmitter();

	protected content = new TemplateContent();

	writeValue(value: any) {
		this.value = value;
		this.changeDetectorRef.markForCheck();
	}

	onSelected(event: Event) {
		this.value = (event as CustomEvent<{ value: string }>).detail.value;
		this.onChange(this.value);
		this.valueChange.emit(this.value);
	}

	isTemplate(value: unknown): value is TemplateRef<any> {
		return value instanceof TemplateRef;
	}
}
