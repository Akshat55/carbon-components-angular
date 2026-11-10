import {
	Component,
	CUSTOM_ELEMENTS_SCHEMA
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import "@carbon/web-components/es/components/notification/index.js";
import { BaseNotification } from "./base-notification.component";
import { NotificationDisplayService } from "./notification-display.service";

/**
 * Adds `notificationObj` and `(close)` to the `<cds-inline-notification>` web component.
 *
 * ```html
 * <cds-inline-notification [notificationObj]="{ type: 'info', title: 'Title', message: 'Message' }" />
 * ```
 *
 * Without `notificationObj`, use the web component's own attributes and slots.
 * Use `NotificationService.showNotification()` to create one dynamically.
 *
 * [See demo](../../?path=/story/components-notification--inline-notification)
 */
@Component({
	selector: "cds-inline-notification",
	template: `
		@if (notificationObj.template) {
			<ng-container *ngTemplateOutlet="notificationObj.template; context: { $implicit: notificationObj }" />
		} @else {
			@if (notificationObj.title) {
				<span slot="title" [innerHTML]="notificationObj.title"></span>
			}
			@if (notificationObj.message) {
				<span slot="subtitle" [innerHTML]="notificationObj.message"></span>
			}
		}
		<ng-content />
	`,
	providers: [NotificationDisplayService],
	// Default change detection: notifications re-render when `notificationObj` is mutated.
	imports: [NgTemplateOutlet],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Notification extends BaseNotification {}
