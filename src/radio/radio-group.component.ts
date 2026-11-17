import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output,
	TemplateRef
} from "@angular/core";
import "@carbon/web-components/es/components/radio-button/index.js";
import {
	provideValueAccessor,
	TemplateContent,
	TemplateSlot,
	WebComponentValueAccessor
} from "carbon-components-angular/utils";
import { RadioChange } from "./radio-change.class";

/**
 * Adds `ngModel` / reactive forms, `[(value)]` and Angular outputs to the
 * `<cds-radio-button-group>` web component. The value is the `value` of the checked
 * `cds-radio-button`. The web component passes `name`, `disabled`, `orientation` and
 * `labelPosition` on to its radios and checks the radio whose `value` matches.
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
		"[value]": "value",
		"[disabled]": "!!disabled",
		"[orientation]": "orientation",
		"[labelPosition]": "labelPlacement",
		"[legendText]": "legend",
		"[helperText]": "content.render('helperText', helperText)",
		"[invalid]": "invalid",
		"[invalidText]": "content.render('invalidText', invalidText)",
		"[warn]": "warn",
		"[warnText]": "content.render('warnText', warnText)",
		"(cds-radio-button-group-changed)": "onGroupChanged($event)"
	},
	providers: [provideValueAccessor(() => RadioGroup)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RadioGroup extends WebComponentValueAccessor<string> {
	static radioGroupCount = 0;

	/**
	 * The `value` of the checked radio. Supports two-way binding with `valueChange`. Unset, a
	 * radio's own `checked` decides.
	 */
	@Input() value: string | null | undefined;
	@Input() name = `radio-group-${RadioGroup.radioGroupCount++}`;
	@Input() orientation: "horizontal" | "vertical" = "horizontal";
	@Input() labelPlacement: "right" | "left" = "right";
	@Input() legend: string;
	@Input() decorator: TemplateRef<any>;
	@Input() helperText: string | TemplateRef<any>;
	@Input({ transform: booleanAttribute }) invalid = false;
	@Input() invalidText: string | TemplateRef<any>;
	@Input({ transform: booleanAttribute }) warn = false;
	@Input() warnText: string | TemplateRef<any>;

	// eslint-disable-next-line @angular-eslint/no-output-native
	@Output() change = new EventEmitter<RadioChange>();
	@Output() valueChange = new EventEmitter<string>();

	/**
	 * The checked `cds-radio-button` element, if any.
	 */
	get selected(): HTMLElement | null {
		return this.element.querySelector("cds-radio-button[checked]");
	}

	protected content = new TemplateContent();

	writeValue(value: string) {
		this.value = value;
		this.changeDetectorRef.markForCheck();
	}

	onGroupChanged(event: Event) {
		if (event.target !== this.element) {
			return;
		}
		this.value = (event as CustomEvent<{ value: string }>).detail.value;
		this.change.emit(new RadioChange(this.selected, this.value));
		this.valueChange.emit(this.value);
		this.onChange(this.value);
		this.onTouched();
	}
}
