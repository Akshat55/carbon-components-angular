import {
	Component,
	CUSTOM_ELEMENTS_SCHEMA
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import "@carbon/web-components/es/components/notification/index.js";
import { BaseNotification } from "./base-notification.component";
import { NotificationDisplayService } from "./notification-display.service";
import { ToastContent } from "./notification-content.interface";

/**
 * Adds `notificationObj` and `(close)` to the `<cds-toast-notification>` web component.
 *
 * ```html
 * <cds-toast-notification [notificationObj]="{ type: 'info', title: 'Title', subtitle: 'Subtitle' }" />
 * ```
 *
 * Use `NotificationService.showToast()` to create one dynamically.
 *
 * [See demo](../../?path=/story/components-notification--toast)
 */
@Component({
	selector: "cds-toast-notification",
	template: `
		@if (notificationObj.template) {
			<ng-container *ngTemplateOutlet="notificationObj.template; context: { $implicit: notificationObj }" />
		} @else {
			@if (notificationObj.title) {
				<span slot="title" [innerHTML]="notificationObj.title"></span>
			}
			@if (notificationObj.subtitle) {
				<span slot="subtitle" [innerHTML]="notificationObj.subtitle"></span>
			}
			@if (notificationObj.caption) {
				<span slot="caption" [innerHTML]="notificationObj.caption"></span>
			}
		}
		<ng-content />
	`,
	providers: [NotificationDisplayService],
	// Default change detection: notifications re-render when `notificationObj` is mutated.
	imports: [NgTemplateOutlet],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Toast extends BaseNotification<ToastContent> {}
