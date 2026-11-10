import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output,
	TemplateRef
} from "@angular/core";
import "@carbon/web-components/es/components/slider/index.js";
import { provideValueAccessor, TemplateSlot, WebComponentValueAccessor } from "carbon-components-angular/utils";

/**
 * Wraps the `<cds-slider>` web component. Pass a `[number, number]` value for a range slider.
 * Works with `ngModel` / reactive forms.
 *
 * ```html
 * <cds-slider label="Volume" [min]="0" [max]="100" [(ngModel)]="volume">
 * 	<span minLabel>0</span>
 * 	<span maxLabel>100</span>
 * </cds-slider>
 * ```
 *
 * [See demo](../../?path=/story/components-slider--basic)
 */
@Component({
	selector: "cds-slider",
	template: `
		<ng-container cdsSlot="label-text" [cdsSlotTemplate]="isTemplate(label) ? label : null" />
		<span slot="min-text"><ng-content select="[minLabel]" /></span>
		<span slot="max-text"><ng-content select="[maxLabel]" /></span>
		@if (isRange()) {
			<cds-slider-input slot="lower-input" [value]="lower" [disabled]="disabled" [readonly]="readonly" />
			<cds-slider-input id="upper" [value]="upper" [disabled]="disabled" [readonly]="readonly" />
		} @else {
			<cds-slider-input [value]="lower" [disabled]="disabled" [readonly]="readonly" />
		}
		<!-- v6 templates projected their own <input>s; the web component renders its own. -->
		<span hidden><ng-content select="input" /></span>
		<ng-content />
	`,
	host: {
		"[id]": "id",
		"[min]": "min",
		"[max]": "max",
		"[step]": "step",
		"[stepMultiplier]": "stepMultiplier",
		"[value]": "lower",
		"[unstable_valueUpper]": "isRange() ? upper : undefined",
		"[labelText]": "isTemplate(label) ? '' : label",
		"[disabled]": "disabled",
		"[attr.readonly]": "readonly ? '' : null",
		"[hideTextInput]": "hideTextInput",
		"(cds-slider-changed)": "onSliderChanged($event)"
	},
	providers: [provideValueAccessor(() => Slider)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Slider extends WebComponentValueAccessor<number | number[]> {
	static count = 0;

	@Input() min = 0;
	@Input() max = 100;
	@Input() step = 1;
	/**
	 * A number, or `[lower, upper]` for a range slider.
	 */
	@Input() set value(value: number | number[]) {
		const values = (Array.isArray(value) ? value : [value ?? this.min]).map(Number);
		this._value = values.map(n => Math.min(this.max, Math.max(this.min, n)));
		// As in v6, a value outside min / max is corrected and reported.
		if (this._value.some((n, i) => n !== values[i])) {
			this.onChange(this.value);
			this.valueChange.emit(this.value);
		}
	}
	get value(): number | number[] {
		return this.isRange() ? this._value : this._value[0];
	}
	@Input() id = `slider-${Slider.count++}`;
	/**
	 * Shift + arrow keys move by `step * shiftMultiplier`.
	 */
	@Input() shiftMultiplier = 4;
	@Input() label: string | TemplateRef<any>;
	@Input() readonly = false;
	@Input() hideTextInput = false;
	/**
	 * @deprecated use `<cds-slider-skeleton>` instead.
	 */
	@Input() skeleton = false;
	/**
	 * @deprecated the web component always supports arrow keys.
	 */
	@Input() disableArrowKeys = false;

	@Output() valueChange: EventEmitter<number | number[]> = new EventEmitter();

	protected _value: number[] = [0];

	/**
	 * The web component's Shift + arrow step is `(max - min) / stepMultiplier`.
	 */
	get stepMultiplier() {
		return (this.max - this.min) / (this.step * this.shiftMultiplier);
	}

	get lower() {
		return this._value[0];
	}

	get upper() {
		return this._value[1];
	}

	isRange() {
		return this._value.length > 1;
	}

	writeValue(value: number | number[]) {
		this.value = value;
		this.changeDetectorRef.markForCheck();
	}

	onSliderChanged(event: Event) {
		const slider = event.currentTarget as any;
		this._value = this.isRange()
			? [Number(slider.value), Number(slider.unstable_valueUpper)]
			: [Number(slider.value)];
		this.onChange(this.value);
		this.valueChange.emit(this.value);
	}

	isTemplate(value: unknown): value is TemplateRef<any> {
		return value instanceof TemplateRef;
	}
}
