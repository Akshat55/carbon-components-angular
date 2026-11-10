import {
	AfterContentChecked,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	ViewChild
} from "@angular/core";
import "@carbon/web-components/es/components/time-picker/index.js";
import "@carbon/web-components/es/components/select/index.js";
import { provideValueAccessor, WebComponentValueAccessor } from "carbon-components-angular/utils";

/**
 * Renders the `<cds-time-picker-select>` web component (e.g. AM/PM, time zone). Use inside
 * `cds-timepicker`. Projected `<option>`s become the web component's select items.
 *
 * [See demo](../../?path=/story/components-time-picker--basic)
 */
@Component({
	selector: "cds-timepicker-select",
	template: `
		<cds-time-picker-select
			[id]="id"
			[value]="currentValue"
			[disabled]="disabled"
			[attr.aria-label]="ariaLabel || label || null"
			(cds-select-selected)="onSelected($event)">
			@for (option of options; track option.value) {
				<cds-select-item
					[attr.value]="option.value"
					[attr.disabled]="option.disabled ? '' : null"
					[attr.selected]="option.selected ? '' : null">
					{{ option.label }}
				</cds-select-item>
			}
		</cds-time-picker-select>
		<span hidden #projected><ng-content /></span>
	`,
	styles: [":host { display: contents; }"],
	providers: [provideValueAccessor(() => TimePickerSelect)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimePickerSelect extends WebComponentValueAccessor<string> implements AfterContentChecked {
	static selectCount = 0;

	@Input() id = `timepicker-select-${TimePickerSelect.selectCount++}`;
	@Input() value: string;
	@Input() label: string;
	@Input() ariaLabel: string;
	/**
	 * @deprecated use `<cds-time-picker-skeleton>` instead.
	 */
	@Input() skeleton = false;
	/**
	 * @deprecated the web component follows the surrounding theme / layer.
	 */
	@Input() theme: "light" | "dark" = "dark";

	@Output() valueChange = new EventEmitter<string>();

	@ViewChild("projected", { static: true }) projected: ElementRef<HTMLElement>;

	/**
	 * The projected `<option>`s, rendered as `cds-select-item`s.
	 */
	options: { value: string, label: string, disabled: boolean, selected: boolean }[] = [];

	/**
	 * The value, or the projected option marked `selected` when no value is set.
	 */
	get currentValue() {
		return this.value ?? this.options.find(option => option.selected)?.value ?? "";
	}

	ngAfterContentChecked() {
		this.options = Array.from(this.projected.nativeElement.querySelectorAll("option")).map(option => ({
			value: option.value,
			label: option.textContent.trim(),
			disabled: option.disabled,
			selected: option.value === this.value || (this.value === undefined && option.defaultSelected)
		}));
	}

	writeValue(value: string) {
		this.value = value;
		this.changeDetectorRef.markForCheck();
	}

	onSelected(event: Event) {
		this.value = (event as CustomEvent<{ value: string }>).detail.value;
		this.onChange(this.value);
		this.valueChange.emit(this.value);
	}
}
