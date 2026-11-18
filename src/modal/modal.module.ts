// modules
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// imports
import { BaseModalService } from "./base-modal.service";
import { ModalService } from "./modal.service";
import { Modal } from "./modal.component";
import { ModalFooter } from "./modal-footer.component";
import { ModalHeader } from "./modal-header.component";
import { AlertModal } from "./alert-modal.component";
import { ButtonModule } from "carbon-components-angular/forms";
import { I18nModule } from "carbon-components-angular/i18n";
import { PlaceholderModule } from "carbon-components-angular/placeholder";
import { ExperimentalModule } from "carbon-components-angular/experimental";
import { BaseModal } from "./base-modal.class";
import { IconModule } from "carbon-components-angular/icon";
import { ModalHeading, ModalLabel, ModalBody, ModalBodyContent, ModalCloseButton, ModalFooterButton } from "./modal-parts.component";

@NgModule({
	exports: [
		AlertModal,
		Modal,
		ModalHeader,
		ModalFooter,
		BaseModal,
		ModalHeading,
		ModalLabel,
		ModalBody,
		ModalBodyContent,
		ModalCloseButton,
		ModalFooterButton
	],
	providers: [BaseModalService, ModalService],
	imports: [
		CommonModule,
		ButtonModule,
		I18nModule,
		PlaceholderModule,
		ExperimentalModule,
		IconModule,
		AlertModal,
		Modal,
		ModalHeader,
		ModalFooter,
		BaseModal,
		ModalHeading,
		ModalLabel,
		ModalBody,
		ModalBodyContent,
		ModalCloseButton,
		ModalFooterButton
	]
})
export class ModalModule {}
