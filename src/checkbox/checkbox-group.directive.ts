/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsCheckboxGroupDirective
 *
 * Sits directly on <cds-checkbox-group> — no wrapper element, no extra DOM node.
 * Translates the old carbon-components-angular `CheckboxGroup` component
 * @Inputs to web component attributes.
 *
 * Backwards-compatible API surface:
 *   [legend]      → legend-text attribute (string only)
 *   [orientation] → orientation attribute
 *   [helperText]  → helper-text attribute (string only)
 *   [invalid] [invalidText] [warn] [warnText] [readOnly] — unchanged semantics
 */
import {
	Directive,
	ElementRef,
	Input,
	OnChanges,
	TemplateRef
} from "@angular/core";

@Directive({
	selector: "cds-checkbox-group, [cdsCheckboxGroup], [ibmCheckboxGroup]",
	standalone: true
})
export class CdsCheckboxGroupDirective implements OnChanges {
	/** Legend for the group (string only). */
	@Input() legend: string | TemplateRef<any>;

	/** Layout orientation of the checkboxes. */
	@Input() orientation: "horizontal" | "vertical" = "vertical";

	/** Helper text shown under the group (string only). */
	@Input() helperText: string | TemplateRef<any>;

	@Input() invalid = false;
	@Input() invalidText: string | TemplateRef<any>;
	@Input() warn = false;
	@Input() warnText: string | TemplateRef<any>;
	@Input() readOnly = false;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		if (typeof this.legend === "string") {
			el.setAttribute("legend-text", this.legend);
		}
		if (typeof this.helperText === "string") {
			el.setAttribute("helper-text", this.helperText);
		}
		if (typeof this.invalidText === "string") {
			el.setAttribute("invalid-text", this.invalidText);
		}
		if (typeof this.warnText === "string") {
			el.setAttribute("warn-text", this.warnText);
		}

		el.setAttribute("orientation", this.orientation);

		this._setBoolAttr("invalid", this.invalid);
		this._setBoolAttr("warn", this.warn);
		this._setBoolAttr("readonly", this.readOnly);
	}

	private _setBoolAttr(name: string, value: boolean): void {
		if (value) {
			this._el.nativeElement.setAttribute(name, "");
		} else {
			this._el.nativeElement.removeAttribute(name);
		}
	}
}
