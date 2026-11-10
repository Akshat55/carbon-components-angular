/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsProgressBarDirective
 *
 * Sits directly on <cds-progress-bar> — no wrapper element, no extra DOM node.
 * Translates the old carbon-components-angular `ProgressBar` component
 * @Inputs to web component attributes.
 *
 * Backwards-compatible API surface (matches carbon-components-angular):
 *   [value]      → value attribute   (undefined = indeterminate, same as before)
 *   [max]        → max attribute     (default: 100)
 *   [label]      → label attribute   (string only — see MIGRATION.md for TemplateRef)
 *   [helperText] → helper-text attribute (string only)
 *   [type]       → type attribute    ('default' | 'inline' | 'indented')
 *   [status]     → status attribute  ('active' | 'finished' | 'error')
 *   [size]       → size attribute    ('small' | 'big')
 *   [hideLabel]  → hide-label attribute
 */
import {
	Directive,
	ElementRef,
	Input,
	OnChanges,
	TemplateRef
} from "@angular/core";

@Directive({
	selector: "cds-progress-bar, [cdsProgressBar], [ibmProgressBar]",
	standalone: true
})
export class CdsProgressBarDirective implements OnChanges {
	/** Current value. Leave undefined for an indeterminate bar. */
	@Input() value: number | undefined;

	/** Maximum value. */
	@Input() max = 100;

	/**
	 * Description of the progress bar.
	 * The web component accepts a string label; TemplateRef labels from the
	 * old API are not supported — see MIGRATION.md.
	 */
	@Input() label: string | TemplateRef<any>;

	/** Helper text shown under the bar (string only). */
	@Input() helperText: string | TemplateRef<any>;

	/** Alignment variant of the progress bar. */
	@Input() type: "default" | "inline" | "indented" = "default";

	/** Current status of the progress bar. */
	@Input() status: "active" | "finished" | "error" = "active";

	/** Size of the progress bar. */
	@Input() size: "small" | "big" = "big";

	/** Set to `true` to visually hide the label (still available to AT). */
	@Input() hideLabel = false;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		el.setAttribute("max", String(this.max));
		el.setAttribute("type", this.type);
		el.setAttribute("status", this.status);
		el.setAttribute("size", this.size);

		if (this.value === undefined || this.value === null) {
			// No value = indeterminate, matching the old component's behaviour.
			el.removeAttribute("value");
		} else {
			// Clamp to [0, max] like the old component did.
			const clamped = Math.max(0, Math.min(this.value, this.max));
			el.setAttribute("value", String(clamped));
		}

		if (typeof this.label === "string") {
			el.setAttribute("label", this.label);
		}
		if (typeof this.helperText === "string") {
			el.setAttribute("helper-text", this.helperText);
		}

		if (this.hideLabel) {
			el.setAttribute("hide-label", "");
		} else {
			el.removeAttribute("hide-label");
		}
	}
}
