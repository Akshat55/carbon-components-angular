/**
 * Copyright IBM Corp. 2024
 *
 * ModalModule
 *
 * Drop-in replacement for the old carbon-components-angular ModalModule.
 * Registers the modal web components and exports the thin Angular directive
 * that maps the old @Input/@Output API onto them.
 *
 * `ModalService` is preserved — it dynamically creates the modal web
 * components (or instantiates a user Angular component) at runtime.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import CDSModal from "@carbon/web-components/es/components/modal/modal.js";
import CDSModalHeader from "@carbon/web-components/es/components/modal/modal-header.js";
import CDSModalHeading from "@carbon/web-components/es/components/modal/modal-heading.js";
import CDSModalLabel from "@carbon/web-components/es/components/modal/modal-label.js";
import CDSModalBody from "@carbon/web-components/es/components/modal/modal-body.js";
import CDSModalBodyContent from "@carbon/web-components/es/components/modal/modal-body-content.js";
import CDSModalFooter from "@carbon/web-components/es/components/modal/modal-footer.js";
import CDSModalFooterButton from "@carbon/web-components/es/components/modal/modal-footer-button.js";
import CDSModalCloseButton from "@carbon/web-components/es/components/modal/modal-close-button.js";

import { CdsModalDirective, CdsModalContentDirective } from "./modal.directive";
import { ModalService } from "./modal.service";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-modal", CDSModal);
safeDefine("cds-modal-header", CDSModalHeader);
safeDefine("cds-modal-heading", CDSModalHeading);
safeDefine("cds-modal-label", CDSModalLabel);
safeDefine("cds-modal-body", CDSModalBody);
safeDefine("cds-modal-body-content", CDSModalBodyContent);
safeDefine("cds-modal-footer", CDSModalFooter);
safeDefine("cds-modal-footer-button", CDSModalFooterButton);
safeDefine("cds-modal-close-button", CDSModalCloseButton);

@NgModule({
	imports: [
		CommonModule,
		CdsModalDirective,
		CdsModalContentDirective
	],
	exports: [
		CdsModalDirective,
		CdsModalContentDirective
	],
	providers: [ModalService],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalModule { }
