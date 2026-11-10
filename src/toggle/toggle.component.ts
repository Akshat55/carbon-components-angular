import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output,
	TemplateRef,
	DestroyRef,
	inject
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { isObservable, Observable } from "rxjs";
import "@carbon/web-components/es/components/toggle/index.js";
import { I18n } from "carbon-components-angular/i18n";
import { provideValueAccessor, TemplateSlot, WebComponentValueAccessor } from "carbon-components-angular/utils";

/**
 * Wraps the `<cds-toggle>` web component. Supports `[(checked)]` and `ngModel` / reactive forms.
 *
 * [See demo](../../?path=/story/components-toggle--basic)
 */
@Component({
	selector: "cds-toggle",
	template: `<ng-container cdsSlot="label-text" [cdsSlotTemplate]="isTemplate(label) ? label : null" />`,
	host: {
		"[id]": "id",
		"[toggled]": "checked",
		"[disabled]": "disabled",
		"[size]": "size",
		"[hideLabel]": "hideLabel",
		"[labelText]": "isTemplate(label) ? '' : label",
		"[labelA]": "onTextLabel",
		"[labelB]": "offTextLabel",
		"[attr.aria-label]": "ariaLabel || null",
		"(cds-toggle-changed)": "onToggled($event)"
	},
	providers: [provideValueAccessor(() => Toggle)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Toggle extends WebComponentValueAccessor<boolean> {
	static toggleCount = 0;

	public i18n = inject(I18n);

	@Input() checked = false;
	/**
	 * Text shown when off. Defaults to the `TOGGLE.OFF` i18n value.
	 */
	@Input() set offText(value: string | Observable<string>) {
		this._offText = value;
		this.resolveText(value, text => this.offTextLabel = text);
	}
	get offText() {
		return this._offText;
	}
	/**
	 * Text shown when on. Defaults to the `TOGGLE.ON` i18n value.
	 */
	@Input() set onText(value: string | Observable<string>) {
		this._onText = value;
		this.resolveText(value, text => this.onTextLabel = text);
	}
	get onText() {
		return this._onText;
	}
	@Input() label: string | TemplateRef<any>;
	@Input() size: "sm" | "md" = "md";
	@Input() hideLabel = false;
	@Input() ariaLabel: string;
	@Input() id = `toggle-${Toggle.toggleCount++}`;
	/**
	 * @deprecated use `<cds-toggle-skeleton>` instead.
	 */
	@Input() skeleton = false;

	@Output() checkedChange = new EventEmitter<boolean>();

	protected onTextLabel: string = this.i18n.get().TOGGLE.ON;
	protected offTextLabel: string = this.i18n.get().TOGGLE.OFF;
	protected _onText: string | Observable<string> = this.onTextLabel;
	protected _offText: string | Observable<string> = this.offTextLabel;
	private destroyRef = inject(DestroyRef);

	writeValue(value: boolean) {
		this.checked = !!value;
		this.changeDetectorRef.markForCheck();
	}

	onToggled(event: Event) {
		this.checked = (event as CustomEvent<{ toggled: boolean }>).detail.toggled;
		this.checkedChange.emit(this.checked);
		this.onChange(this.checked);
	}

	isTemplate(value: unknown): value is TemplateRef<any> {
		return value instanceof TemplateRef;
	}

	private resolveText(value: string | Observable<string>, assign: (text: string) => void) {
		if (isObservable(value)) {
			value.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(text => {
				assign(text);
				this.changeDetectorRef.markForCheck();
			});
		} else {
			assign(value);
		}
	}

}
