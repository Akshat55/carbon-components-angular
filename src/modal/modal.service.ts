/**
 * Copyright IBM Corp. 2024
 *
 * ModalService
 *
 * Restores the old carbon-components-angular ModalService on top of the
 * modal web components. Two flavours, same as before:
 *
 * 1. `show(data: AlertModalData)` — builds an alert modal entirely out of
 *    dynamically created web component elements (<cds-modal>,
 *    <cds-modal-header>, <cds-modal-footer-button>, …). No Angular component
 *    is needed since the web component owns rendering, focus and overlay.
 *
 * 2. `create({component, inputs})` — dynamically instantiates a *user*
 *    Angular component (typically one whose template contains <cds-modal>
 *    with our directives) via Angular's `createComponent()`. This keeps full
 *    Angular functionality — DI, bindings, outputs — inside the modal while
 *    the rendering is done by the Lit web components.
 *
 * `destroy()` closes/removes whatever the service created last, and both
 * methods return handles for individual cleanup.
 */
import {
	ApplicationRef,
	ComponentRef,
	createComponent,
	EnvironmentInjector,
	Injectable,
	NgZone,
	Type
} from "@angular/core";
import CDSModal from "@carbon/web-components/es/components/modal/modal.js";
import CDSModalHeader from "@carbon/web-components/es/components/modal/modal-header.js";
import CDSModalHeading from "@carbon/web-components/es/components/modal/modal-heading.js";
import CDSModalLabel from "@carbon/web-components/es/components/modal/modal-label.js";
import CDSModalBody from "@carbon/web-components/es/components/modal/modal-body.js";
import CDSModalBodyContent from "@carbon/web-components/es/components/modal/modal-body-content.js";
import CDSModalFooter from "@carbon/web-components/es/components/modal/modal-footer.js";
import CDSModalFooterButton from "@carbon/web-components/es/components/modal/modal-footer-button.js";
import CDSModalCloseButton from "@carbon/web-components/es/components/modal/modal-close-button.js";

import { AlertModalData, ModalButton } from "./alert-modal.interface";

// The service is `providedIn: "root"` and can be injected without
// ModalModule ever being imported — register the web components here too so
// dynamically created elements always upgrade.
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

@Injectable({ providedIn: "root" })
export class ModalService {
	// Tracks everything the service created, newest last.
	private _refs: Array<ComponentRef<any> | HTMLElement> = [];

	constructor(
		protected appRef: ApplicationRef,
		protected injector: EnvironmentInjector,
		protected ngZone: NgZone
	) { }

	/**
	 * Dynamically instantiates an Angular component as a modal.
	 * The component's template should contain a <cds-modal [open]="true">.
	 *
	 * Same call signature as the old service:
	 *   modalService.create({ component: MyModal, inputs: { modalText: "Hello" } });
	 */
	create<T>(data: { component: Type<T>; inputs?: { [key: string]: any } }): ComponentRef<T> {
		const componentRef = createComponent(data.component, {
			environmentInjector: this.injector
		});

		for (const [key, value] of Object.entries(data.inputs ?? {})) {
			componentRef.setInput
				? componentRef.setInput(key, value)
				: ((componentRef.instance as any)[key] = value);
		}

		this.appRef.attachView(componentRef.hostView);
		const hostElement = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
		document.body.appendChild(hostElement);
		componentRef.changeDetectorRef.detectChanges();

		// Auto-cleanup when the modal inside the component closes.
		hostElement.addEventListener("cds-modal-closed", () => {
			this.destroy(componentRef);
		});

		this._refs.push(componentRef);
		return componentRef;
	}

	/**
	 * Shows an alert modal built from dynamically created web components.
	 * Same `AlertModalData` shape as before. Returns the <cds-modal> element.
	 */
	show(data: AlertModalData): HTMLElement {
		const modal = document.createElement("cds-modal");
		modal.setAttribute("size", data.size ?? "md");
		if ((data.type ?? data.modalType) === "danger") {
			modal.setAttribute("alert", "");
		}

		// ------------------------------------------------------------ header
		const header = document.createElement("cds-modal-header");
		if (data.showCloseButton !== false) {
			header.appendChild(document.createElement("cds-modal-close-button"));
		}
		if (data.label) {
			const label = document.createElement("cds-modal-label");
			label.textContent = data.label;
			header.appendChild(label);
		}
		if (data.title) {
			const heading = document.createElement("cds-modal-heading");
			heading.textContent = data.title;
			header.appendChild(heading);
		}
		modal.appendChild(header);

		// -------------------------------------------------------------- body
		if (data.content) {
			const body = document.createElement("cds-modal-body");
			const content = document.createElement("cds-modal-body-content");
			content.innerHTML = data.content;
			body.appendChild(content);
			modal.appendChild(body);
		}

		// ------------------------------------------------------------ footer
		if (data.buttons?.length) {
			const footer = document.createElement("cds-modal-footer");
			data.buttons.forEach((button: ModalButton) => {
				const footerButton = document.createElement("cds-modal-footer-button");
				// The web component's kind uses single dashes.
				footerButton.setAttribute("kind", String(button.type ?? "primary").replace("--", "-"));
				footerButton.textContent = button.text;
				footerButton.addEventListener("click", () => {
					this.ngZone.run(() => {
						if (button.click) {
							button.click();
						}
						this._close(modal, data);
					});
				});
				footer.appendChild(footerButton);
			});
			modal.appendChild(footer);
		}

		// Close (x / overlay / escape) handled by the web component.
		modal.addEventListener("cds-modal-closed", () => {
			this.ngZone.run(() => {
				if (!data.close || data.close() !== false) {
					modal.remove();
				}
			});
		});

		document.body.appendChild(modal);
		// Open after append so the web component runs its focus/overlay logic.
		modal.setAttribute("open", "");

		this._refs.push(modal);
		return modal;
	}

	/**
	 * Destroys a specific modal, or the most recently created one when no
	 * argument is given — same semantics as the old service.
	 */
	destroy(ref?: ComponentRef<any> | HTMLElement): void {
		const target = ref ?? this._refs[this._refs.length - 1];
		if (!target) {
			return;
		}

		if (target instanceof HTMLElement) {
			target.remove();
		} else {
			this.appRef.detachView(target.hostView);
			target.destroy();
		}

		this._refs = this._refs.filter((existing) => existing !== target);
	}

	private _close(modal: HTMLElement, data: AlertModalData): void {
		if (!data.close || data.close() !== false) {
			modal.removeAttribute("open");
			modal.remove();
			this._refs = this._refs.filter((existing) => existing !== modal);
		}
	}
}
