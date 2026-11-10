/**
 * Copyright IBM Corp. 2024
 *
 * Directives for the <cds-ai-label> web component.
 *
 * Replaces the old Angular AILabelComponent and its helper directives.
 * Content/actions map onto the web component's slots:
 *
 *   cdsAILabelContent → slot="body-text"
 *   cdsAILabelActions → slot="actions"
 *
 * Backwards-compatible API surface:
 *   [aiText]       → ai-text attribute
 *   [textLabel]    → ai-text-label attribute
 *   [kind]         → kind attribute ('default' | 'inline')
 *   [size]         → size attribute
 *   [revertActive] → revert-active attribute
 *   [revertLabel]  → revert-label attribute
 *   [ariaLabel]    → button-label attribute
 *   [align]        → alignment attribute
 *   [autoAlign]    → autoalign attribute
 *   (revertClick)  ← bridged from the web component's revert event
 */
import {
	Directive,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnChanges,
	OnInit,
	Output
} from "@angular/core";

@Directive({
	selector: "cds-ai-label, [cdsAILabel], [ibmAILabel]",
	standalone: true
})
export class CdsAILabelDirective implements OnChanges {
	/** Text inside the AI label button. */
	@Input() aiText = "AI";

	/** Text adjacent to the AI label (inline kind only). */
	@Input() textLabel: string;

	/** Kind of the AI label. */
	@Input() kind: "default" | "inline" = "default";

	/** Size of the AI label. */
	@Input() size: "mini" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" = "xs";

	/** Show the revert button instead of the label. */
	@Input() revertActive = false;

	/** Revert button description. */
	@Input() revertLabel = "Revert to AI input";

	/** Accessible label for the toggletip button. */
	@Input() ariaLabel = "Show information";

	/** Alignment of the callout. */
	@Input() align: string;

	/** Automatically re-align when there is not enough space. */
	@Input() autoAlign = false;

	/** Emits when the revert button is clicked. */
	@Output() revertClick = new EventEmitter<MouseEvent>();

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		el.setAttribute("ai-text", this.aiText);
		el.setAttribute("kind", this.kind);
		el.setAttribute("size", this.size);
		el.setAttribute("revert-label", this.revertLabel);
		el.setAttribute("button-label", this.ariaLabel);

		if (this.textLabel) {
			el.setAttribute("ai-text-label", this.textLabel);
		}
		if (this.align) {
			el.setAttribute("alignment", this.align);
		}

		this._setBoolAttr("revert-active", this.revertActive);
		this._setBoolAttr("autoalign", this.autoAlign);
	}

	@HostListener("cds-ai-label-reverted", ["$event"])
	onReverted(event: CustomEvent): void {
		this.revertClick.emit(event as unknown as MouseEvent);
	}

	private _setBoolAttr(name: string, value: boolean): void {
		if (value) {
			this._el.nativeElement.setAttribute(name, "");
		} else {
			this._el.nativeElement.removeAttribute(name);
		}
	}
}

@Directive({
	selector: "[cdsAILabelContent], [ibmAILabelContent]",
	standalone: true
})
export class CdsAILabelContentDirective implements OnInit {
	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnInit(): void {
		this._el.nativeElement.setAttribute("slot", "body-text");
	}
}

@Directive({
	selector: "[cdsAILabelActions], [ibmAILabelActions]",
	standalone: true
})
export class CdsAILabelActionsDirective implements OnInit {
	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnInit(): void {
		this._el.nativeElement.setAttribute("slot", "actions");
	}
}
