import { Component } from "@angular/core";
import {
	BaseModal,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalHeading,
	ModalLabel
} from "../";
import { CdsTextInput } from "../../input";

@Component({
	selector: "app-form-modal",
	template: `
		<cds-modal
			size="lg"
			open="true"
			(overlaySelected)="closeModal()">
			<cds-modal-header (closeSelect)="closeModal()">
				<cds-modal-label>Label</cds-modal-label>
				<cds-modal-heading>Modal</cds-modal-heading>
			</cds-modal-header>
			<cds-modal-body>
				<h1 class="cds--modal-content__regular-content modal-text">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis finibus erat vel aliquam sodales.
					Phasellus porta velit vel libero pulvinar, sit amet semper purus volutpat.
				</h1>
				<div class="cds--text-input__field-wrapper">
					<cds-text-input [label]="label" helperText="Helper text" placeholder="Placeholder" autocomplete="off" />
				</div>
			</cds-modal-body>
			<cds-modal-footer>
				<button class="cds--btn cds--btn--secondary" (click)="closeModal()">Show secondary modal</button>
				<button class="cds--btn cds--btn--primary" modal-primary-focus (click)="closeModal()">Close</button>
			</cds-modal-footer>
		</cds-modal>
	`,
	styles: [`
		.modal-text {
			margin-bottom: 30px;
		}
	`],
	imports: [
		Modal,
		ModalHeader,
		ModalLabel,
		ModalHeading,
		ModalFooter,
		CdsTextInput,
		ModalBody
	],
	standalone: true
})
export class SampleFormModal extends BaseModal {}
