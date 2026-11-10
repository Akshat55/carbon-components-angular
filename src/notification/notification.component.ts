import {
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input
} from "@angular/core";
import { AsyncPipe, NgTemplateOutlet } from "@angular/common";
import { isObservable, of } from "rxjs";
import "@carbon/web-components/es/components/notification/index.js";
import { BaseNotification } from "./base-notification.component";
import { NotificationDisplayService } from "./notification-display.service";
import { NotificationContent } from "./notification-content.interface";

/**
 * Renders the `<cds-inline-notification>` web component from `notificationObj`.
 *
 * ```html
 * <cds-notification [notificationObj]="{ type: 'info', title: 'Title', message: 'Message' }" />
 * ```
 *
 * Use `NotificationService.showNotification()` to create one dynamically.
 *
 * [See demo](../../?path=/story/components-notification--basic)
 */
@Component({
	selector: "cds-notification",
	template: `
		<cds-inline-notification
			[id]="notificationID"
			[kind]="notificationObj.type"
			[lowContrast]="!!notificationObj.lowContrast"
			[hideCloseButton]="!notificationObj.showClose"
			[attr.aria-label]="notificationObj.closeLabel | async"
			open
			(cds-notification-beingclosed)="onBeingClosed($event)">
			@if (notificationObj.template) {
				<ng-container *ngTemplateOutlet="notificationObj.template; context: { $implicit: notificationObj }" />
			} @else {
				<span slot="title" [innerHTML]="notificationObj.title"></span>
				<span slot="subtitle" [innerHTML]="notificationObj.message"></span>
			}
		</cds-inline-notification>
	`,
	styles: [":host { display: contents; }"],
	providers: [NotificationDisplayService],
	// Default change detection: v6 notifications re-render when `notificationObj` is mutated.
	imports: [NgTemplateOutlet, AsyncPipe],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Notification extends BaseNotification {
	static notificationCount = 0;

	notificationID = `notification-${Notification.notificationCount++}`;

	@Input() get notificationObj(): NotificationContent {
		return this._notificationObj;
	}
	set notificationObj(obj: NotificationContent) {
		if (obj.closeLabel && !isObservable(obj.closeLabel)) {
			obj.closeLabel = of(obj.closeLabel);
		}
		this._notificationObj = Object.assign({}, this.defaultNotificationObj, obj);
	}
}
