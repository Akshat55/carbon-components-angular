/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsTooltipDirective
 *
 * Sits directly on <cds-tooltip> — the web component replacement for the old
 * Angular Tooltip component.
 *
 * The web component expects the trigger element in its default slot and a
 * <cds-tooltip-content> child for the tooltip text. To preserve the old
 * `[description]` string API, this directive creates the content element on
 * the fly.
 *
 * Backwards-compatible API surface:
 *   [description]  → portalled into a generated <cds-tooltip-content>
 *   [align]        → align attribute
 *   [autoAlign]    → autoalign attribute
 *   [isOpen]       → defaultOpen attribute
 *   [enterDelayMs] → enter-delay-ms attribute
 *   [leaveDelayMs] → leave-delay-ms attribute
 */
import {
	Directive,
	ElementRef,
	Input,
	OnChanges,
	TemplateRef
} from "@angular/core";

@Directive({
	selector: "cds-tooltip, [cdsTooltip], [ibmTooltip]",
	standalone: true
})
export class CdsTooltipDirective implements OnChanges {
	/** Tooltip text (string only — see MIGRATION notes in the doc comment). */
	@Input() description: string | TemplateRef<any>;

	/** Tooltip alignment relative to the trigger. */
	@Input() align: string = "top";

	/** Automatically re-align when there is not enough space. */
	@Input() autoAlign = false;

	/** Show the tooltip initially. */
	@Input() isOpen = false;

	/** Delay in ms before showing. */
	@Input() enterDelayMs = 100;

	/** Delay in ms before hiding. */
	@Input() leaveDelayMs = 300;

	private _content: HTMLElement | null = null;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		el.setAttribute("align", this.align);
		el.setAttribute("enter-delay-ms", String(this.enterDelayMs));
		el.setAttribute("leave-delay-ms", String(this.leaveDelayMs));

		this._setBoolAttr("autoalign", this.autoAlign);
		this._setBoolAttr("defaultOpen", this.isOpen);

		if (typeof this.description === "string") {
			if (!this._content) {
				this._content = document.createElement("cds-tooltip-content");
				el.appendChild(this._content);
			}
			this._content.textContent = this.description;
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
