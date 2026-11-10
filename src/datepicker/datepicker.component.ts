import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	TemplateRef,
	inject
} from "@angular/core";
import flatpickr from "flatpickr";
import * as languages from "flatpickr/dist/l10n/index";
import { Options } from "flatpickr/dist/types/options";
import "@carbon/web-components/es/components/date-picker/index.js";
import { provideValueAccessor, TemplateContent, TemplateSlot, WebComponentValueAccessor } from "carbon-components-angular/utils";

const toISODate = (date: Date) =>
	`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

/**
 * Wraps the `<cds-date-picker>` web component and renders its input(s).
 * Works with `ngModel` / reactive forms; the value is an array of `Date`s.
 *
 * ```html
 * <cds-date-picker label="Date" [(ngModel)]="dates" />
 * <cds-date-picker label="Start" rangeLabel="End" [range]="true" [(ngModel)]="range" />
 * ```
 *
 * [See demo](../../?path=/story/components-date-picker--single)
 */
@Component({
	selector: "cds-date-picker",
	template: `
		<cds-date-picker-input
			[kind]="range ? 'from' : 'single'"
			[id]="id"
			[labelText]="isTemplate(label) ? '' : label"
			[placeholder]="placeholder"
			[pattern]="inputPattern"
			[size]="size"
			[disabled]="disabled"
			[readonly]="readonly"
			[invalid]="invalid"
			[invalidText]="content.render('invalidText', invalidText)"
			[warn]="warn"
			[warnText]="content.render('warnText', warnText)"
			[helperText]="content.render('helperText', helperText)">
			<ng-container cdsSlot="label-text" [cdsSlotTemplate]="isTemplate(label) ? label : null" />
			<ng-container cdsSlot="ai-label" [cdsSlotTemplate]="decorator" />
		</cds-date-picker-input>
		@if (range) {
			<cds-date-picker-input
				kind="to"
				[id]="id + '-rangeInput'"
				[labelText]="rangeLabel"
				[placeholder]="placeholder"
				[pattern]="inputPattern"
				[size]="size"
				[disabled]="disabled"
				[readonly]="readonly"
				[invalid]="rangeInvalid"
				[invalidText]="content.render('rangeInvalidText', rangeInvalidText)"
				[warn]="rangeWarn"
				[warnText]="content.render('rangeWarnText', rangeWarnText)"
				[helperText]="content.render('rangeHelperText', rangeHelperText)">
				<ng-container cdsSlot="ai-label" [cdsSlotTemplate]="rangeDecorator" />
			</cds-date-picker-input>
		}
	`,
	host: {
		"[value]": "isoValue",
		"[dateFormat]": "dateFormat",
		"[locale]": "locale",
		"[minDate]": "flatpickrOptions?.minDate ?? ''",
		"[maxDate]": "flatpickrOptions?.maxDate ?? ''",
		"[disabled]": "disabled",
		"[attr.readonly]": "readonly ? '' : null",
		"[attr.aria-label]": "ariaLabel",
		"(cds-date-picker-changed)": "onDatesChanged($event)"
	},
	providers: [provideValueAccessor(() => DatePicker)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DatePicker extends WebComponentValueAccessor<Date[] | Date> implements AfterViewInit {
	static datePickerCount = 0;

	/**
	 * Select a range of dates (two inputs).
	 */
	@Input() range = false;
	/**
	 * flatpickr date format, e.g. `m/d/Y`.
	 */
	@Input() dateFormat = "m/d/Y";
	/**
	 * flatpickr locale key, e.g. `en`, `fr`.
	 */
	@Input() language = "en";
	@Input() label: string | TemplateRef<any>;
	@Input() helperText: string | TemplateRef<any>;
	@Input() decorator: TemplateRef<any>;
	@Input() rangeDecorator: TemplateRef<any>;
	@Input() rangeHelperText: string | TemplateRef<any>;
	@Input() rangeLabel: string;
	@Input() placeholder = "mm/dd/yyyy";
	@Input() ariaLabel = "calendar container";
	@Input() inputPattern = "^\\d{1,2}/\\d{1,2}/\\d{4}$";
	@Input() id = `datepicker-${DatePicker.datePickerCount++}`;
	/**
	 * The selected date(s). A single `Date` / string is accepted too.
	 */
	@Input() set value(value: (Date | string)[] | Date | string) {
		this._value = Array.isArray(value) ? value : value ? [value] : [];
	}
	get value(): any {
		return this._value;
	}
	@Input() readonly = false;
	@Input() invalid = false;
	@Input() invalidText: string | TemplateRef<any>;
	@Input() warn = false;
	@Input() warnText: string | TemplateRef<any>;
	@Input() size: "sm" | "md" | "lg" = "md";
	@Input() rangeInvalid = false;
	@Input() rangeInvalidText: string | TemplateRef<any>;
	@Input() rangeWarn = false;
	@Input() rangeWarnText: string | TemplateRef<any>;
	/**
	 * Only `minDate` and `maxDate` are passed to the web component.
	 */
	@Input() flatpickrOptions: Partial<Options>;
	/**
	 * @deprecated the web component manages its own flatpickr plugins.
	 */
	@Input() plugins = [];
	/**
	 * @deprecated the web component follows the surrounding theme / layer.
	 */
	@Input() theme: "light" | "dark" = "dark";
	/**
	 * @deprecated use `<cds-date-picker-input-skeleton>` instead.
	 */
	@Input() skeleton = false;

	@Output() valueChange: EventEmitter<any> = new EventEmitter();
	// eslint-disable-next-line @angular-eslint/no-output-on-prefix -- existing output name
	@Output() onClose: EventEmitter<any> = new EventEmitter();

	protected content = new TemplateContent();
	protected _value: (Date | string)[] = [];
	private element = inject(ElementRef).nativeElement;

	get locale() {
		const all = languages as any;
		return all.default?.default?.[this.language] || all.default?.[this.language];
	}

	/**
	 * The web component takes ISO dates joined with `/`.
	 */
	get isoValue() {
		return this._value
			.map(date => date instanceof Date ? date : flatpickr.parseDate(date, this.dateFormat))
			.filter(Boolean)
			.map(toISODate)
			.join("/");
	}

	async ngAfterViewInit() {
		await this.element.updateComplete;
		this.element.calendar?.config.onClose.push((dates: Date[]) => this.onClose.emit(dates));
	}

	writeValue(value: Date[] | Date) {
		this.value = value;
		this.changeDetectorRef.markForCheck();
	}

	onDatesChanged(event: Event) {
		const dates = (event as CustomEvent<{ selectedDates: Date[] }>).detail.selectedDates;
		this._value = dates;
		this.onChange(dates);
		this.valueChange.emit(dates);
	}

	isTemplate(value: unknown): value is TemplateRef<any> {
		return value instanceof TemplateRef;
	}
}
