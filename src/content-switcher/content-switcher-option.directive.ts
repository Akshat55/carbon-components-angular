import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/content-switcher/index.js";

/**
 * Wraps the `<cds-content-switcher-item>` web component.
 */
@Component({
	selector: "cds-content-switcher-item",
	template: "<ng-content />",
	host: {
		"[value]": "name",
		"[selected]": "active",
		"[disabled]": "disabled",
		"(click)": "onClick.emit($event)",
		"(focus)": "onFocus.emit($event)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContentSwitcherOption {
	@Input() set active(value: boolean) {
		this._active = value;
		this.changeDetectorRef.markForCheck();
	}
	get active() {
		return this._active;
	}
	/**
	 * Value of the option.
	 */
	@Input() name = "option";
	@Input() disabled = false;

	@Output() selected = new EventEmitter<boolean>();
	// eslint-disable-next-line @angular-eslint/no-output-on-prefix
	@Output() onClick = new EventEmitter<MouseEvent>();
	// eslint-disable-next-line @angular-eslint/no-output-on-prefix
	@Output() onFocus = new EventEmitter<FocusEvent>();

	readonly element: HTMLElement = inject(ElementRef).nativeElement;
	protected changeDetectorRef = inject(ChangeDetectorRef);
	protected _active = false;
}
