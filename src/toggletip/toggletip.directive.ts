/**
 * Copyright IBM Corp. 2024
 *
 * Directives for the <cds-toggletip> web component.
 *
 * Replaces the old Angular Toggletip component and its helper directives.
 * The web component uses named slots; these directives map the old selectors
 * onto them:
 *
 *   cdsToggletipLabel   → default slot (label text)
 *   cdsToggletipButton  → slot="trigger"
 *   cdsToggletipContent → slot="body-text"
 *   cdsToggletipAction  → slot="actions"
 *
 * Backwards-compatible API surface on the toggletip itself:
 *   [align]     → alignment attribute
 *   [isOpen]    → open attribute (two-way via (isOpenChange))
 *   [autoAlign] → autoalign attribute
 */
import {
	Directive,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges
} from "@angular/core";

@Directive({
	selector: "cds-toggletip, [cdsToggletip], [ibmToggletip]",
	standalone: true
})
export class CdsToggletipDirective implements OnChanges {
	/** Toggletip alignment relative to the trigger. */
	@Input() align: string = "top";

	/** Whether the toggletip is open. */
	@Input() isOpen = false;

	/** Automatically re-align when there is not enough space. */
	@Input() autoAlign = false;

	/** Emits the new open state whenever it changes. */
	@Output() isOpenChange = new EventEmitter<boolean>();

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(changes: SimpleChanges): void {
		const el = this._el.nativeElement;

		el.setAttribute("alignment", this.align);

		if (this.isOpen) {
			el.setAttribute("open", "");
		} else {
			el.removeAttribute("open");
		}
		if (this.autoAlign) {
			el.setAttribute("autoalign", "");
		} else {
			el.removeAttribute("autoalign");
		}

		if (changes["isOpen"] && !changes["isOpen"].firstChange) {
			this.isOpenChange.emit(this.isOpen);
		}
	}

	/** Track open state toggled by the web component itself. */
	@HostListener("click")
	onClick(): void {
		const open = this._el.nativeElement.hasAttribute("open");
		if (open !== this.isOpen) {
			this.isOpen = open;
			this.isOpenChange.emit(open);
		}
	}
}

@Directive({
	selector: "[cdsToggletipButton], [ibmToggletipButton]",
	standalone: true
})
export class CdsToggletipButtonDirective implements OnInit {
	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnInit(): void {
		this._el.nativeElement.setAttribute("slot", "trigger");
	}
}

@Directive({
	selector: "[cdsToggletipContent], [ibmToggletipContent]",
	standalone: true
})
export class CdsToggletipContentDirective implements OnInit {
	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnInit(): void {
		this._el.nativeElement.setAttribute("slot", "body-text");
	}
}

@Directive({
	selector: "[cdsToggletipAction], [ibmToggletipAction]",
	standalone: true
})
export class CdsToggletipActionDirective implements OnInit {
	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnInit(): void {
		this._el.nativeElement.setAttribute("slot", "actions");
	}
}
