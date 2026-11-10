/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsIconButtonDirective
 *
 * Sits directly on <cds-icon-button> — the web component replacement for the
 * old Angular `IconButton` component.
 *
 * Backwards-compatible API surface (matches carbon-components-angular IconButton):
 *   [kind]          → kind attribute
 *   [size]          → size attribute
 *   [type]          → type attribute
 *   [disabled]      → disabled attribute
 *   [isExpressive]  → isExpressive attribute
 *   [description]   → text routed into the `tooltip-content` slot (string only)
 *   [align]         → align attribute (tooltip alignment, from BaseIconButton)
 *   [enterDelayMs]  → enter-delay-ms attribute
 *   [leaveDelayMs]  → leave-delay-ms attribute
 */
import {
	Directive,
	ElementRef,
	Input,
	OnChanges,
	TemplateRef
} from "@angular/core";
import { ButtonSize, ButtonType } from "./button.types";

@Directive({
	selector: "cds-icon-button, [cdsIconButton], [ibmIconButton]",
	standalone: true
})
export class CdsIconButtonDirective implements OnChanges {
	/** Button kind. */
	@Input() kind: ButtonType = "primary";

	/** Button size. */
	@Input() size: ButtonSize = "lg";

	/** Button type attribute. */
	@Input() type = "button";

	/** Set to `true` to disable the button. */
	@Input() disabled = false;

	/** Set to `true` for an "expressive" style button. */
	@Input() isExpressive = false;

	/** Tooltip description (string only — TemplateRef not supported by the web component). */
	@Input() description: string | TemplateRef<any>;

	/** Tooltip alignment. */
	@Input() align: string = "top";

	/** Tooltip enter delay in ms. */
	@Input() enterDelayMs = 100;

	/** Tooltip leave delay in ms. */
	@Input() leaveDelayMs = 300;

	private _tooltipSlot: HTMLElement | null = null;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		el.setAttribute("kind", (this.kind || "primary").replace("--", "-"));
		el.setAttribute("size", this.size);
		el.setAttribute("type", this.type);
		el.setAttribute("align", this.align);
		el.setAttribute("enter-delay-ms", String(this.enterDelayMs));
		el.setAttribute("leave-delay-ms", String(this.leaveDelayMs));

		this._setBoolAttr("disabled", this.disabled);
		this._setBoolAttr("isExpressive", this.isExpressive);

		if (typeof this.description === "string") {
			if (!this._tooltipSlot) {
				this._tooltipSlot = document.createElement("span");
				this._tooltipSlot.setAttribute("slot", "tooltip-content");
				el.appendChild(this._tooltipSlot);
			}
			this._tooltipSlot.textContent = this.description;
		}
	}

	private _setBoolAttr(name: string, value: boolean): void {
		if (value) {
			this._el.nativeElement.setAttribute(name, "");
		} else {
			this._el.nativeElement.removeAttribute(name);
		}
	}
}
