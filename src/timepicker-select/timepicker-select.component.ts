import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	DestroyRef,
	EventEmitter,
	Input,
	Output,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/time-picker/index.js";
import "@carbon/web-components/es/components/select/index.js";
import { observeChildren, provideValueAccessor, WebComponentValueAccessor } from "carbon-components-angular/utils";

/**
 * Adds `ngModel` / reactive forms to the `<cds-time-picker-select>` web component
 * (e.g. AM/PM, time zone). Use inside `cds-time-picker`, with `<cds-select-item>` children.
 *
 * ```html
 * <cds-time-picker-select [(ngModel)]="period">
 * 	<cds-select-item value="AM">AM</cds-select-item>
 * 	<cds-select-item value="PM">PM</cds-select-item>
 * </cds-time-picker-select>
 * ```
 *
 * [See demo](../../?path=/story/components-time-picker--basic)
 */
@Component({
	selector: "cds-time-picker-select",
	template: "<ng-content />",
	host: {
		"[id]": "id",
		"[disabled]": "disabled",
		"[attr.aria-label]": "ariaLabel || label || null",
		"(cds-select-selected)": "onSelected($event)"
	},
	providers: [provideValueAccessor(() => TimePickerSelect)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimePickerSelect extends WebComponentValueAccessor<string> {
	static selectCount = 0;

	@Input() id = `timepicker-select-${TimePickerSelect.selectCount++}`;
	/**
	 * Without a value, the `cds-select-item` marked `selected` is used.
	 */
	@Input() set value(value: string) {
		this._value = value;
		if (value !== undefined && value !== null) {
			this.element.value = value;
		}
	}
	get value() {
		return this._value;
	}
	@Input() label: string;
	@Input() ariaLabel: string;

	@Output() valueChange = new EventEmitter<string>();

	protected _value: string;

	constructor() {
		super();
		// The web component resets its `<select>` to `value` (default ""), ignoring `selected` items.
		observeChildren(this.element, inject(DestroyRef), () => {
			if (this._value === undefined || this._value === null) {
				const selected = this.element.querySelector("cds-select-item[selected]");
				this.element.value = selected?.getAttribute("value") ?? "";
			}
		});
	}

	writeValue(value: string) {
		this.value = value;
	}

	onSelected(event: Event) {
		this.value = (event as CustomEvent<{ value: string }>).detail.value;
		this.onChange(this.value);
		this.valueChange.emit(this.value);
	}
}
