/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsComboButtonDirective
 *
 * Sits directly on <cds-combo-button> — the web component replacement for
 * the old Angular ComboButtonComponent.
 *
 * The web component expects a <cds-menu> with <cds-menu-item> children for
 * the secondary actions:
 *
 *   <cds-combo-button label="Primary action" (actionClick)="...">
 *     <cds-menu>
 *       <cds-menu-item label="Second action"></cds-menu-item>
 *     </cds-menu>
 *   </cds-combo-button>
 *
 * Backwards-compatible API surface:
 *   [label] [size] [disabled]
 *   [menuAlignment]    → menu-alignment attribute
 *   [description]      → tooltip-content attribute
 *   [tooltipPlacement] → tooltip-alignment attribute
 *   (actionClick)      ← emitted when the primary button is clicked
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
	selector: "cds-combo-button, [cdsComboButton], [ibmComboButton]",
	standalone: true
})
export class CdsComboButtonDirective implements OnChanges {
	/** Primary action label. */
	@Input() label: string;

	/** Button size. */
	@Input() size: "xs" | "sm" | "md" | "lg" = "lg";

	/** Set to `true` to disable the combo button. */
	@Input() disabled = false;

	/** Placement of the menu relative to the button. */
	@Input() menuAlignment = "bottom";

	/** Tooltip content for the icon button. */
	@Input() description: string;

	/** Tooltip placement. */
	@Input() tooltipPlacement = "bottom";

	/** Emits when the primary action button is clicked. */
	@Output() actionClick = new EventEmitter<Event>();

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		if (this.label) {
			el.setAttribute("label", this.label);
		}
		el.setAttribute("size", this.size);
		el.setAttribute("menu-alignment", this.menuAlignment);
		el.setAttribute("tooltip-alignment", this.tooltipPlacement);
		if (this.description) {
			el.setAttribute("tooltip-content", this.description);
		}

		if (this.disabled) {
			el.setAttribute("disabled", "");
		} else {
			el.removeAttribute("disabled");
		}

		// The web component invokes `onClick` for the primary action.
		(el as any).onClick = (event: Event) => this.actionClick.emit(event);
	}
}
