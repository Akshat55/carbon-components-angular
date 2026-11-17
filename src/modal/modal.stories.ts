import { moduleMetadata, Meta } from "@storybook/angular";
import { PLACEHOLDER_SERVICE_PROVIDER, Placeholder } from "../placeholder";
import {
	Modal,
	ModalBody,
	ModalBodyContent,
	ModalContent,
	ModalContentText,
	ModalFooter,
	ModalFooterButton,
	ModalHeader,
	ModalHeaderHeading,
	ModalHeaderLabel,
	ModalHeading,
	ModalLabel
} from "./";
import { CdsTextInput } from "../input";
import { Select, SelectItem } from "../select";
import { InputModule } from "../input";
import { IconModule } from "../icon";
import { AILabelModule } from "../ai-label";
import { AI_LABEL_INNER } from "../storybook/ai-label-story-shared";

import {
	ModalStory,
	SampleModal,
	InputModal,
	DataPassingModal,
	AlertModalStory,
	SampleFormModal
} from "./stories";
import { ButtonModule } from "../button";

export default {
	title: "Components/Modal",
	decorators: [
		moduleMetadata({
			imports: [
				// imports for the modals
				Modal,
				ModalHeader,
				ModalFooter,
				ModalContent,
				ModalContentText,
				ModalHeaderHeading,
				ModalHeaderLabel,
				ModalHeading,
				ModalLabel,
				ModalBody,
				ModalBodyContent,
				ModalFooterButton,
				CdsTextInput,
				Select,
				SelectItem,
				Placeholder,
				// stories
				ModalStory,
				SampleModal,
				InputModal,
				DataPassingModal,
				AlertModalStory,
				SampleFormModal,
				IconModule,
				InputModule,
				AILabelModule,
				ButtonModule
			],
			providers: [PLACEHOLDER_SERVICE_PROVIDER]
		})
	],
	parameters:{
		docs: {
			story: {
				inline: false,
				height: "30rem"
			}
		},
		layout: "centered"
	}
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<!--
		app-* components are for demo purposes only.
		You can create your own implementation by using the component source found at:
		https://github.com/IBM/carbon-components-angular/tree/master/src/modal/stories/modal.component.ts
		-->
		<app-modal-story
			[modalText]="modalText"
			[size]="size"
			[showCloseButton]="showCloseButton"
			[isFullWidth]="isFullWidth"
			[ariaLabelledby]="ariaLabelledby">
		</app-modal-story>
		<cds-placeholder></cds-placeholder>
	`
});
export const Basic = Template.bind({});
Basic.args = {
	modalText: "Hello, world!",
	showCloseButton: true,
	isFullWidth: false,
	ariaLabelledby: "sample-modal-heading"
};

const FormTemplate = (args) => ({
	props: args,
	template: `
		<!--
		app-* components are for demo purposes only.
		You can create your own implementation by using the component source found at:
		https://github.com/IBM/carbon-components-angular/tree/master/src/modal/stories/form-modal.component.ts
		-->
		<app-form-modal></app-form-modal>
	`
});
export const FormModal = FormTemplate.bind({});

const TransactionTemplate = (args) => ({
	props: args,
	template: `
		<!--
		app-* components are for demo purposes only.
		You can create your own implementation by using the component source found at:
		https://github.com/IBM/carbon-components-angular/tree/master/src/modal/stories/alert-modal.component.ts
		-->
		<app-alert-modal-story
			[modalType]="modalType"
			[modalLabel]="modalLabel"
			[modalTitle]="modalTitle"
			[modalContent]="modalContent"
			[size]="size"
			[showCloseButton]="showCloseButton"
			[buttons]="buttons">
		</app-alert-modal-story>
		<cds-placeholder></cds-placeholder>
	`
});
export const Transactional = TransactionTemplate.bind({});
Transactional.args = {
	modalLabel: "Optional label",
	modalTitle: "Delete service from application",
	modalContent: "Are you sure you want to remove the Speech to Text service from the node-test app?",
	showCloseButton: true,
	buttons: [{
		text: "Cancel",
		type: "Secondary"
	}, {
		text: "Delete",
		type: "primary",
		click: () => {
			alert("Delete button clicked!");
		}
	}]
};

const PassiveTemplate = (args) => ({
	props: args,
	template: `
		<!--
		app-* components are for demo purposes only.
		You can create your own implementation by using the component source found at:
		https://github.com/IBM/carbon-components-angular/tree/master/src/modal/stories/alert-modal.component.ts
		-->
		<app-alert-modal-story
			[modalType]="modalType"
			[modalLabel]="modalLabel"
			[modalTitle]="modalTitle"
			[size]="size"
			[modalContent]="modalContent">
		</app-alert-modal-story>
		<cds-placeholder></cds-placeholder>
	`
});
export const Passive = PassiveTemplate.bind({});
Passive.args = {
	modalLabel: "Optional label",
	modalTitle: "Delete service from application",
	modalContent: "Are you sure you want to remove the Speech to Text service from the node-test app?",
	modalType: "default"
};
Passive.argTypes = {
	modalType: {
		options: ["default", "danger"],
		control: "select"
	}
};

const DataPassingTemplate = (args) => ({
	props: args,
	template: `
		<!--
		app-* components are for demo purposes only.
		You can create your own implementation by using the component source found at:
		https://github.com/IBM/carbon-components-angular/tree/master/src/modal/stories/data-passing.component.ts
		-->
		<app-data-passing-modal
			[modalText]="modalText"
			[size]="size">
		</app-data-passing-modal>
		<cds-placeholder></cds-placeholder>
	`
});
export const DataPassing = DataPassingTemplate.bind({});
DataPassing.args = {
	modalText: "Hello, world!",
	size: "md"
};
DataPassing.argTypes = {
	size: {
		options: ["xs", "sm", "md", "lg"],
		control: "select"
	}
};

const SimpleTemplate = (args) => ({
	props: args,
	template: `
		<cds-button #trigger (click)="open = true">Open</cds-button>
		<cds-modal [open]="open" [trigger]="trigger" (overlaySelected)="open = false" (close)="open = false">
			<cds-modal-header (closeSelect)="open = false" [showCloseButton]="showCloseButton">
				<cds-modal-label>No service required</cds-modal-label>
				<cds-modal-heading>A very simple modal</cds-modal-heading>
			</cds-modal-header>
			<cds-modal-body>
				<cds-modal-body-content>hello world</cds-modal-body-content>
			</cds-modal-body>
			<cds-modal-footer>
				<cds-modal-footer-button kind="primary" data-modal-primary-focus (click)="open = false">Okay</cds-modal-footer-button>
			</cds-modal-footer>
		</cds-modal>
	`
});
export const Simple = SimpleTemplate.bind({});
Simple.args = {
	open: true,
	showCloseButton: true
};

const withAILabelTemplate = (args) => ({
	props: args,
	template: `
		<cds-modal
			[open]="open"
			[decorator]="decoratorTpl"
			(overlaySelected)="open = false"
			(close)="open = false">
			<cds-modal-header [decorator]="decoratorTpl" (closeSelect)="open = false" [showCloseButton]="showCloseButton">
				<cds-modal-heading>Modal with decorator</cds-modal-heading>
			</cds-modal-header>
			<cds-modal-body>
				<cds-modal-body-content>The decorator is shown in the modal header.</cds-modal-body-content>
			</cds-modal-body>
			<cds-modal-footer>
				<cds-modal-footer-button kind="primary" data-modal-primary-focus (click)="open = false">Close</cds-modal-footer-button>
			</cds-modal-footer>
		</cds-modal>
		<ng-template #decoratorTpl>
			<cds-ai-label
				kind="default"
				size="sm"
				[autoAlign]="true"
				aiText="AI"
				ariaLabel="Show information">
				` + AI_LABEL_INNER + `
			</cds-ai-label>
		</ng-template>
	`
});
export const withAILabel = withAILabelTemplate.bind({});
withAILabel.args = {
	open: true,
	showCloseButton: true
};

/**
 * Composed pattern: launch control, full header (label + title), scrolling body with fields,
 * footer actions, and shared AI label on the modal shell.
 */
const composedWithAILabelTemplate = (args) => ({
	props: args,
	styles: [
		`
		.ai-label-modal cds-select {
			margin-top: 1rem;
		}
		`
	],
	template: `
		<div class="ai-label-modal">
			<cds-button #launchBtn (click)="open = true">Launch composed modal</cds-button>
			<cds-modal
				[open]="open"
				[decorator]="decoratorTpl"
				[trigger]="launchBtn"
				(overlaySelected)="open = false"
				(close)="open = false">
				<cds-modal-header [decorator]="decoratorTpl" (closeSelect)="open = false" [showCloseButton]="showCloseButton">
					<cds-modal-label>Account resources</cds-modal-label>
					<cds-modal-heading>Add a custom domain</cds-modal-heading>
				</cds-modal-header>
				<cds-modal-body>
					<cds-modal-body-content description>
						Custom domains direct requests for your apps in this Cloud Foundry
						organization to a URL that you own. A custom domain can be a
						shared domain, a shared subdomain, or a shared domain and host.
					</cds-modal-body-content>
					<cds-text-input
						label="Domain name"
						placeholder="e.g. github.com"
						data-modal-primary-focus />
					<cds-select label="Region">
						<cds-select-item value="us-south">US South</cds-select-item>
						<cds-select-item value="us-east">US East</cds-select-item>
					</cds-select>
				</cds-modal-body>
				<cds-modal-footer>
					<cds-modal-footer-button kind="secondary" (click)="open = false">Cancel</cds-modal-footer-button>
					<cds-modal-footer-button kind="primary" (click)="open = false">Save</cds-modal-footer-button>
				</cds-modal-footer>
			</cds-modal>
		</div>
		<ng-template #decoratorTpl>
			<cds-ai-label
				kind="default"
				size="md"
				[autoAlign]="true"
				aiText="AI"
				ariaLabel="Show information">
				` + AI_LABEL_INNER + `
			</cds-ai-label>
		</ng-template>
	`
});

export const composedWithAILabel = composedWithAILabelTemplate.bind({});
composedWithAILabel.storyName = "Composed with AI label";
composedWithAILabel.args = {
	open: true,
	showCloseButton: true
};
