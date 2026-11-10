import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Directive,
	Input,
	TemplateRef
} from "@angular/core";
import "@carbon/web-components/es/components/text-input/index.js";
import "@carbon/web-components/es/components/textarea/index.js";
import "@carbon/web-components/es/components/password-input/index.js";
import { provideValueAccessor, TemplateContent, TemplateSlot, WebComponentValueAccessor } from "carbon-components-angular/utils";

/**
 * Shared inputs of the text-like web components (`cds-text-input`, `cds-textarea`, `cds-password-input`).
 */
@Directive({
	host: {
		"[label]": "isTemplate(label) ? '' : label",
		"[value]": "value ?? ''",
		"[placeholder]": "placeholder",
		"[disabled]": "disabled",
		"[attr.readonly]": "readonly ? '' : null",
		"[required]": "required",
		"[name]": "name",
		"[size]": "size",
		"[hideLabel]": "hideLabel",
		"[helperText]": "content.render('helperText', helperText)",
		"[invalid]": "invalid",
		"[invalidText]": "content.render('invalidText', invalidText)",
		"[warn]": "warn",
		"[warnText]": "content.render('warnText', warnText)",
		"[enableCounter]": "enableCounter",
		"[maxCount]": "maxCount",
		"[isFluid]": "fluid",
		"(input)": "onInput($event)"
	}
})
export abstract class BaseTextInput extends WebComponentValueAccessor<string> {
	@Input() label: string | TemplateRef<any>;
	@Input() value = "";
	@Input() placeholder = "";
	@Input() readonly = false;
	@Input() required = false;
	@Input() name: string;
	@Input() size: "sm" | "md" | "lg" = "md";
	@Input() hideLabel = false;
	@Input() helperText: string | TemplateRef<any>;
	@Input() invalid = false;
	@Input() invalidText: string | TemplateRef<any>;
	@Input() warn = false;
	@Input() warnText: string | TemplateRef<any>;
	/**
	 * Shows a character counter; set `maxCount` too.
	 */
	@Input() enableCounter = false;
	@Input() maxCount: number;
	@Input() fluid = false;

	protected content = new TemplateContent();

	writeValue(value: string) {
		this.value = value;
		this.changeDetectorRef.markForCheck();
	}

	onInput(event: Event) {
		this.value = (event.target as HTMLInputElement).value;
		this.onChange(this.value);
	}

	isTemplate(value: unknown): value is TemplateRef<any> {
		return value instanceof TemplateRef;
	}
}

/**
 * Wraps the `<cds-text-input>` web component. Works with `ngModel` / reactive forms.
 *
 * ```html
 * <cds-text-input label="Name" helperText="Your full name" [(ngModel)]="name" />
 * ```
 *
 * For a native `<input>`, the `cds-text-label` + `cdsText` pair is still available.
 *
 * [See demo](../../?path=/story/components-input--basic)
 */
@Component({
	selector: "cds-text-input",
	template: `
		<ng-container cdsSlot="label-text" [cdsSlotTemplate]="isTemplate(label) ? label : null" />
		<ng-content />
	`,
	host: {
		"[type]": "type",
		"[autocomplete]": "autocomplete"
	},
	providers: [provideValueAccessor(() => CdsTextInput)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CdsTextInput extends BaseTextInput {
	@Input() type = "text";
	@Input() autocomplete = "";
}

/**
 * Wraps the `<cds-textarea>` web component. Works with `ngModel` / reactive forms.
 *
 * [See demo](../../?path=/story/components-input-text-area--basic)
 */
@Component({
	selector: "cds-textarea",
	template: `
		<ng-container cdsSlot="label-text" [cdsSlotTemplate]="isTemplate(label) ? label : null" />
		<ng-content />
	`,
	host: {
		"[rows]": "rows",
		"[cols]": "cols"
	},
	providers: [provideValueAccessor(() => CdsTextarea)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CdsTextarea extends BaseTextInput {
	@Input() rows = 4;
	@Input() cols = 50;
}

/**
 * Wraps the `<cds-password-input>` web component. Works with `ngModel` / reactive forms.
 *
 * [See demo](../../?path=/story/components-input-password--basic)
 */
@Component({
	selector: "cds-password-input",
	template: `
		<ng-container cdsSlot="label-text" [cdsSlotTemplate]="isTemplate(label) ? label : null" />
		<ng-content />
	`,
	host: {
		"[showPasswordLabel]": "showPasswordLabel",
		"[hidePasswordLabel]": "hidePasswordLabel"
	},
	providers: [provideValueAccessor(() => CdsPasswordInput)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CdsPasswordInput extends BaseTextInput {
	@Input() showPasswordLabel = "Show password";
	@Input() hidePasswordLabel = "Hide password";
}
