/**
 * Storybook stories for the Angular modal directive layer.
 * The directive maps the old @Input/@Output API onto the <cds-modal>
 * web component and its child elements. `ModalService` demonstrates
 * dynamic creation of the web components at runtime.
 */
import { Component } from "@angular/core";
import { Meta, moduleMetadata } from "@storybook/angular";
import { ModalModule, ModalService } from "./index";

/**
 * Story host component demonstrating `ModalService` — the service builds the
 * alert modal out of dynamically created web components at runtime.
 */
@Component({
	selector: "app-modal-service-story",
	template: `
		<button (click)="openAlert()">Open alert modal (service)</button>
	`
})
class ModalServiceStory {
	constructor(protected modalService: ModalService) { }

	openAlert() {
		this.modalService.show({
			type: "default",
			label: "Optional label",
			title: "Created by ModalService",
			content: "This modal's DOM was generated at runtime with document.createElement — no template needed.",
			size: "md",
			buttons: [
				{ text: "Cancel", type: "secondary" },
				{ text: "OK", type: "primary", click: () => console.log("OK clicked") }
			],
			close: () => {
				console.log("modal closed");
				return true;
			}
		});
	}
}

export default {
	title: "Components/Modal",
	decorators: [
		moduleMetadata({
			imports: [ModalModule],
			declarations: [ModalServiceStory]
		})
	],
	argTypes: {
		size: { control: "radio", options: ["xs", "sm", "md", "lg"] },
		theme: { control: "radio", options: ["default", "danger"] },
		isFullWidth: { control: "boolean" },
		close: { action: "close" },
		overlaySelected: { action: "overlaySelected" }
	},
	args: {
		size: "md",
		theme: "default",
		isFullWidth: false
	}
} as Meta;

export const Basic = (args) => ({
	props: { ...args, open: false },
	template: `
		<button (click)="open = true">Open modal</button>
		<cds-modal
			[open]="open"
			[size]="size"
			[theme]="theme"
			[isFullWidth]="isFullWidth"
			(close)="open = false; close($event)"
			(overlaySelected)="overlaySelected($event)">
			<cds-modal-header>
				<cds-modal-close-button></cds-modal-close-button>
				<cds-modal-label>Optional label</cds-modal-label>
				<cds-modal-heading>Modal heading</cds-modal-heading>
			</cds-modal-header>
			<cds-modal-body>
				<cds-modal-body-content>
					Modal body content. The web component handles focus trapping,
					overlay, and scrolling behaviour.
				</cds-modal-body-content>
			</cds-modal-body>
			<cds-modal-footer>
				<cds-modal-footer-button kind="secondary" data-modal-close>Cancel</cds-modal-footer-button>
				<cds-modal-footer-button>Save</cds-modal-footer-button>
			</cds-modal-footer>
		</cds-modal>
	`
});

export const WithModalService = () => ({
	template: `<app-modal-service-story></app-modal-service-story>`
});
WithModalService.storyName = "Dynamic (ModalService)";
WithModalService.parameters = { controls: { disable: true } };
