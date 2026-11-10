import {
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
import "@carbon/web-components/es/components/radio-button/index.js";
import { registerWrapper, TemplateSlot } from "carbon-components-angular/utils";
import { RadioChange } from "./radio-change.class";

/**
 * Adds Angular inputs/outputs to the `<cds-radio-button>` web component.
 * Use inside `<cds-radio-button-group>`, which sets `name`, `checked` and its `disabled` state.
 *
 * `value` can be any value; non-primitive values get a generated string for the web component.
 *
 * [See demo](../../?path=/story/components-radio--basic)
 */
@Component({
	selector: "cds-radio-button",
	template: `
		<ng-content />
		<ng-container cdsSlot="ai-label" [cdsSlotTemplate]="decorator" />
	`,
	host: {
		"[id]": "id",
		"[checked]": "checked",
		"[disabled]": "disabled",
		"[required]": "required",
		"[value]": "stringValue",
		"[labelPosition]": "labelPlacement",
		"[attr.aria-label]": "ariaLabel || null",
		"[attr.aria-labelledby]": "ariaLabelledby || null",
		"(cds-radio-button-changed)": "onChanged()"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Radio {
	static radioCount = 0;

	@Input() checked = false;
	@Input() disabled = false;
	@Input() labelPlacement: "right" | "left" = "right";
	@Input() ariaLabelledby: string;
	@Input() ariaLabel: string;
	@Input() required = false;
	@Input() id = `radio-${Radio.radioCount++}`;
	@Input() set value(value: any) {
		this._value = value;
		const primitive = value === null || value === undefined || typeof value !== "object";
		this.stringValue = primitive ? String(value ?? "") : `${this.id}-value`;
	}
	get value() {
		return this._value;
	}
	@Input() decorator: TemplateRef<any>;

	// eslint-disable-next-line @angular-eslint/no-output-native
	@Output() change = new EventEmitter<RadioChange>();

	/**
	 * The value given to the web component.
	 */
	stringValue = "";
	protected _value: any;
	protected element = inject(ElementRef).nativeElement;

	constructor() {
		registerWrapper(this.element, this);
	}

	onChanged() {
		this.checked = this.element.checked;
		if (this.checked) {
			this.change.emit(new RadioChange(this, this.value));
		}
	}
}

/**
 * The `<cds-radio-button-skeleton>` web component.
 */
@Component({
	selector: "cds-radio-button-skeleton",
	template: "",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RadioSkeleton {}
