/**
 * Copyright IBM Corp. 2024
 *
 * Directives for the notification web components.
 *
 * Replaces the old Angular Notification / Toast / ActionableNotification
 * components with thin directives on:
 *   <cds-inline-notification>  (previously <cds-notification>)
 *   <cds-toast-notification>   (previously <cds-toast>)
 *   <cds-actionable-notification>
 *
 * The old `[notificationObj]` input is preserved — its fields are mapped to
 * web component attributes. `(close)` is bridged from the web component's
 * `cds-notification-closed` event.
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
import { NotificationContent, NotificationType, ToastContent } from "./notification-content.interface";

@Directive({
	selector: "cds-inline-notification, cds-notification, [cdsNotification], [ibmNotification]",
	standalone: true
})
export class CdsInlineNotificationDirective implements OnChanges {
	/** Object containing the notification's fields — same shape as before. */
	@Input() notificationObj: NotificationContent;

	/** Emits when the notification is closed. */
	@Output() close: EventEmitter<any> = new EventEmitter();

	constructor(protected _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		this._applyObj(this.notificationObj);
	}

	@HostListener("cds-notification-closed", ["$event"])
	onClosed(event: CustomEvent): void {
		this.close.emit(event);
	}

	protected _applyObj(obj: NotificationContent | ToastContent | undefined): void {
		if (!obj) {
			return;
		}
		const el = this._el.nativeElement;

		el.setAttribute("kind", (obj.type as NotificationType) ?? "info");
		if (typeof obj.title === "string") {
			el.setAttribute("title", obj.title);
		}
		const subtitle = (obj as any).subtitle ?? (obj as any).message;
		if (typeof subtitle === "string") {
			el.setAttribute("subtitle", subtitle);
		}
		const caption = (obj as any).caption;
		if (typeof caption === "string") {
			el.setAttribute("caption", caption);
		}

		if (obj.lowContrast) {
			el.setAttribute("low-contrast", "");
		} else {
			el.removeAttribute("low-contrast");
		}
		if (obj.showClose === false) {
			el.setAttribute("hide-close-button", "");
		} else {
			el.removeAttribute("hide-close-button");
		}
		if ((obj as any).duration) {
			el.setAttribute("timeout", String((obj as any).duration));
		}
	}
}

@Directive({
	selector: "cds-toast-notification, cds-toast, [cdsToast], [ibmToast]",
	standalone: true
})
export class CdsToastNotificationDirective extends CdsInlineNotificationDirective {
	/** Toast content — includes `caption` in addition to title/subtitle. */
	@Input() override notificationObj: ToastContent;
}

@Directive({
	selector: "cds-actionable-notification, [cdsActionableNotification], [ibmActionableNotification]",
	standalone: true
})
export class CdsActionableNotificationDirective extends CdsInlineNotificationDirective {
	/**
	 * Inline (true) or toast-like (false) actionable notification.
	 * Maps to the web component's `inline` attribute.
	 */
	@Input() inline = false;

	override ngOnChanges(): void {
		super.ngOnChanges();
		if (this.inline) {
			this._el.nativeElement.setAttribute("inline", "");
		} else {
			this._el.nativeElement.removeAttribute("inline");
		}
	}
}
