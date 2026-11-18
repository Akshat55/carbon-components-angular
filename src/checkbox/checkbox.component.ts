import {
	booleanAttribute,
	ChangeDetectionStrategy,
	CUSTOM_ELEMENTS_SCHEMA,
	Component,
	EventEmitter,
	Input,
	Output,
	TemplateRef
} from "@angular/core";
import "@carbon/web-components/es/components/checkbox/index.js";
import {
	provideValueAccessor,
	TemplateContent,
	TemplateSlot,
	WebComponentValueAccessor
} from "carbon-components-angular/utils";
import { CheckboxValue } from "./checkbox.types";

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
 * Adds Angular inputs and outputs to the `<cds-checkbox>` web component. Importing it registers the web component.
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
		"[name]": "name ?? element.name",
		"[value]": "value ?? element.value",
		"[title]": "title ?? element.title",
		"[checked]": "checked ?? element.checked",
		"[indeterminate]": "indeterminate ?? element.indeterminate",
		"[disabled]": "disabled ?? element.disabled",
		"[hideLabel]": "hideLabel ?? element.hideLabel",
		"[invalid]": "invalid ?? element.invalid",
		"[warn]": "warn ?? element.warn",
		"[helperText]": "content.render('helperText', helperText)",
		"[invalidText]": "content.render('invalidText', invalidText)",
		"[warnText]": "content.render('warnText', warnText)",
		"[attr.required]": "required ? '' : null",
		"[attr.aria-label]": "ariaLabel || null",
		"[attr.aria-labelledby]": "ariaLabelledby || null",
		"[attr.readonly]": "readOnly ? '' : null",
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
	 * Set to `true` to hide the checkbox label.
	 */
	@Input({ transform: booleanAttribute }) hideLabel?: boolean;
	@Input() name: string;
	@Input() id = `checkbox-${Checkbox.checkboxCount++}`;
	@Input({ transform: booleanAttribute }) required: boolean;
	@Input() value: CheckboxValue;
	@Input() ariaLabel: string;
	@Input() ariaLabelledby: string;
	@Input() title?: string;
	/**
	 * Helper text below the label. Hidden while `invalid` or `warn` is `true`.
	 */
	@Input() helperText: string | TemplateRef<any>;
	/**
	 * A `cds-checkbox-group`'s `invalid` marks the whole group instead.
	 */
	@Input({ transform: booleanAttribute }) invalid?: boolean;
	@Input() invalidText: string | TemplateRef<any>;
	@Input({ transform: booleanAttribute }) warn?: boolean;
	@Input() warnText: string | TemplateRef<any>;
	/**
	 * Unset, the checkbox follows its `cds-checkbox-group`'s `readOnly`.
	 */
	@Input({ transform: booleanAttribute }) readOnly?: boolean;
	/**
	 * Optional `TemplateRef` (e.g. AI label) rendered next to the label.
	 */
	@Input() decorator: TemplateRef<any>;
	/**
	 * Supports two-way binding with `indeterminateChange`.
	 */
	@Input({ transform: booleanAttribute }) indeterminate?: boolean;
	/**
	 * Supports two-way binding with `checkedChange`.
	 */
	@Input({ transform: booleanAttribute }) checked?: boolean;

	/**
	 * When observed, clicks no longer toggle the checkbox so the parent can control
	 * `checked`/`indeterminate` itself.
	 */
	// eslint-disable-next-line @angular-eslint/no-output-native
	@Output() click = new EventEmitter<void>();
	@Output() checkedChange = new EventEmitter<boolean>();
	@Output() indeterminateChange = new EventEmitter<boolean>();

	protected content = new TemplateContent();

	constructor() {
		super();
		// A host `(click)` listener would also subscribe to the `click` output,
		// so listen to the native event directly.
		this.element.addEventListener("click", (event: MouseEvent) => this.onClick(event));
	}

	/**
	 * Flips the checked state and resets `indeterminate`.
	 */
	toggle() {
		if (!this.element.readonly) {
			this.setChecked(!this.element.checked);
		}
	}

	writeValue(value: boolean) {
		this.setChecked(!!value, false);
	}

	onCheckboxChanged(event: Event) {
		if (this.setChecked((event as CustomEvent<{ checked: boolean }>).detail.checked)) {
			this.checkedChange.emit(this.checked);
			this.onChange(this.checked);
		}
	}

	onClick(event: MouseEvent) {
		if (this.click.observed) {
			event.preventDefault();
			this.click.emit();
		}
	}

	/**
	 * Returns `false` when the state didn't change.
	 */
	private setChecked(checked: boolean, resetIndeterminate = true) {
		// Compared with our own copy: the web component already changed by the time it fires.
		if (checked === this.checked) {
			return false;
		}
		this.checked = checked;
		if (resetIndeterminate && this.indeterminate) {
			this.indeterminate = false;
			this.indeterminateChange.emit(false);
		}
		this.changeDetectorRef.markForCheck();
		return true;
	}
}
