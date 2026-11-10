/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsCodeSnippetDirective
 *
 * Sits directly on <cds-code-snippet> — no wrapper element, no extra DOM node.
 * Translates the old carbon-components-angular `CodeSnippet` component
 * @Inputs to web component attributes.
 *
 * Backwards-compatible API surface (matches carbon-components-angular):
 *   [display]               → type attribute ('single' | 'multi' | 'inline')
 *   [disabled] [hideCopyButton] [wrapText]
 *   [feedbackText]          → feedback attribute
 *   [feedbackTimeout]       → feedback-timeout attribute
 *   [copyButtonDescription] → tooltip-content attribute
 *   [maxCollapsedNumberOfRows] [minCollapsedNumberOfRows]
 *   [maxExpandedNumberOfRows] [minExpandedNumberOfRows]
 */
import {
	Directive,
	ElementRef,
	Input,
	OnChanges
} from "@angular/core";

export enum SnippetType {
	single = "single",
	multi = "multi",
	inline = "inline"
}

@Directive({
	selector: "cds-code-snippet, [cdsCodeSnippet], [ibmCodeSnippet]",
	standalone: true
})
export class CdsCodeSnippetDirective implements OnChanges {
	/** Snippet display type. */
	@Input() display: SnippetType | "single" | "multi" | "inline" = SnippetType.single;

	/** Description for the copy button tooltip. */
	@Input() copyButtonDescription: string;

	/** Hide the copy button. */
	@Input() hideCopyButton = false;

	/** Set to `true` to disable the snippet. */
	@Input() disabled = false;

	@Input() maxCollapsedNumberOfRows = 15;
	@Input() minCollapsedNumberOfRows = 3;
	@Input() maxExpandedNumberOfRows = 0;
	@Input() minExpandedNumberOfRows = 16;

	/** Wrap long lines instead of scrolling. */
	@Input() wrapText = false;

	/** Feedback text shown after copying. */
	@Input() feedbackText = "Copied!";

	/** How long the feedback text is shown, in ms. */
	@Input() feedbackTimeout = 2000;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		el.setAttribute("type", String(this.display));
		el.setAttribute("feedback", this.feedbackText);
		el.setAttribute("feedback-timeout", String(this.feedbackTimeout));
		el.setAttribute("maxCollapsedNumberOfRows", String(this.maxCollapsedNumberOfRows));
		el.setAttribute("minCollapsedNumberOfRows", String(this.minCollapsedNumberOfRows));
		el.setAttribute("maxExpandedNumberOfRows", String(this.maxExpandedNumberOfRows));
		el.setAttribute("minExpandedNumberOfRows", String(this.minExpandedNumberOfRows));

		if (this.copyButtonDescription) {
			el.setAttribute("tooltip-content", this.copyButtonDescription);
		}

		this._setBoolAttr("disabled", this.disabled);
		this._setBoolAttr("hide-copy-button", this.hideCopyButton);
		this._setBoolAttr("wrap-text", this.wrapText);
	}

	private _setBoolAttr(name: string, value: boolean): void {
		if (value) {
			this._el.nativeElement.setAttribute(name, "");
		} else {
			this._el.nativeElement.removeAttribute(name);
		}
	}
}
