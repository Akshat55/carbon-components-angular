/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsDefinitionTooltipDirective
 *
 * Sits directly on <cds-definition-tooltip> — the web component replacement
 * for the old Angular DefinitionTooltip.
 *
 * Backwards-compatible API surface:
 *   [definition]  → portalled into the web component's `definition` slot (string only)
 *   [align]       → align attribute
 *   [isOpen]      → default-open attribute
 *   [openOnHover] → open-on-hover attribute
 */
import {
	Directive,
	ElementRef,
	Input,
	OnChanges,
	TemplateRef
} from "@angular/core";

@Directive({
	selector: "cds-definition-tooltip, [cdsDefinitionTooltip], [ibmDefinitionTooltip]",
	standalone: true
})
export class CdsDefinitionTooltipDirective implements OnChanges {
	/** Definition content (string only). */
	@Input() definition: string | TemplateRef<any>;

	/** Tooltip alignment. */
	@Input() align: string = "bottom";

	/** Show the definition initially. */
	@Input() isOpen = false;

	/** Open on hover in addition to click. */
	@Input() openOnHover = false;

	private _slot: HTMLElement | null = null;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		el.setAttribute("align", this.align);

		this._setBoolAttr("default-open", this.isOpen);
		this._setBoolAttr("open-on-hover", this.openOnHover);

		if (typeof this.definition === "string") {
			if (!this._slot) {
				this._slot = document.createElement("span");
				this._slot.setAttribute("slot", "definition");
				el.appendChild(this._slot);
			}
			this._slot.textContent = this.definition;
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
