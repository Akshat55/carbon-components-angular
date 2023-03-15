import { Component, OnInit } from "@angular/core";
import { BaseModal } from "../../modal";

@Component({
	selector: "app-sample",
	template: `
	<!-- Trigger attribute in ibm-modal was binded to a variable that did not exist -->
	<!-- showCloseButton attribute in ibm-modal-header was binded to a variable that did not exist -->
	<ibm-modal [open]="open" (overlaySelected)="open = false">
	<ibm-modal-header
		(closeSelect)="open = false"
		[showCloseButton]="showCloseButton"
	>
		<p class="bx--modal-header__label bx--type-delta">No service required</p>
		<p class="bx--modal-header__heading bx--type-beta">A very simple modal</p>
	</ibm-modal-header>
	<div class="bx--modal-content">
		<p>hello world</p>
	</div>
	<ibm-modal-footer>
		<ng-container>
		<button
			ibmButton="primary"
			(click)="open = false"
			[attr.modal-primary-focus]="true"
		>
			Okay
		</button>
		</ng-container>
	</ibm-modal-footer>
	</ibm-modal>

	`
})
export class SampleComponent extends BaseModal implements OnInit {
	showLoadingSpinner = false;

	constructor() {
		super();
	}

	ngOnInit(): void { }
}
