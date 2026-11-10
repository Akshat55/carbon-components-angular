/**
 * Copyright IBM Corp. 2024
 *
 * Directives: CdsContentSwitcherDirective / CdsContentSwitcherItemDirective
 *
 * Sit directly on <cds-content-switcher> / <cds-content-switcher-item> —
 * the web component replacements for the old Angular ContentSwitcher
 * component and `[cdsContentOption]` directive.
 *
 * Backwards-compatible API surface:
 *   Switcher: [size]      → size attribute
 *             [lowContrast] → low-contrast attribute
 *             (selected)  ← bridged from `cds-content-switcher-selected`
 *   Item:     [name]      → value attribute
 *             [active]    → selected attribute
 *             [disabled]  → disabled attribute
 */
import {
	Directive,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnChanges,
	Output
} from "@angular/core";

@Directive({
	selector: "cds-content-switcher, [cdsContentSwitcher], [ibmContentSwitcher]",
	standalone: true
})
export class CdsContentSwitcherDirective implements OnChanges {
	/** Size of the switcher. */
	@Input() size: "sm" | "md" | "lg" = "md";

	/** Low-contrast styling. */
	@Input() lowContrast = false;

	/** Currently selected value. */
	@Input() value: string;

	/** Emits `{value, item}` when the selection changes. */
	@Output() selected = new EventEmitter<any>();

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;
		el.setAttribute("size", this.size);
		if (this.value !== undefined && this.value !== null) {
			el.setAttribute("value", this.value);
		}
		if (this.lowContrast) {
			el.setAttribute("low-contrast", "");
		} else {
			el.removeAttribute("low-contrast");
		}
	}

	/** Bridge the web component's select event → `(selected)` output. */
	@HostListener("cds-content-switcher-selected", ["$event"])
	onSelected(event: CustomEvent): void {
		const item = event.detail?.item;
		const value = item?.value ?? item?.getAttribute?.("value");
		this.value = value;
		this.selected.emit({ value, item });
	}
}

@Directive({
	selector: "cds-content-switcher-item, [cdsContentOption], [ibmContentOption]",
	standalone: true
})
export class CdsContentSwitcherItemDirective implements OnChanges {
	/** Value identifying this option (previously `name`). */
	@Input() name = "option";

	/** Whether this option is selected. */
	@Input() active = false;

	/** Set to `true` to disable this option. */
	@Input() disabled = false;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;
		el.setAttribute("value", this.name);

		if (this.active) {
			el.setAttribute("selected", "");
		} else {
			el.removeAttribute("selected");
		}
		if (this.disabled) {
			el.setAttribute("disabled", "");
		} else {
			el.removeAttribute("disabled");
		}
	}
}
