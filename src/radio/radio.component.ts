import {
	booleanAttribute,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
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
import { observeAttributes, TemplateSlot } from "carbon-components-angular/utils";
import { RadioChange } from "./radio-change.class";

/**
 * Adds Angular inputs/outputs to the `<cds-radio-button>` web component.
 * Use inside `<cds-radio-button-group>`, which sets `name`, `checked` and its `disabled` state.
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
		"[value]": "value",
		"[labelPosition]": "labelPlacement",
		"[attr.aria-label]": "ariaLabel || null",
		"[attr.aria-labelledby]": "ariaLabelledby || null",
		"(cds-radio-button-changed)": "onChanged($event)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Radio {
	static radioCount = 0;

	@Input({ transform: booleanAttribute }) checked = false;
	@Input({ transform: booleanAttribute }) disabled = false;
	@Input() labelPlacement: "right" | "left" = "right";
	@Input() ariaLabelledby: string;
	@Input() ariaLabel: string;
	@Input({ transform: booleanAttribute }) required = false;
	@Input() id = `radio-${Radio.radioCount++}`;
	@Input() value = "";
	@Input() decorator: TemplateRef<any>;

	// eslint-disable-next-line @angular-eslint/no-output-native
	@Output() change = new EventEmitter<RadioChange>();

	@Output() checkedChange = new EventEmitter<boolean>();

	protected element = inject(ElementRef).nativeElement;
	protected changeDetectorRef = inject(ChangeDetectorRef);

	constructor() {
		// The group unchecks the other radios; the web component reflects `checked`.
		observeAttributes(this.element, ["checked"], () => this.setChecked(this.element.checked));
	}

	onChanged(event: Event) {
		// The web component fires the event twice, and the group's radios bubble theirs.
		if (event.target === this.element && this.setChecked(this.element.checked) && this.checked) {
			this.change.emit(new RadioChange(this.element, this.value));
		}
	}

	/**
	 * Returns `false` when the state didn't change.
	 */
	private setChecked(checked: boolean) {
		if (checked === this.checked) {
			return false;
		}
		this.checked = checked;
		this.checkedChange.emit(checked);
		this.changeDetectorRef.markForCheck();
		return true;
	}
}

@Component({
	selector: "cds-radio-button-skeleton",
	template: "",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RadioSkeleton {}
