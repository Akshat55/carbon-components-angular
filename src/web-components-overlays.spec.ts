import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input } from "@angular/core";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";

import { AILabelActions, AILabelComponent, AILabelContent } from "carbon-components-angular/ai-label";
import { ButtonSet, CdsButton, IconButton } from "carbon-components-angular/button";
import { ComboButtonComponent } from "carbon-components-angular/combo-button";
import {
	ContextMenuComponent,
	ContextMenuDividerComponent,
	ContextMenuGroupComponent,
	ContextMenuItemComponent
} from "carbon-components-angular/context-menu";
import { OverflowMenu, OverflowMenuOption } from "carbon-components-angular/dialog";
import { MenuButtonComponent } from "carbon-components-angular/menu-button";
import {
	BaseModal,
	Modal,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalHeaderHeading,
	ModalService
} from "carbon-components-angular/modal";
import { NotificationService } from "carbon-components-angular/notification";
import { Placeholder, PLACEHOLDER_SERVICE_PROVIDER } from "carbon-components-angular/placeholder";
import { PopoverContainer, PopoverContent } from "carbon-components-angular/popover";
import { ToggletipButton, ToggletipContent, ToggletipLabel, Toggletip } from "carbon-components-angular/toggletip";
import { Tooltip, TooltipDefinition } from "carbon-components-angular/tooltip";

const render = (template: string, imports: any[], props: Record<string, any> = {}, providers: any[] = []) => {
	@Component({ template, imports, providers, schemas: [CUSTOM_ELEMENTS_SCHEMA] })
	class Host {}
	const fixture = TestBed.createComponent(Host);
	Object.assign(fixture.componentInstance, props);
	fixture.detectChanges();
	return fixture;
};

const beingClosed = (element: Element, triggeredBy: Element) => {
	const event = new CustomEvent("cds-modal-beingclosed", { bubbles: true, cancelable: true, detail: { triggeredBy } });
	element.dispatchEvent(event);
	return event;
};

describe("Modal", () => {
	const template = `
		<cds-modal [open]="open" (overlaySelected)="onOverlay()" (close)="onClose()">
			<cds-modal-header (closeSelect)="onHeaderClose()">
				<h3 cdsModalHeaderHeading>Heading</h3>
			</cds-modal-header>
			<section cdsModalContent>Content</section>
			<cds-modal-footer><cds-button>OK</cds-button></cds-modal-footer>
		</cds-modal>`;
	const imports = [Modal, ModalHeader, ModalHeaderHeading, ModalContent, ModalFooter, CdsButton];
	let fixture;
	let host: any;
	let modal: any;

	beforeEach(() => {
		host = {
			open: true,
			onOverlay: jasmine.createSpy("overlay"),
			onClose: jasmine.createSpy("close"),
			onHeaderClose: jasmine.createSpy("headerClose")
		};
		fixture = render(template, imports, host);
		modal = fixture.nativeElement.querySelector("cds-modal");
	});

	it("should render the web component and keep v6 content", () => {
		expect(modal instanceof customElements.get("cds-modal")).toBe(true);
		expect(modal.open).toBe(true);
		expect(modal.querySelector("cds-modal-header cds-modal-close-button")).toBeTruthy();
		expect(modal.querySelector("[cdsModalContent]").textContent).toBe("Content");
	});

	it("should emit overlaySelected (and stay open) when the user clicks outside", () => {
		const event = beingClosed(modal, modal);
		expect(event.defaultPrevented).toBe(true);
		expect(host.onOverlay).toHaveBeenCalled();
		expect(modal.open).toBe(true);
	});

	it("should emit closeSelect from the header close button", () => {
		const closeButton = modal.querySelector("cds-modal-close-button");
		closeButton.click();
		beingClosed(modal, closeButton);
		expect(host.onHeaderClose).toHaveBeenCalled();
		expect(host.onOverlay).not.toHaveBeenCalled();
	});

	it("should emit close on Escape", () => {
		modal.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
		expect(host.onClose).toHaveBeenCalled();
	});
});

@Component({
	template: `
		<cds-modal [open]="open" (overlaySelected)="closeModal()">
			<section cdsModalContent>{{ message }}</section>
		</cds-modal>`,
	imports: [Modal, ModalContent]
})
class DynamicModal extends BaseModal {
	@Input() message = inject("message" as any, { optional: true });
}

describe("ModalService", () => {
	it("should create, open and destroy a modal dynamically", fakeAsync(() => {
		const fixture = render(`<cds-placeholder />`, [Placeholder], {}, [ModalService, PLACEHOLDER_SERVICE_PROVIDER]);
		const service = fixture.debugElement.injector.get(ModalService);
		const ref = service.create({ component: DynamicModal, inputs: { message: "Hello" } });
		tick();
		fixture.detectChanges();

		const modal: any = document.querySelector("cds-modal");
		expect(modal).toBeTruthy();
		expect(ref.instance.open).toBe(true);
		expect(modal.textContent).toContain("Hello");

		ref.instance.closeModal();
		tick(300);
		expect(document.querySelector("cds-modal")).toBeNull();
	}));
});

describe("NotificationService", () => {
	// Like `NotificationModule`, the service needs a component (for its `ViewContainerRef`).
	const notificationService = () => render("", [], {}, [NotificationService]).debugElement.injector.get(NotificationService);

	afterEach(() => document.querySelector(".notification-overlay")?.remove());

	it("should show a toast and remove it when closed", fakeAsync(() => {
		const service = notificationService();
		const toast = service.showToast({ type: "success", title: "Saved", subtitle: "All good", caption: "Now" });
		toast.componentRef.changeDetectorRef.detectChanges();

		const element: any = document.querySelector(".notification-overlay cds-toast-notification");
		expect(element instanceof customElements.get("cds-toast-notification")).toBe(true);
		expect(element.kind).toBe("success");
		expect(element.querySelector("[slot='title']").textContent).toBe("Saved");

		const event = new CustomEvent("cds-notification-beingclosed", { bubbles: true, cancelable: true });
		element.dispatchEvent(event);
		expect(event.defaultPrevented).toBe(true);
		tick(500);
		expect(document.querySelector(".notification-overlay cds-toast")).toBeNull();
	}));

	it("should show an inline notification with actions", () => {
		const service = notificationService();
		const click = jasmine.createSpy("click");
		const notification = service.showActionable({
			type: "info",
			title: "Update",
			message: "Restart?",
			actions: [{ text: "Restart", click }]
		});
		notification.componentRef.changeDetectorRef.detectChanges();

		const element: any = document.querySelector(".notification-overlay cds-actionable-notification");
		expect(element.kind).toBe("info");
		element.querySelector("cds-actionable-notification-button").click();
		expect(click).toHaveBeenCalled();
	});
});

describe("Context menu", () => {
	it("should keep radio group selection and emit itemClick", () => {
		const host = { value: "b", onValue: jasmine.createSpy("value"), onItem: jasmine.createSpy("item") };
		const fixture = render(`
			<cds-menu [open]="true">
				<cds-menu-group type="radio" [value]="value" (valueChange)="onValue($event)">
					<cds-menu-item label="A" type="radio" value="a" (itemClick)="onItem($event)" />
					<cds-menu-item label="B" type="radio" value="b" />
				</cds-menu-group>
				<cds-menu-divider />
				<cds-menu-item label="More"><cds-menu><cds-menu-item label="Child" /></cds-menu></cds-menu-item>
			</cds-menu>`,
		[ContextMenuComponent, ContextMenuGroupComponent, ContextMenuItemComponent, ContextMenuDividerComponent], host);

		const menu = fixture.nativeElement.querySelector("cds-menu");
		expect(menu instanceof customElements.get("cds-menu")).toBe(true);
		const [a, b] = menu.querySelectorAll("cds-menu-item-group cds-menu-item");
		expect(b.getAttribute("aria-checked")).toBe("true");
		expect(menu.querySelector("cds-menu-item-divider")).toBeTruthy();
		expect(menu.querySelector("cds-menu-item[label='More'] > cds-menu").getAttribute("slot")).toBe("submenu");

		a.click();
		fixture.detectChanges();
		expect(host.onItem).toHaveBeenCalledWith(jasmine.objectContaining({ value: "a", type: "radio" }));
		expect(host.onValue).toHaveBeenCalledWith("a");
		expect(a.getAttribute("aria-checked")).toBe("true");
		expect(b.getAttribute("aria-checked")).toBe("false");
	});
});

describe("Overlay and menu wrappers", () => {
	it("Tooltip renders its description as tooltip content", () => {
		const fixture = render(`<cds-tooltip description="Copy" align="bottom"><button>Copy</button></cds-tooltip>`, [Tooltip]);
		const tooltip: any = fixture.nativeElement.querySelector("cds-tooltip");
		expect(tooltip instanceof customElements.get("cds-tooltip")).toBe(true);
		expect(tooltip.align).toBe("bottom");
		expect(tooltip.querySelector("cds-tooltip-content").textContent.trim()).toBe("Copy");
	});

	it("TooltipDefinition renders the definition slot", () => {
		const fixture = render(`<cds-tooltip-definition description="Uniform Resource Locator">URL</cds-tooltip-definition>`, [TooltipDefinition]);
		const tooltip: any = fixture.nativeElement.querySelector("cds-definition-tooltip");
		expect(tooltip instanceof customElements.get("cds-definition-tooltip")).toBe(true);
		expect(tooltip.querySelector("[slot='definition']").textContent.trim()).toBe("Uniform Resource Locator");
	});

	it("Popover mirrors the web component's open state to isOpenChange", async () => {
		const host = { onOpen: jasmine.createSpy("open") };
		const fixture = render(`
			<cds-popover (isOpenChange)="onOpen($event)">
				<button>Toggle</button>
				<cds-popover-content>Content</cds-popover-content>
			</cds-popover>`, [PopoverContainer, PopoverContent], host);
		const popover: any = fixture.nativeElement.querySelector("cds-popover");
		expect(popover instanceof customElements.get("cds-popover")).toBe(true);
		popover.open = true;
		await popover.updateComplete;
		await new Promise(resolve => setTimeout(resolve));
		expect(host.onOpen).toHaveBeenCalledWith(true);
	});

	it("Toggletip places label, trigger and content in its slots", () => {
		const fixture = render(`
			<cds-toggletip>
				<span cdsToggletipLabel>Label</span>
				<span cdsToggletipButton><svg></svg></span>
				<div cdsToggletipContent>Details</div>
			</cds-toggletip>`, [Toggletip, ToggletipLabel, ToggletipButton, ToggletipContent]);
		const toggletip: any = fixture.nativeElement.querySelector("cds-toggletip");
		expect(toggletip instanceof customElements.get("cds-toggletip")).toBe(true);
		expect(toggletip.querySelector("[cdsToggletipButton]").getAttribute("slot")).toBe("trigger");
		expect(toggletip.querySelector("[cdsToggletipContent]").getAttribute("slot")).toBe("body-text");
	});

	it("AILabel places content and actions in its slots", () => {
		const fixture = render(`
			<cds-ai-label kind="inline" textLabel="Generated">
				<div cdsAILabelContent>Why</div>
				<div cdsAILabelActions>Actions</div>
			</cds-ai-label>`, [AILabelComponent, AILabelContent, AILabelActions]);
		const label: any = fixture.nativeElement.querySelector("cds-ai-label");
		expect(label instanceof customElements.get("cds-ai-label")).toBe(true);
		expect(label.kind).toBe("inline");
		expect(label.aiTextLabel).toBe("Generated");
		expect(label.querySelector("[cdsAILabelContent]").getAttribute("slot")).toBe("body-text");
		expect(label.querySelector("[cdsAILabelActions]").getAttribute("slot")).toBe("actions");
	});

	it("OverflowMenu renders options as overflow menu items", () => {
		const host = { onSelected: jasmine.createSpy("selected") };
		const fixture = render(`
			<cds-overflow-menu description="Options">
				<cds-overflow-menu-option (selected)="onSelected()">Edit</cds-overflow-menu-option>
				<cds-overflow-menu-option type="danger">Delete</cds-overflow-menu-option>
			</cds-overflow-menu>`, [OverflowMenu, OverflowMenuOption], host);
		const menu: any = fixture.nativeElement.querySelector("cds-overflow-menu");
		expect(menu instanceof customElements.get("cds-overflow-menu")).toBe(true);
		const [edit, remove] = menu.querySelectorAll("cds-overflow-menu-body cds-overflow-menu-item");
		expect(remove.danger).toBe(true);
		edit.click();
		expect(host.onSelected).toHaveBeenCalled();
	});

	it("IconButton puts the icon and description in their slots", () => {
		const fixture = render(`<cds-icon-button kind="ghost" description="Add"><svg></svg></cds-icon-button>`, [IconButton]);
		const button: any = fixture.nativeElement.querySelector("cds-icon-button");
		expect(button instanceof customElements.get("cds-icon-button")).toBe(true);
		expect(button.kind).toBe("ghost");
		expect(button.querySelector("[slot='icon'] svg")).toBeTruthy();
		expect(button.querySelector("[slot='tooltip-content']").textContent.trim()).toBe("Add");
	});

	it("ButtonSet passes stacked", () => {
		const fixture = render(`<cds-button-set [stacked]="true"><cds-button>A</cds-button></cds-button-set>`, [ButtonSet, CdsButton]);
		const set: any = fixture.nativeElement.querySelector("cds-button-set");
		expect(set instanceof customElements.get("cds-button-set")).toBe(true);
		expect(set.stacked).toBe(true);
	});

	it("MenuButton and ComboButton put their items in a cds-menu", () => {
		const host = { onAction: jasmine.createSpy("action") };
		const fixture = render(`
			<cds-menu-button label="Actions"><cds-menu-item label="One" /></cds-menu-button>
			<cds-combo-button label="Primary" (actionClick)="onAction()"><cds-menu-item label="Two" /></cds-combo-button>`,
		[MenuButtonComponent, ComboButtonComponent, ContextMenuItemComponent], host);
		const menuButton: any = fixture.nativeElement.querySelector("cds-menu-button");
		const comboButton: any = fixture.nativeElement.querySelector("cds-combo-button");
		expect(menuButton instanceof customElements.get("cds-menu-button")).toBe(true);
		expect(menuButton.label).toBe("Actions");
		expect(menuButton.querySelector("cds-menu cds-menu-item").label).toBe("One");
		expect(comboButton.querySelector("cds-menu cds-menu-item").label).toBe("Two");
		comboButton.onClick(new Event("click"));
		fixture.detectChanges();
		expect(host.onAction).toHaveBeenCalled();
	});
});
