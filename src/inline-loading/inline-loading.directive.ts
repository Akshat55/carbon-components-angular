/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsInlineLoadingDirective
 *
 * Sits directly on <cds-inline-loading> — no wrapper element, no extra DOM node.
 * Translates the old carbon-components-angular `InlineLoading` component
 * @Inputs to web component attributes, and manages the state-dependent
 * description text (loadingText / successText / errorText) which the web
 * component renders via its default slot.
 *
 * Backwards-compatible API surface (matches carbon-components-angular):
 *   [state]          → status attribute ('hidden' hides the host element)
 *   [loadingText]    → slotted text while active/inactive
 *   [successText]    → slotted text when finished
 *   [errorText]      → slotted text on error
 *   [successDelay]   → delay before (onSuccess) fires
 *   [iconDescription]→ icon-description attribute
 *   [isActive]       → convenience boolean, same semantics as before
 *   [success]        → convenience boolean, same semantics as before
 *   (onSuccess)      → emits after the success state has been active for successDelay
 */
import {
	Directive,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	OnDestroy,
	Output
} from "@angular/core";

export enum InlineLoadingState {
	/** It hides the whole component. */
	Hidden = "hidden",
	/** It shows the `loadingText` but no loading animation. */
	Inactive = "inactive",
	/** It shows the `loadingText` with loading animation. */
	Active = "active",
	/** It shows the `successText` with a success state. */
	Finished = "finished",
	/** It shows the `errorText` with an error state. */
	Error = "error"
}

@Directive({
	selector: "cds-inline-loading, [cdsInlineLoading], [ibmInlineLoading]",
	standalone: true
})
export class CdsInlineLoadingDirective implements OnChanges, OnDestroy {
	/**
	 * The current state. Maps to the web component's `status` attribute.
	 * `hidden` has no web component equivalent — the host element is hidden instead.
	 */
	@Input() state: InlineLoadingState | string = InlineLoadingState.Active;

	/** Text description for the loading state. */
	@Input() loadingText: string;

	/** Text description for the success state. */
	@Input() successText: string;

	/** Delay (ms) before `onSuccess` emits once the success state is set. */
	@Input() successDelay = 1500;

	/** Text description for the error state. */
	@Input() errorText: string;

	/** Accessible description applied to the loading/success/error icon. */
	@Input() iconDescription: string;

	/**
	 * Set to `false` to stop the loading animation.
	 * Same convenience semantics as the old component.
	 */
	@Input() get isActive() {
		return this.state === InlineLoadingState.Active;
	}
	set isActive(active: boolean) {
		this.state = active ? InlineLoadingState.Active : InlineLoadingState.Inactive;
	}

	/**
	 * Set to `true` for the success state (emits `onSuccess` after `successDelay`),
	 * `false` for the error state. Same semantics as the old component.
	 */
	@Input() get success() {
		return this.state === InlineLoadingState.Finished;
	}
	set success(success: boolean) {
		this.state = success ? InlineLoadingState.Finished : InlineLoadingState.Error;
		if (this.state === InlineLoadingState.Finished) {
			this._successTimeout = setTimeout(() => {
				this.onSuccess.emit();
			}, this.successDelay);
		}
	}

	/** Emits after the success state has been active for `successDelay` ms. */
	@Output() onSuccess: EventEmitter<any> = new EventEmitter();

	private _textNode: Text | null = null;
	private _successTimeout: any;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		this._sync();
	}

	ngOnDestroy(): void {
		clearTimeout(this._successTimeout);
	}

	private _sync(): void {
		const el = this._el.nativeElement;

		if (this.state === InlineLoadingState.Hidden) {
			el.style.display = "none";
			return;
		}
		el.style.display = "";

		// `hidden` aside, the old state values match the web component statuses.
		el.setAttribute("status", String(this.state));

		if (this.iconDescription) {
			el.setAttribute("icon-description", this.iconDescription);
		}

		// The web component renders the description through its default slot —
		// project the state-appropriate text the way the old component did.
		const text =
			this.state === InlineLoadingState.Finished ? this.successText :
			this.state === InlineLoadingState.Error ? this.errorText :
			this.loadingText;

		if (text !== undefined && text !== null) {
			if (!this._textNode) {
				this._textNode = document.createTextNode("");
				el.appendChild(this._textNode);
			}
			this._textNode.textContent = text;
		}
	}
}
