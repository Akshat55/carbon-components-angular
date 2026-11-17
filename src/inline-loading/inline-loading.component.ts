import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output,
	ElementRef,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/inline-loading/index.js";

export enum InlineLoadingState {
	/** Hides the component */
	Hidden = "hidden",
	/** Shows the stopped spinner and `loadingText` */
	Inactive = "inactive",
	/** Shows the spinner and `loadingText` */
	Active = "active",
	/** Shows the checkmark and `successText` */
	Finished = "finished",
	/** Shows the error icon and `errorText` */
	Error = "error"
}

/**
 * Adds Angular inputs and outputs to the `<cds-inline-loading>` web component.
 *
 * [See demo](../../?path=/story/components-inline-loading--basic)
 */
@Component({
	selector: "cds-inline-loading",
	template: `{{ text }}`,
	host: {
		"[status]": "state ?? element.status",
		"[iconDescription]": "iconDescription ?? element.iconDescription",
		"[successDelay]": "successDelay ?? element.successDelay",
		"[hidden]": "state === 'hidden'",
		"[attr.aria-live]": "state === 'hidden' ? null : state === 'inactive' ? 'off' : 'assertive'"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InlineLoading {
	/**
	 * The web component's default is `"active"`.
	 */
	@Input() state?: InlineLoadingState | string;
	@Input() loadingText: string;
	@Input() successText: string;
	/**
	 * Milliseconds before `onSuccess` fires after the finished state.
	 */
	/**
	 * The web component's default is 1500 ms.
	 */
	@Input() successDelay?: number;
	@Input() errorText: string;
	@Input() iconDescription: string;

	/**
	 * `false` stops the animation.
	 */
	@Input() get isActive() {
		return (this.state ?? this.element.status) === InlineLoadingState.Active;
	}
	set isActive(active: boolean) {
		this.state = active ? InlineLoadingState.Active : InlineLoadingState.Inactive;
	}

	/**
	 * `true` shows the finished state and emits `onSuccess` after `successDelay`; `false` shows the error state.
	 */
	@Input() get success() {
		return (this.state ?? this.element.status) === InlineLoadingState.Finished;
	}
	set success(success: boolean) {
		this.state = success ? InlineLoadingState.Finished : InlineLoadingState.Error;
		if (success) {
			setTimeout(() => this.onSuccess.emit(), this.successDelay ?? this.element.successDelay);
		}
	}

	@Output() onSuccess: EventEmitter<any> = new EventEmitter();

	protected element = inject(ElementRef).nativeElement;

	get text() {
		switch (this.state ?? this.element.status) {
			case InlineLoadingState.Finished: return this.successText;
			case InlineLoadingState.Error: return this.errorText;
			case InlineLoadingState.Hidden: return "";
			default: return this.loadingText;
		}
	}
}
