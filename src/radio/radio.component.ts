import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output,
	TemplateRef,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/radio-button/index.js";
import { TemplateSlot } from "carbon-components-angular/utils";
import { RadioChange } from "./radio-change.class";

/**
 * Renders the `<cds-radio-button>` web component. Use inside `cds-radio-group`.
 *
 * [See demo](../../?path=/story/components-radio--basic)
 */
@Component({
	selector: "cds-radio",
	template: `
		<cds-radio-button
			[id]="id"
			[checked]="checked"
			[disabled]="disabled || disabledFromGroup"
			[name]="name"
			[required]="required"
			[value]="stringValue"
			[labelPosition]="labelPlacement"
			[attr.aria-label]="ariaLabel || null"
			[attr.aria-labelledby]="ariaLabelledby || null"
			(cds-radio-button-changed)="onChanged($event)">
			<ng-content />
			<ng-container cdsSlot="ai-label" [cdsSlotTemplate]="decorator" />
		</cds-radio-button>
	`,
	styles: [":host { display: contents; }"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Radio {
	static radioCount = 0;

	@Input() set checked(value: boolean) {
		this._checked = value;
		this.changeDetectorRef.markForCheck();
	}
	get checked() {
		return this._checked;
	}
	@Input() set name(value: string) {
		this._name = value;
		this.changeDetectorRef.markForCheck();
	}
	get name() {
		return this._name;
	}
	@Input() disabled = false;
	@Input() labelPlacement: "right" | "left" = "right";
	@Input() ariaLabelledby: string;
	@Input() ariaLabel: string;
	@Input() required = false;
	/**
	 * Any value; the web component receives it as a string.
	 */
	@Input() value: any;
	@Input() id = `radio-${Radio.radioCount++}`;
	@Input() decorator: TemplateRef<any>;
	/**
	 * @deprecated use `<cds-radio-button-skeleton>` instead.
	 */
	@Input() skeleton = false;

	// eslint-disable-next-line @angular-eslint/no-output-native
	@Output() change = new EventEmitter<RadioChange>();

	disabledFromGroup = false;
	protected changeDetectorRef = inject(ChangeDetectorRef);
	protected _checked = false;
	protected _name = "";

	get stringValue() {
		return this.value === undefined || this.value === null ? "" : String(this.value);
	}

	setDisabledFromGroup(disabled: boolean) {
		this.disabledFromGroup = disabled;
		this.changeDetectorRef.markForCheck();
	}

	onChanged(event: Event) {
		this.checked = (event.target as any).checked;
		if (this.checked) {
			this.change.emit(new RadioChange(this, this.value));
		}
	}
}
