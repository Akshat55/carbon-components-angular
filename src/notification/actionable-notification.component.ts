import {
	Component,
	CUSTOM_ELEMENTS_SCHEMA
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import "@carbon/web-components/es/components/notification/index.js";
import { BaseNotification } from "./base-notification.component";
import { NotificationDisplayService } from "./notification-display.service";
import { ActionableContent } from "./notification-content.interface";

/**
 * Adds `notificationObj` and `(close)` to the `<cds-actionable-notification>` web component.
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
			@if (notificationObj.title) {
				<span slot="title" [innerHTML]="notificationObj.title"></span>
			}
			@if (notificationObj.message || notificationObj.links?.length) {
				<span slot="subtitle">
					<span [innerHTML]="notificationObj.message"></span>
					@for (link of notificationObj.links; track link) {
						<a class="cds--link" [href]="link.href">{{ link.text }}</a>
					}
				</span>
			}
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
		<ng-content />
	`,
	host: {
		"[inline]": "notificationObj.variant === 'inline'"
	},
	providers: [NotificationDisplayService],
	// Default change detection: notifications re-render when `notificationObj` is mutated.
	imports: [NgTemplateOutlet],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ActionableNotification extends BaseNotification<ActionableContent> {}
