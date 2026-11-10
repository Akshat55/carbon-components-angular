import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output,
	TemplateRef
} from "@angular/core";
import "@carbon/web-components/es/components/time-picker/index.js";
import { provideValueAccessor, TemplateContent, TemplateSlot, WebComponentValueAccessor } from "carbon-components-angular/utils";

/**
 * Renders the `<cds-time-picker>` web component. Project `cds-timepicker-select`s for AM/PM etc.
 * Works with `ngModel` / reactive forms.
 *
 * [See demo](../../?path=/story/components-time-picker--basic)
 */
@Component({
	selector: "cds-timepicker",
	template: `
		<cds-time-picker
			[id]="id"
			[value]="value ?? ''"
			[labelText]="isTemplate(label) ? '' : label"
			[hideLabel]="hideLabel"
			[placeholder]="placeholder"
			[pattern]="pattern"
			[maxLength]="maxLength"
			[size]="size"
			[disabled]="disabled"
			[invalid]="invalid"
			[invalidText]="content.render('invalidText', invalidText)"
			(input)="onInput($event)">
			<ng-container cdsSlot="label-text" [cdsSlotTemplate]="isTemplate(label) ? label : null" />
			<ng-content />
		</cds-time-picker>
	`,
	styles: [":host { display: block; }"],
	providers: [provideValueAccessor(() => TimePicker)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimePicker extends WebComponentValueAccessor<string> {
	static timePickerCount = 0;

	@Input() invalid = false;
	@Input() invalidText: string | TemplateRef<any>;
	@Input() label: string | TemplateRef<any>;
	@Input() hideLabel = false;
	@Input() placeholder = "hh:mm";
	@Input() pattern = "(1[012]|[0-9]):[0-5][0-9]";
	@Input() id = `timepicker-${TimePicker.timePickerCount++}`;
	@Input() value: string;
	@Input() maxLength = 5;
	@Input() size: "sm" | "md" | "lg" = "md";
	/**
	 * @deprecated use `<cds-time-picker-skeleton>` instead.
	 */
	@Input() skeleton = false;
	/**
	 * @deprecated the web component follows the surrounding theme / layer.
	 */
	@Input() theme: "light" | "dark" = "dark";

	@Output() valueChange: EventEmitter<string> = new EventEmitter();

	protected content = new TemplateContent();

	writeValue(value: string) {
		this.value = value;
		this.changeDetectorRef.markForCheck();
	}

	onInput(event: Event) {
		this.value = (event.target as HTMLInputElement).value;
		this.onChange(this.value);
		this.valueChange.emit(this.value);
	}

	isTemplate(value: unknown): value is TemplateRef<any> {
		return value instanceof TemplateRef;
	}
}
