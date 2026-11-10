/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsButtonDirective
 *
 * Sits directly on <cds-button> — no wrapper element, no extra DOM node.
 * Translates the old carbon-components-angular `Button` directive @Inputs to
 * web component attributes.
 *
 * Backwards-compatible API surface (matches carbon-components-angular):
 *   [cdsButton]     → kind attribute ('primary' | 'secondary' | … | 'danger--ghost')
 *   [size]          → size attribute ('xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl')
 *   [isExpressive]  → isExpressive attribute
 *   [skeleton]      → renders <cds-button-skeleton> styling via attribute — prefer
 *                     the dedicated <cds-button-skeleton> element
 *   [disabled]      → disabled attribute
 *   [iconOnly]      → deprecated; use <cds-icon-button> instead
 */
import {
	Directive,
	ElementRef,
	Input,
	OnChanges
} from "@angular/core";
import { ButtonSize, ButtonType } from "./button.types";

@Directive({
	selector: "cds-button, [cdsButton], [ibmButton]",
	standalone: true
})
export class CdsButtonDirective implements OnChanges {
	/**
	 * @deprecated as of v5 - Use `cdsButton` input property instead
	 */
	@Input() set ibmButton(type: ButtonType) {
		this.cdsButton = type;
	}

	/**
	 * Sets the button kind.
	 * Accepts `ButtonType` or an empty string (equivalent to "primary").
	 */
	@Input() cdsButton: ButtonType | "" = "primary";

	/** Specify the size of the button. */
	@Input() size: ButtonSize;

	/** Set to `true` to disable the button. */
	@Input() disabled = false;

	/** Set to `true` for an "expressive" style button. */
	@Input() isExpressive = false;

	/**
	 * @deprecated use `<cds-button-skeleton>` — the web component ships a
	 * dedicated skeleton element. Kept so old bindings don't break the build.
	 */
	@Input() skeleton = false;

	/**
	 * @deprecated use `<cds-icon-button>` for icon-only buttons.
	 */
	@Input() iconOnly = false;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		// The web component's `kind` uses `danger-tertiary` / `danger-ghost`
		// where the old API used `danger--tertiary` / `danger--ghost`.
		const kind = (this.cdsButton || "primary").replace("--", "-");
		el.setAttribute("kind", kind);

		if (this.size) {
			el.setAttribute("size", this.size);
		}

		this._setBoolAttr("disabled", this.disabled);
		this._setBoolAttr("isExpressive", this.isExpressive);
	}

	private _setBoolAttr(name: string, value: boolean): void {
		if (value) {
			this._el.nativeElement.setAttribute(name, "");
		} else {
			this._el.nativeElement.removeAttribute(name);
		}
	}
}
