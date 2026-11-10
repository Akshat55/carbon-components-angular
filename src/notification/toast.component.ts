import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input,
	OnInit
} from "@angular/core";
import { AsyncPipe, NgTemplateOutlet } from "@angular/common";
import { isObservable, of } from "rxjs";
import "@carbon/web-components/es/components/notification/index.js";
import { BaseNotification } from "./base-notification.component";
import { NotificationDisplayService } from "./notification-display.service";
import { ToastContent } from "./notification-content.interface";

/**
 * Renders the `<cds-toast-notification>` web component from `notificationObj`.
 * Use `NotificationService.showToast()` to create one dynamically.
 *
 * [See demo](../../?path=/story/components-notification--toast)
 */
@Component({
	selector: "cds-toast",
	template: `
		<cds-toast-notification
			[id]="toastID"
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
				@if (notificationObj.subtitle) {
					<span slot="subtitle" [innerHTML]="notificationObj.subtitle"></span>
				}
				@if (notificationObj.caption) {
					<span slot="caption" [innerHTML]="notificationObj.caption"></span>
				}
			}
		</cds-toast-notification>
	`,
	styles: [":host { display: contents; }"],
	providers: [NotificationDisplayService],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet, AsyncPipe],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Toast extends BaseNotification implements OnInit {
	private static toastCount = 0;

	toastID = `toast-${Toast.toastCount++}`;

	@Input() set notificationObj(obj: ToastContent) {
		if (obj.closeLabel && !isObservable(obj.closeLabel)) {
			obj.closeLabel = of(obj.closeLabel);
		}
		this._notificationObj = Object.assign({}, this.defaultNotificationObj, obj);
	}
	get notificationObj(): ToastContent {
		return this._notificationObj as ToastContent;
	}

	ngOnInit() {
		if (!this.notificationObj.closeLabel) {
			this.notificationObj.closeLabel = of(this.i18n.get().NOTIFICATION.CLOSE_BUTTON);
		}
	}
}
