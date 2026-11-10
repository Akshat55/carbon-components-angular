import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output
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
 * Wraps the `<cds-inline-loading>` web component.
 *
 * [See demo](../../?path=/story/components-inline-loading--basic)
 */
@Component({
	selector: "cds-inline-loading",
	template: `{{ text }}`,
	host: {
		"[status]": "state",
		"[iconDescription]": "iconDescription",
		"[successDelay]": "successDelay",
		"[hidden]": "state === 'hidden'",
		"[attr.aria-live]": "state === 'hidden' ? null : state === 'inactive' ? 'off' : 'assertive'"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InlineLoading {
	@Input() state: InlineLoadingState | string = InlineLoadingState.Active;
	@Input() loadingText: string;
	@Input() successText: string;
	/**
	 * Milliseconds before `onSuccess` fires after the finished state.
	 */
	@Input() successDelay = 1500;
	@Input() errorText: string;
	@Input() iconDescription: string;

	/**
	 * `false` stops the animation.
	 */
	@Input() get isActive() {
		return this.state === InlineLoadingState.Active;
	}
	set isActive(active: boolean) {
		this.state = active ? InlineLoadingState.Active : InlineLoadingState.Inactive;
	}

	/**
	 * `true` shows the finished state and emits `onSuccess` after `successDelay`; `false` shows the error state.
	 */
	@Input() get success() {
		return this.state === InlineLoadingState.Finished;
	}
	set success(success: boolean) {
		this.state = success ? InlineLoadingState.Finished : InlineLoadingState.Error;
		if (success) {
			setTimeout(() => this.onSuccess.emit(), this.successDelay);
		}
	}

	@Output() onSuccess: EventEmitter<any> = new EventEmitter();

	get text() {
		switch (this.state) {
			case InlineLoadingState.Finished: return this.successText;
			case InlineLoadingState.Error: return this.errorText;
			case InlineLoadingState.Hidden: return "";
			default: return this.loadingText;
		}
	}
}
