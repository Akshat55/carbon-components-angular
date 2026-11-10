import {
	ComponentRef,
	DestroyRef,
	Directive,
	EventEmitter,
	Input,
	Output,
	inject
} from "@angular/core";
import { isObservable, of, Subject, Subscription } from "rxjs";
import { I18n } from "carbon-components-angular/i18n";
import { NotificationContent, NotificationType } from "./notification-content.interface";
import { NotificationDisplayService } from "./notification-display.service";

/**
 * Base class for `Notification`, `ActionableNotification` & `Toast`: the `notificationObj`
 * input, closing, and action handling. Each subclass sits on its web component's tag.
 *
 * [See demo](../../?path=/story/components-notification--inline-notification)
 */
@Directive({
	host: {
		"[attr.role]": "notificationObj.role",
		"[kind]": "notificationObj.type",
		"[lowContrast]": "!!notificationObj.lowContrast",
		"[hideCloseButton]": "!notificationObj.showClose",
		"[ariaLabel]": "closeLabelText",
		"[open]": "true",
		"(cds-notification-beingclosed)": "onBeingClosed($event)"
	}
})
export class BaseNotification<T extends NotificationContent = NotificationContent> {
	/**
	 * The notification's content. Mutating it in place updates the notification.
	 */
	@Input() set notificationObj(obj: T) {
		this._notificationObj = Object.assign({}, this.defaultNotificationObj, obj) as T;
		this.watchCloseLabel();
	}
	get notificationObj(): T {
		return this._notificationObj;
	}

	@Output() close: EventEmitter<any> = new EventEmitter();

	/**
	 * Set by `NotificationService` for notifications it creates.
	 */
	componentRef: ComponentRef<BaseNotification<any>>;

	/**
	 * The close button's label, resolved from `notificationObj.closeLabel` (string or observable).
	 */
	closeLabelText = "";

	protected notificationDisplayService = inject(NotificationDisplayService);
	protected i18n = inject(I18n);

	protected defaultNotificationObj: NotificationContent = {
		title: "",
		message: "",
		type: "info" as NotificationType,
		showClose: true,
		closeLabel: this.i18n.get("NOTIFICATION.CLOSE_BUTTON"),
		role: "status"
	};

	protected _notificationObj = Object.assign({}, this.defaultNotificationObj) as T;
	private closeLabelSubscription: Subscription;

	constructor() {
		this.watchCloseLabel();
		inject(DestroyRef).onDestroy(() => this.closeLabelSubscription?.unsubscribe());
	}

	onClose() {
		this.close.emit();
	}

	/**
	 * The web component removes itself when closed; Angular owns the element, so the
	 * consumer (or `NotificationService`) removes it on `close` instead.
	 */
	onBeingClosed(event: Event) {
		event.preventDefault();
		this.onClose();
	}

	onClick(action, event) {
		if (!action.click) {
			return;
		}
		if (isObservable(action.click)) {
			(action.click as Subject<{ event: Event, action: any }>).next({ event, action });
		} else {
			action.click({ event, action });
		}
	}

	destroy() {
		this.notificationDisplayService.close(this);
	}

	private watchCloseLabel() {
		this.closeLabelSubscription?.unsubscribe();
		const label = this._notificationObj.closeLabel;
		this.closeLabelSubscription = (isObservable(label) ? label : of(label ?? "")).subscribe(text => this.closeLabelText = text);
	}
}
