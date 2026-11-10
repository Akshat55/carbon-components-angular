import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	DestroyRef,
	EventEmitter,
	Input,
	Output,
	TemplateRef,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/radio-button/index.js";
import {
	observeChildren,
	provideValueAccessor,
	TemplateContent,
	TemplateSlot,
	WebComponentValueAccessor,
	wrapperOf
} from "carbon-components-angular/utils";
import { Radio } from "./radio.component";
import { RadioChange } from "./radio-change.class";

/**
 * Adds `ngModel` / reactive forms and Angular outputs to the `<cds-radio-button-group>`
 * web component. The value is the selected radio's `value` (any type for `cds-radio-button`s
 * with the Angular `value` input).
 *
 * The radios are read from the DOM, so radios from templates, `@for`, `createComponent`
 * or plain markup all work.
 *
 * [See demo](../../?path=/story/components-radio--basic)
 */
@Component({
	selector: "cds-radio-button-group",
	template: `
		<ng-container cdsSlot="ai-label" [cdsSlotTemplate]="decorator" />
		<ng-content />
	`,
	host: {
		"[name]": "name",
		"[disabled]": "disabled",
		"[orientation]": "orientation",
		"[labelPosition]": "labelPlacement",
		"[legendText]": "legend",
		"[helperText]": "content.render('helperText', helperText)",
		"[invalid]": "invalid",
		"[invalidText]": "content.render('invalidText', invalidText)",
		"[warn]": "warn",
		"[warnText]": "content.render('warnText', warnText)",
		"(cds-radio-button-group-changed)": "onGroupChanged()"
	},
	providers: [provideValueAccessor(() => RadioGroup)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RadioGroup extends WebComponentValueAccessor {
	static radioGroupCount = 0;

	@Input() set value(value: any) {
		this._value = value;
		this.hasValue = true;
		this.sync();
	}
	get value() {
		return this._value;
	}

	@Input() name = `radio-group-${RadioGroup.radioGroupCount++}`;
	@Input() orientation: "horizontal" | "vertical" = "horizontal";
	@Input() labelPlacement: "right" | "left" = "right";
	@Input() legend: string;
	@Input() decorator: TemplateRef<any>;
	@Input() helperText: string | TemplateRef<any>;
	@Input() invalid = false;
	@Input() invalidText: string | TemplateRef<any>;
	@Input() warn = false;
	@Input() warnText: string | TemplateRef<any>;

	// eslint-disable-next-line @angular-eslint/no-output-native
	@Output() change = new EventEmitter<RadioChange>();

	/**
	 * The selected `Radio` (`null` when nothing is selected or it has no Angular instance).
	 */
	get selected(): Radio | null {
		const element = this.radios().find(radio => radio.checked);
		return element ? wrapperOf(element, Radio) : null;
	}

	protected content = new TemplateContent();
	protected _value: any = null;
	/**
	 * `false` until a value is set; until then a pre-checked radio provides it.
	 */
	protected hasValue = false;

	constructor() {
		super();
		// The web component only updates the radios it has when its own properties change.
		observeChildren(this.element, inject(DestroyRef), () => this.sync());
	}

	writeValue(value: any) {
		this.value = value;
	}

	onGroupChanged() {
		const element = this.radios().find(radio => radio.checked);
		if (!element) {
			return;
		}
		this._value = this.valueOf(element);
		this.hasValue = true;
		this.change.emit(new RadioChange(wrapperOf(element, Radio), this._value));
		this.onChange(this._value);
		this.onTouched();
	}

	protected onDisabledChange() {
		this.sync();
	}

	protected radios(): any[] {
		return Array.from(this.element.querySelectorAll("cds-radio-button"));
	}

	protected valueOf(element: any) {
		const radio = wrapperOf(element, Radio);
		return radio ? radio.value : element.value;
	}

	/**
	 * Pushes the group's state to every radio, including ones added after the group rendered.
	 */
	protected sync() {
		const radios = this.radios();
		if (!this.hasValue) {
			const checked = radios.find(radio => radio.checked);
			if (checked) {
				this._value = this.valueOf(checked);
				this.hasValue = true;
			}
		}
		for (const radio of radios) {
			radio.name = this.name;
			radio.checked = this.hasValue && this.valueOf(radio) === this._value;
			// Remember which radios the group disabled, so enabling the group restores the rest.
			if (this.disabled && !radio.disabled) {
				radio.disabled = true;
				radio.toggleAttribute("data-group-disabled", true);
			} else if (!this.disabled && radio.hasAttribute("data-group-disabled")) {
				radio.disabled = false;
				radio.removeAttribute("data-group-disabled");
			}
		}
		this.element.value = radios.find(radio => radio.checked)?.value ?? "";
	}
}
