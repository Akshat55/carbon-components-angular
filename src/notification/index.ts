/**
 * Public API surface for the Angular notification layer.
 */
export { NotificationModule } from "./notification.module";
export {
	CdsInlineNotificationDirective,
	CdsToastNotificationDirective,
	CdsActionableNotificationDirective
} from "./notification.directive";
export { NotificationService } from "./notification.service";
export * from "./notification-content.interface";
