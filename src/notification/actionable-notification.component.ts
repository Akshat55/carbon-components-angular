import {
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { isObservable, of } from "rxjs";
import "@carbon/web-components/es/components/notification/index.js";
import { BaseNotification } from "./base-notification.component";
import { NotificationDisplayService } from "./notification-display.service";
import { ActionableContent } from "./notification-content.interface";

/**
 * Wraps the `<cds-actionable-notification>` web component, configured with `notificationObj`.
 * `actions` render as action buttons (or pass `actionsTemplate`).
 *
 * [See demo](../../?path=/story/components-notification--actionable)
 */
@Component({
	selector: "cds-actionable-notification",
	template: `
		@if (notificationObj.template) {
			<ng-container *ngTemplateOutlet="notificationObj.template; context: { $implicit: notificationObj }" />
		} @else {
			<span slot="title" [innerHTML]="notificationObj.title"></span>
			<span slot="subtitle">
				<span [innerHTML]="notificationObj.message"></span>
				@for (link of notificationObj.links; track link) {
					<a class="cds--link" [href]="link.href">{{ link.text }}</a>
				}
			</span>
		}
		@if (notificationObj.actionsTemplate) {
			<span slot="action">
				<ng-container *ngTemplateOutlet="notificationObj.actionsTemplate; context: { $implicit: notificationObj }" />
			</span>
		} @else {
			@for (action of notificationObj.actions; track action) {
				<cds-actionable-notification-button slot="action" (click)="onClick(action, $event)">
					{{ action.text }}
				</cds-actionable-notification-button>
			}
		}
	`,
	host: {
		"[id]": "notificationID",
		"[kind]": "notificationObj.type",
		"[lowContrast]": "!!notificationObj.lowContrast",
		"[hideCloseButton]": "!notificationObj.showClose",
		"[inline]": "notificationObj.variant === 'inline'",
		"[open]": "true",
		"(cds-notification-beingclosed)": "onBeingClosed($event)"
	},
	providers: [NotificationDisplayService],
	// Default change detection: v6 notifications re-render when `notificationObj` is mutated.
	imports: [NgTemplateOutlet],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ActionableNotification extends BaseNotification {
	static notificationCount = 0;

	notificationID = `notification-${ActionableNotification.notificationCount++}`;

	@Input() get notificationObj(): ActionableContent {
		return this._notificationObj;
	}
	set notificationObj(obj: ActionableContent) {
		if (obj.closeLabel && !isObservable(obj.closeLabel)) {
			obj.closeLabel = of(obj.closeLabel);
		}
		this._notificationObj = Object.assign({}, this.defaultNotificationObj, obj);
	}
}
