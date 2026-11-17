import {
	Component,
	ViewChild,
	ElementRef,
	inject
} from "@angular/core";
import { BaseModal } from "./base-modal.class";
import { Modal } from "./modal.component";
import { ModalHeader } from "./modal-header.component";
import { ModalFooter } from "./modal-footer.component";
import {
	ModalBody,
	ModalBodyContent,
	ModalFooterButton,
	ModalHeading,
	ModalLabel
} from "./modal-parts.component";
import { BaseModalService } from "./base-modal.service";

/**
 * Component to create standard modals for presenting content or asking for user's input.
 * It can show as a passive modal showing only text or show as a transactional modal with
 * multiple buttons for different actions for the user to choose from.
 *
 * Using a modal in your application requires `cds-placeholder` which would generally be
 * placed near the end of your app component template (app.component.ts or app.component.html) as:
 *
 * ```html
 * <cds-placeholder></cds-placeholder>
 * ```
 *
 * Example of opening the modal:
 *
 * ```typescript
 * \@Component({
 *  selector: "app-modal-demo",
 *  template: `
 *   <button class="btn--primary" (click)="openModal()">Open modal</button>
 *   <cds-placeholder></cds-placeholder>`
 * })
 * export class ModalDemo {
 * 	openModal() {
 * 		this.modalService.show({
 *			modalType: "default",
 *			label: "optional header text",
 *			title: "Modal title",
 *			text: "Modal text",
 *			buttons: [{
 *				text: "Button text",
 *				type: "primary",
 *				click: clickFunction
 *			}]
 *		});
 * 	}
 * }
 * ```
 */
@Component({
	selector: "cds-alert-modal, ibm-alert-modal",
	template: `
		<cds-modal
			[size]="size"
			[theme]="type"
			[ariaLabel]="title"
			[hasScrollingContent]="hasScrollingContent"
			[open]="open"
			(overlaySelected)="dismissModal('overlay')">
			<cds-modal-header (closeSelect)="dismissModal('close')" [showCloseButton]="showCloseButton">
				@if (label) {
					<cds-modal-label>{{label}}</cds-modal-label>
				}
				<cds-modal-heading>{{title}}</cds-modal-heading>
			</cds-modal-header>
			<cds-modal-body #modalContent>
				<cds-modal-body-content [innerHTML]="content"></cds-modal-body-content>
			</cds-modal-body>
			@if (buttons.length > 0) {
				<cds-modal-footer>
					@for (button of buttons; track button.id; let i = $index) {
						<cds-modal-footer-button
							[kind]="kind(button.type)"
							(click)="buttonClicked(i)"
							[id]="button.id"
							[attr.data-modal-primary-focus]="(button.type.indexOf('primary') !== -1 ? '' : null)">
							{{button.text}}
						</cds-modal-footer-button>
					}
				</cds-modal-footer>
			}
		</cds-modal>
	`,
	providers: [BaseModalService],
	imports: [
		Modal,
		ModalHeader,
		ModalLabel,
		ModalHeading,
		ModalBody,
		ModalBodyContent,
		ModalFooter,
		ModalFooterButton
	]
})
export class AlertModal extends BaseModal {
	type = inject<any>("type" as any, { optional: true })! ?? "default";
	label = inject<string>("label" as any, { optional: true })!;
	title = inject<string>("title" as any, { optional: true })!;
	content = inject<string>("content" as any, { optional: true })!;
	size = inject<string>("size" as any, { optional: true })!;
	hasScrollingContent = inject<boolean>("hasScrollingContent" as any, { optional: true })! ?? null;
	buttons = inject<any>("buttons" as any, { optional: true })! ?? [];
	onClose = inject<Function>("close" as any, { optional: true })!;
	showCloseButton = inject<any>("showCloseButton" as any, { optional: true })! ?? true;

	/**
	 * The `cds-modal-body`. The web component makes it focusable when its content scrolls.
	 */
	@ViewChild("modalContent", { static: true, read: ElementRef }) modalContent: ElementRef<HTMLElement>;

	/** Inserted by Angular inject() migration for backwards compatibility */
	// eslint-disable-next-line @angular-eslint/prefer-inject -- backwards-compatible DI overload until next major
	constructor(...args: unknown[]);
	/**
	 * Creates an instance of `AlertModal`.
	 */
	constructor() {
		super();
		for (let i = 0; i < this.buttons.length; i++) {
			const button = this.buttons[i];
			if (!button.id) {
				button.id = `alert-modal-button-${i}`;
			}
			if (!button.type) {
				button.type = "secondary";
			}
		}
	}

	/**
	 * The `cds-modal-footer-button` kind of a button type (`danger--primary` is `danger`).
	 */
	kind(type: string) {
		return type === "danger--primary" ? "danger" : type;
	}

	buttonClicked(buttonIndex: string | number) {
		const button = this.buttons[buttonIndex];
		if (button.click) {
			button.click();
		}

		this.closeModal();
	}

	dismissModal(trigger: any) {
		if (this.onClose && this.onClose(trigger) === false) {
			return;
		}
		this.closeModal();
	}
}
