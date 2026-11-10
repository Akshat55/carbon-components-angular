import {
	AfterContentInit,
	ChangeDetectionStrategy,
	Component,
	ContentChildren,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	forwardRef,
	Input,
	OnDestroy,
	Output,
	QueryList,
	TemplateRef
} from "@angular/core";
import { Subscription } from "rxjs";
import "@carbon/web-components/es/components/radio-button/index.js";
import { provideValueAccessor, TemplateContent, TemplateSlot, WebComponentValueAccessor } from "carbon-components-angular/utils";
import { Radio } from "./radio.component";
import { RadioChange } from "./radio-change.class";

/**
 * Renders the `<cds-radio-button-group>` web component around projected `cds-radio`s.
 * Works with `ngModel` / reactive forms; the value is the selected radio's `value`.
 *
 * [See demo](../../?path=/story/components-radio--basic)
 */
@Component({
	selector: "cds-radio-group",
	template: `
		<cds-radio-button-group
			[name]="name"
			[value]="selected?.stringValue ?? ''"
			[disabled]="disabled"
			[orientation]="orientation"
			[labelPosition]="labelPlacement"
			[legendText]="isTemplate(legend) ? '' : legend"
			[helperText]="content.render('helperText', helperText)"
			[invalid]="invalid"
			[invalidText]="content.render('invalidText', invalidText)"
			[warn]="warn"
			[warnText]="content.render('warnText', warnText)"
			[attr.aria-label]="ariaLabel || null"
			[attr.aria-labelledby]="ariaLabelledby || null"
			(cds-radio-button-group-changed)="onGroupChanged($event)">
			<ng-container cdsSlot="ai-label" [cdsSlotTemplate]="decorator" />
			<ng-content />
		</cds-radio-button-group>
	`,
	styles: [":host { display: block; }"],
	providers: [provideValueAccessor(() => RadioGroup)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RadioGroup extends WebComponentValueAccessor implements AfterContentInit, OnDestroy {
	static radioGroupCount = 0;

	/**
	 * The selected `Radio`.
	 */
	@Input() set selected(selected: Radio | null) {
		this.value = selected ? selected.value : null;
	}
	get selected(): Radio | null {
		return this.radios?.find(radio => radio.value === this._value) ?? null;
	}

	@Input() set value(value: any) {
		this._value = value;
		this.updateRadios();
	}
	get value() {
		return this._value;
	}

	@Input() set name(name: string) {
		this._name = name;
		this.updateRadios();
	}
	get name() {
		return this._name;
	}

	@Input() set skeleton(value: boolean) {
		this._skeleton = value;
		this.radios?.forEach(radio => radio.skeleton = value);
	}
	get skeleton() {
		return this._skeleton;
	}

	@Input() orientation: "horizontal" | "vertical" = "horizontal";
	@Input() labelPlacement: "right" | "left" = "right";
	/**
	 * Legend text. A `TemplateRef` is not supported by the web component and renders nothing.
	 */
	@Input() legend: string | TemplateRef<any>;
	@Input() decorator: TemplateRef<any>;
	@Input() ariaLabel: string;
	@Input() ariaLabelledby: string;
	@Input() helperText: string | TemplateRef<any>;
	@Input() invalid = false;
	@Input() invalidText: string | TemplateRef<any>;
	@Input() warn = false;
	@Input() warnText: string | TemplateRef<any>;

	// eslint-disable-next-line @angular-eslint/no-output-native
	@Output() change = new EventEmitter<RadioChange>();

	@ContentChildren(forwardRef(() => Radio)) radios: QueryList<Radio>;

	protected content = new TemplateContent();
	protected _value: any = null;
	protected _name = `radio-group-${RadioGroup.radioGroupCount++}`;
	protected _skeleton = false;
	private subscription = new Subscription();

	ngAfterContentInit() {
		// A pre-checked radio sets the initial value.
		if (this._value === null || this._value === undefined) {
			this._value = this.radios.find(radio => radio.checked)?.value ?? null;
		}
		this.updateRadios();
		// Keep the selection when the radios change (e.g. `@for` re-renders).
		this.subscription.add(this.radios.changes.subscribe(() => this.updateRadios()));
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	writeValue(value: any) {
		this.value = value;
	}

	onGroupChanged(event: Event) {
		const value = (event as CustomEvent<{ value: string }>).detail.value;
		const radio = this.radios.find(r => r.stringValue === value);
		if (!radio) {
			return;
		}
		this.value = radio.value;
		this.change.emit(new RadioChange(radio, radio.value));
		this.onChange(radio.value);
		this.onTouched();
	}

	isTemplate(value: unknown): value is TemplateRef<any> {
		return value instanceof TemplateRef;
	}

	protected onDisabledChange() {
		this.updateRadios();
	}

	protected updateRadios() {
		this.radios?.forEach(radio => {
			radio.name = this.name;
			radio.checked = radio.value === this._value;
			radio.setDisabledFromGroup(this.disabled);
		});
		this.changeDetectorRef.markForCheck();
	}
}
