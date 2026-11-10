import {
	ChangeDetectionStrategy,
	CUSTOM_ELEMENTS_SCHEMA,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	TemplateRef,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/checkbox/index.js";
import {
	TemplateContent,
	TemplateSlot,
	WebComponentValueAccessor,
	provideValueAccessor
} from "carbon-components-angular/utils";
import { CheckboxValue } from "./checkbox.types";
import { CHECKBOX_GROUP_HOST } from "./checkbox-group-host";

/**
 * Defines the set of states for a checkbox component.
 */
export enum CheckboxState {
	Init,
	Indeterminate,
	Checked,
	Unchecked
}

/**
 * Wraps the `<cds-checkbox>` web component. Importing it registers the web component.
 *
 * ```typescript
 * import { Checkbox } from 'carbon-components-angular';
 * ```
 *
 * [See demo](../../?path=/story/components-checkbox--basic)
 */
@Component({
	selector: "cds-checkbox",
	template: `
		<ng-content />
		<ng-container cdsSlot="decorator" [cdsSlotTemplate]="decorator" />
	`,
	host: {
		"[id]": "id",
		"[name]": "name",
		"[value]": "value",
		"[title]": "title",
		"[checked]": "checked",
		"[indeterminate]": "indeterminate",
		"[disabled]": "disabled",
		"[hideLabel]": "hideLabel",
		"[attr.readonly]": "effectiveReadOnly ? '' : null",
		"[invalid]": "effectiveInvalid",
		"[warn]": "effectiveWarn",
		"[helperText]": "content.render('helperText', helperText)",
		"[invalidText]": "content.render('invalidText', invalidText)",
		"[warnText]": "content.render('warnText', warnText)",
		"[attr.required]": "required ? '' : null",
		"[attr.aria-label]": "ariaLabel || null",
		"[attr.aria-labelledby]": "ariaLabelledby || null",
		"(cds-checkbox-changed)": "onCheckboxChanged($event)"
	},
	providers: [provideValueAccessor(() => Checkbox)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Checkbox extends WebComponentValueAccessor<boolean> {
	static checkboxCount = 0;

	/**
	 * @deprecated the web component has no skeleton state. Use `<cds-checkbox-skeleton>` instead.
	 */
	@Input() skeleton = false;
	/**
	 * Set to `true` to hide the checkbox label.
	 */
	@Input() hideLabel = false;
	@Input() name: string;
	@Input() id = `checkbox-${Checkbox.checkboxCount++}`;
	@Input() required: boolean;
	@Input() value: CheckboxValue;
	@Input() ariaLabel: string;
	@Input() ariaLabelledby: string;
	@Input() title = "";
	/**
	 * Helper text below the label. Hidden while `invalid` or `warn` is `true`.
	 */
	@Input() helperText: string | TemplateRef<any>;
	/**
	 * Inherits the parent `cds-checkbox-group` value when not set.
	 */
	@Input() invalid?: boolean;
	@Input() invalidText: string | TemplateRef<any>;
	/**
	 * Inherits the parent `cds-checkbox-group` value when not set.
	 */
	@Input() warn?: boolean;
	@Input() warnText: string | TemplateRef<any>;
	/**
	 * Inherits the parent `cds-checkbox-group` value when not set.
	 */
	@Input() readOnly?: boolean;
	/**
	 * Optional `TemplateRef` (e.g. AI label) rendered next to the label.
	 */
	@Input() decorator: TemplateRef<any>;
	/**
	 * Supports two-way binding with `indeterminateChange`.
	 */
	@Input() indeterminate = false;
	/**
	 * Supports two-way binding with `checkedChange`.
	 */
	@Input() checked = false;

	/**
	 * When observed, clicks no longer toggle the checkbox so the parent can control
	 * `checked`/`indeterminate` itself.
	 */
	// eslint-disable-next-line @angular-eslint/no-output-native
	@Output() click = new EventEmitter<void>();
	@Output() checkedChange = new EventEmitter<boolean>();
	@Output() indeterminateChange = new EventEmitter<boolean>();

	protected content = new TemplateContent();
	private hostGroup = inject(CHECKBOX_GROUP_HOST, { optional: true });

	private element = inject(ElementRef).nativeElement;

	constructor() {
		super();
		// A host `(click)` listener would also subscribe to the `click` output,
		// so listen to the native event directly.
		this.element.addEventListener("click", (event: MouseEvent) => this.onClick(event));
	}

	get effectiveReadOnly() {
		return !!(this.readOnly ?? this.hostGroup?.readOnly);
	}

	get effectiveInvalid() {
		return !!(this.invalid ?? this.hostGroup?.invalid);
	}

	get effectiveWarn() {
		return !!(this.warn ?? this.hostGroup?.warn);
	}

	/**
	 * Flips the checked state and resets `indeterminate`.
	 */
	toggle() {
		if (!this.effectiveReadOnly) {
			this.setChecked(!this.checked);
		}
	}

	writeValue(value: boolean) {
		this.setChecked(!!value);
	}

	markForCheckFromGroup() {
		// The web component group copies its `readonly` onto every child, so re-apply our own.
		this.element.readonly = this.effectiveReadOnly;
		this.changeDetectorRef.markForCheck();
	}

	onCheckboxChanged(event: Event) {
		this.setChecked((event as CustomEvent<{ checked: boolean }>).detail.checked);
		this.checkedChange.emit(this.checked);
		this.onChange(this.checked);
	}

	onClick(event: MouseEvent) {
		if (this.click.observed) {
			event.preventDefault();
			this.click.emit();
		}
	}

	private setChecked(checked: boolean) {
		if (checked === this.checked) {
			return;
		}
		this.checked = checked;
		if (this.indeterminate) {
			this.indeterminate = false;
			this.indeterminateChange.emit(false);
		}
		this.changeDetectorRef.markForCheck();
	}
}
