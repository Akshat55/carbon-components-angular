import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output,
	TemplateRef,
	inject
} from "@angular/core";
import { Observable } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import "@carbon/web-components/es/components/number-input/index.js";
import { I18n, Overridable } from "carbon-components-angular/i18n";
import { provideValueAccessor, TemplateContent, TemplateSlot, WebComponentValueAccessor } from "carbon-components-angular/utils";

export class NumberChange {
	source: NumberComponent;
	value: number;
}

/**
 * Adds `ngModel` / reactive forms and Angular inputs to the `<cds-number-input>` web component.
 *
 * [See demo](../../?path=/story/components-number--basic)
 */
@Component({
	selector: "cds-number-input",
	template: `
		<ng-container cdsSlot="label-text" [cdsSlotTemplate]="isTemplate(label) ? label : null" />
		<ng-container cdsSlot="ai-label" [cdsSlotTemplate]="decorator" />
	`,
	host: {
		"[id]": "id",
		"[value]": "value ?? ''",
		"[min]": "min ?? ''",
		"[max]": "max ?? ''",
		"[step]": "step",
		"[label]": "isTemplate(label) ? '' : label",
		"[placeholder]": "placeholder",
		"[disabled]": "disabled",
		"[required]": "required",
		"[size]": "size",
		"[hideLabel]": "hideLabel",
		"[hideSteppers]": "hideSteppers",
		"[allowEmpty]": "true",
		"[isFluid]": "fluid",
		"[inputMode]": "inputMode",
		"[pattern]": "pattern",
		"[helperText]": "content.render('helperText', helperText)",
		"[invalid]": "invalid",
		"[invalidText]": "content.render('invalidText', invalidText)",
		"[warn]": "warn",
		"[warnText]": "content.render('warnText', warnText)",
		"[incrementButtonAssistiveText]": "incrementLabelText",
		"[decrementButtonAssistiveText]": "decrementLabelText",
		"[attr.aria-label]": "ariaLabel",
		"(input)": "onInput()",
		"(cds-number-input)": "onInput()"
	},
	providers: [provideValueAccessor(() => NumberComponent)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NumberComponent extends WebComponentValueAccessor<number> {
	static numberCount = 0;

	@Input() id = `number-${NumberComponent.numberCount++}`;
	@Input() placeholder = "";
	@Input() size: "sm" | "md" | "lg" = "md";
	@Input() required: boolean;
	@Input() set value(v: any) {
		this._value = v === "" || v === null || v === undefined ? null : Number(v);
	}
	get value() {
		return this._value;
	}
	@Input() min = null;
	@Input() max = null;
	@Input() step = 1;
	/**
	 * Rounds emitted values to this many decimal places.
	 */
	@Input() precision: number;
	@Input() label: string | TemplateRef<any>;
	@Input() decorator: TemplateRef<any>;
	@Input() helperText: string | TemplateRef<any>;
	@Input() invalid = false;
	@Input() invalidText: string | TemplateRef<any>;
	@Input() warn = false;
	@Input() warnText: string | TemplateRef<any>;
	@Input() ariaLabel: string;
	@Input() hideLabel = false;
	@Input() hideSteppers = false;
	@Input() inputMode: any = "decimal";
	@Input() pattern: string;
	@Input() fluid = false;
	/**
	 * @deprecated the web component follows the surrounding theme / layer.
	 */
	@Input() theme: "light" | "dark" = "dark";
	/**
	 * @deprecated use `<cds-number-input-skeleton>` instead.
	 */
	@Input() skeleton = false;

	@Input() set decrementLabel(value: string | Observable<string>) {
		this._decrementLabel.override(value);
	}
	get decrementLabel() {
		return this._decrementLabel.value;
	}
	@Input() set incrementLabel(value: string | Observable<string>) {
		this._incrementLabel.override(value);
	}
	get incrementLabel() {
		return this._incrementLabel.value;
	}

	@Output() change = new EventEmitter<NumberChange>();

	public i18n = inject(I18n);
	protected content = new TemplateContent();
	protected _value: number = null;
	protected _decrementLabel: Overridable = this.i18n.getOverridable("NUMBER.DECREMENT");
	protected _incrementLabel: Overridable = this.i18n.getOverridable("NUMBER.INCREMENT");
	protected incrementLabelText = "";
	protected decrementLabelText = "";

	constructor() {
		super();
		this._incrementLabel.subject.pipe(takeUntilDestroyed()).subscribe(text => {
			this.incrementLabelText = text;
			this.changeDetectorRef.markForCheck();
		});
		this._decrementLabel.subject.pipe(takeUntilDestroyed()).subscribe(text => {
			this.decrementLabelText = text;
			this.changeDetectorRef.markForCheck();
		});
	}

	writeValue(value: any) {
		this.value = value;
		this.changeDetectorRef.markForCheck();
	}

	onInput() {
		const raw = this.element.value;
		let value = raw === "" ? null : Number(raw);
		if (value !== null && this.precision !== undefined) {
			value = Number(value.toFixed(this.precision));
		}
		if (value === this._value) {
			return;
		}
		this._value = value;
		this.onChange(value);
		this.change.emit({ source: this, value });
	}

	isTemplate(value: unknown): value is TemplateRef<any> {
		return value instanceof TemplateRef;
	}
}

/**
 * The `<cds-number-input-skeleton>` web component.
 */
@Component({
	selector: "cds-number-input-skeleton",
	template: "",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NumberSkeleton {}

export { NumberComponent as Number };
