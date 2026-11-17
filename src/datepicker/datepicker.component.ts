import {
	booleanAttribute,
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
	TemplateRef,
	inject
} from "@angular/core";
import flatpickr from "flatpickr";
import * as languages from "flatpickr/dist/l10n/index";
import { Options } from "flatpickr/dist/types/options";
import "@carbon/web-components/es/components/date-picker/index.js";
import {
	observeChildren,
	provideValueAccessor,
	TemplateContent,
	TemplateSlot,
	WebComponentValueAccessor
} from "carbon-components-angular/utils";

const toISODate = (date: Date) =>
	`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

/**
 * Adds Angular inputs and outputs to the `<cds-date-picker>` web component and renders its input(s).
 * Works with `ngModel` / reactive forms; the value is an array of `Date`s.
 *
 * ```html
 * <cds-date-picker label="Date" [(ngModel)]="dates" />
 * <cds-date-picker label="Start" rangeLabel="End" [range]="true" [(ngModel)]="range" />
 * ```
 *
 * The inputs can also be written as `cds-date-picker-input` children, as with the web component;
 * the inputs rendered from `label`, `range` etc. are then left out.
 *
 * ```html
 * <cds-date-picker [(ngModel)]="dates">
 * 	<cds-date-picker-input kind="single" labelText="Date" />
 * </cds-date-picker>
 * ```
 *
 * [See demo](../../?path=/story/components-date-picker--single)
 */
@Component({
	selector: "cds-date-picker",
	template: `
		<ng-content />
		@if (!hasOwnInputs) {
		<cds-date-picker-input
			data-cds-generated
			[kind]="range ? 'from' : 'single'"
			[id]="id"
			[labelText]="isTemplate(label) ? '' : label"
			[placeholder]="placeholder"
			[pattern]="inputPattern"
			[size]="size || 'md'"
			[invalid]="!!invalid"
			[invalidText]="content.render('invalidText', invalidText)"
			[warn]="!!warn"
			[warnText]="content.render('warnText', warnText)">
			@if (isTemplate(helperText)) {
				<ng-container cdsSlot="helper-text" [cdsSlotTemplate]="helperText" />
			} @else if (helperText) {
				<span slot="helper-text">{{ helperText }}</span>
			}
			<ng-container cdsSlot="label-text" [cdsSlotTemplate]="isTemplate(label) ? label : null" />
			<ng-container cdsSlot="ai-label" [cdsSlotTemplate]="decorator" />
		</cds-date-picker-input>
		@if (range) {
			<cds-date-picker-input
				data-cds-generated
				kind="to"
				[id]="id + '-rangeInput'"
				[labelText]="rangeLabel"
				[placeholder]="placeholder"
				[pattern]="inputPattern"
				[size]="size || 'md'"
				[invalid]="!!rangeInvalid"
				[invalidText]="content.render('rangeInvalidText', rangeInvalidText)"
				[warn]="!!rangeWarn"
				[warnText]="content.render('rangeWarnText', rangeWarnText)">
				@if (isTemplate(rangeHelperText)) {
					<ng-container cdsSlot="helper-text" [cdsSlotTemplate]="rangeHelperText" />
				} @else if (rangeHelperText) {
					<span slot="helper-text">{{ rangeHelperText }}</span>
				}
				<ng-container cdsSlot="ai-label" [cdsSlotTemplate]="rangeDecorator" />
			</cds-date-picker-input>
		}
		}
	`,
	host: {
		"[value]": "isoValue",
		"[dateFormat]": "dateFormat ?? element.dateFormat",
		"[locale]": "locale",
		"[minDate]": "flatpickrOptions?.minDate ?? ''",
		"[maxDate]": "flatpickrOptions?.maxDate ?? ''",
		"[disabled]": "disabled ?? element.disabled",
		"[allowInput]": "readonly === undefined ? element.allowInput : !readonly",
		"[attr.aria-label]": "ariaLabel",
		"(cds-date-picker-changed)": "onDatesChanged($event)"
	},
	providers: [provideValueAccessor(() => DatePicker)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DatePicker extends WebComponentValueAccessor<Date[] | Date> implements AfterViewInit, OnChanges {
	static datePickerCount = 0;

	/**
	 * Select a range of dates (two inputs).
	 */
	@Input({ transform: booleanAttribute }) range = false;
	/**
	 * flatpickr date format, e.g. `m/d/Y`.
	 */
	/**
	 * The web component's default is `"m/d/Y"`.
	 */
	@Input() dateFormat?: string;
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
	/**
	 * The web component passes it on to its inputs.
	 */
	@Input({ transform: booleanAttribute }) readonly?: boolean;
	@Input({ transform: booleanAttribute }) invalid = false;
	@Input() invalidText: string | TemplateRef<any>;
	@Input({ transform: booleanAttribute }) warn = false;
	@Input() warnText: string | TemplateRef<any>;
	@Input() size: "sm" | "md" | "lg" = "md";
	@Input({ transform: booleanAttribute }) rangeInvalid = false;
	@Input() rangeInvalidText: string | TemplateRef<any>;
	@Input({ transform: booleanAttribute }) rangeWarn = false;
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
	@Input({ transform: booleanAttribute }) skeleton = false;

	@Output() valueChange: EventEmitter<any> = new EventEmitter();
	// eslint-disable-next-line @angular-eslint/no-output-on-prefix -- existing output name
	@Output() onClose: EventEmitter<any> = new EventEmitter();

	/**
	 * Whether the consumer wrote its own `cds-date-picker-input`s. The rendered inputs are only
	 * removed once that's known: the web component needs its inputs from the first render.
	 */
	protected hasOwnInputs = false;
	protected content = new TemplateContent();
	protected _value: (Date | string)[] = [];

	get locale() {
		const all = languages as any;
		return all.default?.default?.[this.language] || all.default?.[this.language];
	}

	/**
	 * The web component takes ISO dates joined with `/`.
	 */
	get isoValue() {
		return this._value
			.map(date => date instanceof Date ? date : flatpickr.parseDate(date, this.dateFormat ?? this.element.dateFormat ?? "m/d/Y"))
			.filter(Boolean)
			.map(toISODate)
			.join("/");
	}

	constructor() {
		super();
		observeChildren(this.element, () => {
			const hasOwnInputs = Array.from<Element>(this.element.children)
				.some(child => child.localName === "cds-date-picker-input" && !child.hasAttribute("data-cds-generated"));
			if (hasOwnInputs !== this.hasOwnInputs) {
				this.hasOwnInputs = hasOwnInputs;
				this.changeDetectorRef.markForCheck();
			}
		});
	}

	ngOnChanges(changes: SimpleChanges) {
		// Angular would bind `[readonly]` to the `readOnly` DOM property; the web component's is `readonly`.
		if (changes["readonly"] && this.readonly !== undefined) {
			this.element.readonly = this.readonly;
		}
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
