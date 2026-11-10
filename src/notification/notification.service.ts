/**
 * Copyright IBM Corp. 2024
 *
 * NotificationService
 *
 * Restores the old carbon-components-angular NotificationService on top of
 * the notification web components. Since web components are plain DOM
 * elements, the service dynamically creates them with `document.createElement`,
 * maps the same `NotificationContent` fields to attributes that the
 * directives use, and manages their lifecycle (duration timeout, close
 * events, removal from the DOM).
 *
 * Backwards-compatible API surface (matches carbon-components-angular):
 *   showNotification(content) — inline notification
 *   showToast(content)        — toast notification
 *   showActionable(content)   — actionable notification
 *   close(elementOrRef)       — programmatically dismiss
 *
 * Each method returns the created HTMLElement so callers can hold on to it
 * (the old API returned a ComponentRef; the element is the closest analogue
 * and supports the same close-event subscriptions via addEventListener).
 */
import { Injectable, NgZone } from "@angular/core";

import CDSInlineNotification from "@carbon/web-components/es/components/notification/inline-notification.js";
import CDSToastNotification from "@carbon/web-components/es/components/notification/toast-notification.js";
import CDSActionableNotification from "@carbon/web-components/es/components/notification/actionable-notification.js";
import CDSActionableNotificationButton from "@carbon/web-components/es/components/notification/actionable-notification-button.js";

import {
	ActionableContent,
	NotificationContent,
	ToastContent
} from "./notification-content.interface";

// The service is `providedIn: "root"` and can be injected without
// NotificationModule ever being imported — register the web components here
// too so dynamically created elements always upgrade.
function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-inline-notification", CDSInlineNotification);
safeDefine("cds-toast-notification", CDSToastNotification);
safeDefine("cds-actionable-notification", CDSActionableNotification);
safeDefine("cds-actionable-notification-button", CDSActionableNotificationButton);

@Injectable({ providedIn: "root" })
export class NotificationService {

	constructor(protected ngZone: NgZone) { }

	/**
	 * Shows an inline notification (<cds-inline-notification>).
	 * Same `NotificationContent` shape as before.
	 */
	showNotification(content: NotificationContent): HTMLElement {
		return this._show("cds-inline-notification", content);
	}

	/**
	 * Shows a toast notification (<cds-toast-notification>).
	 */
	showToast(content: ToastContent | NotificationContent): HTMLElement {
		return this._show("cds-toast-notification", content);
	}

	/**
	 * Shows an actionable notification (<cds-actionable-notification>).
	 * `content.actions` are rendered as <cds-actionable-notification-button>s
	 * and their `click` handlers/subjects are invoked exactly as before.
	 */
	showActionable(content: ActionableContent): HTMLElement {
		const element = this._show("cds-actionable-notification", content);

		if (content.variant === "inline") {
			element.setAttribute("inline", "");
		}

		for (const action of content.actions ?? []) {
			const button = document.createElement("cds-actionable-notification-button");
			button.setAttribute("slot", "action");
			button.textContent = action.text;
			button.addEventListener("click", (event: Event) => {
				this.ngZone.run(() => {
					if (typeof action.click === "function") {
						action.click({ event, action });
					} else {
						// Subject-style handler from the old API.
						action.click.next({ event, action });
					}
				});
			});
			element.appendChild(button);
		}

		return element;
	}

	/**
	 * Programmatically closes a notification created by this service.
	 */
	close(element: HTMLElement): void {
		// Let the web component animate/emit its close event, then remove.
		element.removeAttribute("open");
		element.remove();
	}

	// ------------------------------------------------------- private helpers

	/**
	 * Creates the web component element, maps `NotificationContent` fields to
	 * its attributes and appends it to the target (or document.body).
	 */
	private _show(tag: string, content: NotificationContent): HTMLElement {
		const element = document.createElement(tag);

		element.setAttribute("kind", content.type ?? "info");
		if (typeof content.title === "string") {
			element.setAttribute("title", content.title);
		}
		const subtitle = (content as any).subtitle ?? content.message;
		if (typeof subtitle === "string") {
			element.setAttribute("subtitle", subtitle);
		}
		const caption = (content as any).caption;
		if (typeof caption === "string") {
			element.setAttribute("caption", caption);
		}
		if (content.lowContrast) {
			element.setAttribute("low-contrast", "");
		}
		if (content.showClose === false) {
			element.setAttribute("hide-close-button", "");
		}
		if (content.closeLabel) {
			element.setAttribute("aria-label", String(content.closeLabel));
		}

		// The web component removes itself visually on close; drop the node
		// from the DOM as the old NotificationDisplayService did.
		element.addEventListener("cds-notification-closed", () => {
			element.remove();
		});

		// Auto-close after `duration`, matching the old smart/duration options.
		if (content.duration) {
			element.setAttribute("timeout", String(content.duration));
			// Fallback removal in case the timeout close event isn't observed.
			setTimeout(() => element.remove(), content.duration + 1000);
		}

		const target = content.target ? document.querySelector(content.target) : null;
		(target ?? document.body).appendChild(element);

		return element;
	}
}
