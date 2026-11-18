import { Component, inject } from "@angular/core";
import {
	ModalService,
	BaseModal,
	Modal,
	ModalHeader,
	ModalFooter
} from "../";
import { CdsTextInput } from "../../input";
import { PLACEHOLDER_SERVICE_PROVIDER } from "../../placeholder";

@Component({
	selector: "app-input-modal",
	template: `
		<cds-modal
			[size]="size"
			[open]="open"
			(overlaySelected)="closeModal()">
			<cds-modal-header (closeSelect)="closeModal()">Edit account name</cds-modal-header>
			<section class="cds--modal-content">
				<cds-text-input label="Account name" [value]="inputValue" (input)="onChange($event)" />
			</section>
			<cds-modal-footer>
				<button class="cds--btn cds--btn--secondary" (click)="closeModal()">Cancel</button>
				<button class="cds--btn cds--btn--primary" modal-primary-focus (click)="closeModal()">Save</button>
			</cds-modal-footer>
		</cds-modal>
	`,
	standalone: true,
	imports: [
		Modal,
		ModalHeader,
		CdsTextInput,
		ModalFooter
	],
	providers: [ModalService, PLACEHOLDER_SERVICE_PROVIDER]
})
export class InputModal extends BaseModal {
	public modalText = inject<any>("modalText" as any);
	public size = inject<any>("size" as any);
	public data = inject<any>("data" as any);
	public inputValue = inject<any>("inputValue" as any);
	protected modalService = inject(ModalService);

	onChange(event) {
		this.data.next(event.target.value);
	}
}
