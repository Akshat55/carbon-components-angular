/**
 * Copyright IBM Corp. 2024
 *
 * NotificationModule
 *
 * Drop-in replacement for the old carbon-components-angular NotificationModule.
 * Registers the notification web components and exports the thin Angular
 * directives that map the old @Input/@Output API onto them.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import CDSInlineNotification from "@carbon/web-components/es/components/notification/inline-notification.js";
import CDSToastNotification from "@carbon/web-components/es/components/notification/toast-notification.js";
import CDSActionableNotification from "@carbon/web-components/es/components/notification/actionable-notification.js";
import CDSActionableNotificationButton from "@carbon/web-components/es/components/notification/actionable-notification-button.js";

import {
	CdsInlineNotificationDirective,
	CdsToastNotificationDirective,
	CdsActionableNotificationDirective
} from "./notification.directive";
import { NotificationService } from "./notification.service";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-inline-notification", CDSInlineNotification);
safeDefine("cds-toast-notification", CDSToastNotification);
safeDefine("cds-actionable-notification", CDSActionableNotification);
safeDefine("cds-actionable-notification-button", CDSActionableNotificationButton);

@NgModule({
	imports: [
		CommonModule,
		CdsInlineNotificationDirective,
		CdsToastNotificationDirective,
		CdsActionableNotificationDirective
	],
	exports: [
		CdsInlineNotificationDirective,
		CdsToastNotificationDirective,
		CdsActionableNotificationDirective
	],
	providers: [NotificationService],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NotificationModule { }
