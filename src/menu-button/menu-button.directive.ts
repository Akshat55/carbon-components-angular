/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsMenuButtonDirective
 *
 * Sits directly on <cds-menu-button> — the web component replacement for
 * the old Angular MenuButtonComponent.
 *
 * The web component expects a <cds-menu> with <cds-menu-item> children:
 *
 *   <cds-menu-button label="Actions" kind="primary">
 *     <cds-menu>
 *       <cds-menu-item label="First action"></cds-menu-item>
 *       <cds-menu-item label="Second action"></cds-menu-item>
 *     </cds-menu>
 *   </cds-menu-button>
 *
 * Backwards-compatible API surface:
 *   [label] [kind] [size] [disabled]
 *   [menuAlignment] → menu-alignment attribute
 */
import {
	Directive,
	ElementRef,
	Input,
	OnChanges
} from "@angular/core";

@Directive({
	selector: "cds-menu-button, [cdsMenuButton], [ibmMenuButton]",
	standalone: true
})
export class CdsMenuButtonDirective implements OnChanges {
	/** Button label. */
	@Input() label: string;

	/** Button kind. */
	@Input() kind: "primary" | "tertiary" | "ghost" = "primary";

	/** Button size. */
	@Input() size: "xs" | "sm" | "md" | "lg" = "lg";

	/** Placement of the menu relative to the button. */
	@Input() menuAlignment = "bottom";

	/** Set to `true` to disable the button. */
	@Input() disabled = false;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		if (this.label) {
			el.setAttribute("label", this.label);
		}
		el.setAttribute("kind", this.kind);
		el.setAttribute("size", this.size);
		el.setAttribute("menu-alignment", this.menuAlignment);

		if (this.disabled) {
			el.setAttribute("disabled", "");
		} else {
			el.removeAttribute("disabled");
		}
	}
}
