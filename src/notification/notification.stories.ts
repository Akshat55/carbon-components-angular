/**
 * Storybook stories for the Angular notification directive layer.
 * The directives map the old `[notificationObj]` API onto the notification
 * web components.
 */
import { Component } from "@angular/core";
import { Meta, moduleMetadata } from "@storybook/angular";
import { NotificationModule, NotificationService } from "./index";

/**
 * Story host component demonstrating `NotificationService` — the service
 * dynamically creates notification web components at runtime.
 */
@Component({
	selector: "app-notification-service-story",
	template: `
		<button (click)="showToast()">Show toast (service)</button>
		<button (click)="showInline()" style="margin-left: 0.5rem">Show inline (service)</button>
		<div id="notification-target" style="margin-top: 1rem"></div>
	`
})
class NotificationServiceStory {
	constructor(protected notificationService: NotificationService) { }

	showToast() {
		this.notificationService.showToast({
			type: "success",
			title: "Created dynamically",
			subtitle: "This toast element was created by NotificationService.",
			caption: String(new Date()),
			duration: 5000
		});
	}

	showInline() {
		this.notificationService.showNotification({
			type: "info",
			title: "Inline notification",
			message: "Rendered into #notification-target.",
			target: "#notification-target"
		});
	}
}

export default {
	title: "Components/Notification",
	decorators: [
		moduleMetadata({
			imports: [NotificationModule],
			declarations: [NotificationServiceStory]
		})
	],
	argTypes: {
		close: { action: "close" }
	}
} as Meta;

export const DynamicWithService = () => ({
	template: `<app-notification-service-story></app-notification-service-story>`
});
DynamicWithService.storyName = "Dynamic (NotificationService)";
DynamicWithService.parameters = { controls: { disable: true } };

export const Inline = (args) => ({
	props: {
		...args,
		notificationObj: {
			type: "info",
			title: "Sample notification",
			message: "Sample subtitle message",
			showClose: true,
			lowContrast: false
		}
	},
	template: `
		<cds-inline-notification
			[notificationObj]="notificationObj"
			(close)="close($event)">
		</cds-inline-notification>
	`
});

export const Toast = (args) => ({
	props: {
		...args,
		notificationObj: {
			type: "success",
			title: "Toast title",
			subtitle: "Toast subtitle",
			caption: "Toast caption",
			showClose: true
		}
	},
	template: `
		<cds-toast-notification
			[notificationObj]="notificationObj"
			(close)="close($event)">
		</cds-toast-notification>
	`
});

export const Actionable = (args) => ({
	props: {
		...args,
		notificationObj: {
			type: "error",
			title: "Actionable notification",
			message: "Something requires your attention",
			showClose: true
		}
	},
	template: `
		<cds-actionable-notification
			[notificationObj]="notificationObj"
			[inline]="true"
			(close)="close($event)">
			<cds-actionable-notification-button slot="action">Action</cds-actionable-notification-button>
		</cds-actionable-notification>
	`
});
