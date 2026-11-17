import { ApplicationRef, Component, createComponent, EnvironmentInjector, TemplateRef, ViewChild } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { Accordion } from "./accordion.component";
import { AccordionItem } from "./accordion-item.component";
import { settle } from "../test-helpers/web-components";

const rendered = (element: any) => element.updateComplete as Promise<boolean>;
const heading = (item: HTMLElement) => item.shadowRoot.querySelector<HTMLButtonElement>(".cds--accordion__heading");

@Component({
	template: `
		<cds-accordion [size]="size" align="start" [disabled]="accordionDisabled">
			<cds-accordion-item
				[title]="title"
				[context]="{ name: 'context' }"
				[disabled]="disabled"
				[skeleton]="skeleton"
				[(expanded)]="expanded"
				(selected)="onSelected($event)">
				<p class="content">test-content</p>
			</cds-accordion-item>
		</cds-accordion>
		<ng-template #titleTemplate let-name="name"><b class="title">Template {{name}}</b></ng-template>
	`,
	imports: [Accordion, AccordionItem]
})
class AccordionTest {
	@ViewChild("titleTemplate") titleTemplate: TemplateRef<any>;
	title: string | TemplateRef<any> = "Section 1";
	size = "md";
	disabled = false;
	accordionDisabled = false;
	skeleton = false;
	expanded = false;
	onSelected(_: { id: string, expanded: boolean }) {}
}

describe("Accordion", () => {
	let fixture;
	let wrapper: AccordionTest;
	let accordion;
	let item;

	const update = async (changes: Partial<AccordionTest> = {}) => {
		Object.assign(wrapper, changes);
		fixture.detectChanges();
		await rendered(accordion);
		await rendered(item);
	};

	beforeEach(async () => {
		fixture = TestBed.createComponent(AccordionTest);
		wrapper = fixture.componentInstance;
		accordion = fixture.nativeElement.querySelector("cds-accordion");
		item = fixture.nativeElement.querySelector("cds-accordion-item");
		await update();
	});

	it("should register and render the web components", () => {
		expect(accordion instanceof customElements.get("cds-accordion")).toBe(true);
		expect(item instanceof customElements.get("cds-accordion-item")).toBe(true);
		expect(item.querySelector(".content").textContent).toBe("test-content");
	});

	it("should pass inputs through to the web components", async () => {
		await update({ size: "lg" });
		expect(accordion.size).toBe("lg");
		expect(accordion.alignment).toBe("start");
		expect(item.title).toBe("Section 1");
		expect(item.shadowRoot.textContent).toContain("Section 1");
	});

	it("should expand on click, emit selected and update [(expanded)]", async () => {
		spyOn(wrapper, "onSelected");
		heading(item).click();
		await settle(fixture);

		expect(item.open).toBe(true);
		expect(wrapper.expanded).toBe(true);
		expect(wrapper.onSelected).toHaveBeenCalledWith({ id: item.id, expanded: true });
	});

	it("should open when expanded is set", async () => {
		await update({ expanded: true });
		expect(item.open).toBe(true);
	});

	it("should not expand disabled items", async () => {
		await update({ disabled: true });
		heading(item).click();
		await update();
		expect(item.open).toBe(false);
	});

	it("should let the web component disable its items", async () => {
		await update({ accordionDisabled: true });
		expect(item.disabled).toBe(true);
		expect(heading(item).disabled).toBe(true);

		await update({ accordionDisabled: false });
		expect(item.disabled).toBe(false);
	});

	it("should update [(expanded)] when the web component opens the item itself", async () => {
		spyOn(wrapper, "onSelected");
		item.open = true;
		await settle(fixture);
		expect(wrapper.expanded).toBe(true);
		expect(wrapper.onSelected).toHaveBeenCalledWith({ id: item.id, expanded: true });
	});

	it("should not emit when [expanded] is written", async () => {
		spyOn(wrapper, "onSelected");
		await update({ expanded: true });
		await settle(fixture);
		expect(wrapper.onSelected).not.toHaveBeenCalled();
	});

	it("should render a TemplateRef title with context in the title slot", async () => {
		await update({ title: wrapper.titleTemplate });
		const title = item.querySelector(".title");
		expect(title.getAttribute("slot")).toBe("title");
		expect(title.textContent).toBe("Template context");
		expect(item.title).toBe("");
	});

	it("should show skeleton text and not toggle while skeleton", async () => {
		await update({ skeleton: true });
		expect(item.querySelector("cds-skeleton-text[slot='title']")).toBeTruthy();
		expect(item.querySelector(".content")).toBeNull();

		heading(item).click();
		await update();
		expect(item.open).toBe(false);
	});

	it("should emit expandedChange from an item created dynamically", async () => {
		const ref = createComponent(AccordionItem, {
			environmentInjector: TestBed.inject(EnvironmentInjector),
			projectableNodes: [[document.createTextNode("Dynamic")]]
		});
		ref.setInput("title", "Dynamic");
		TestBed.inject(ApplicationRef).attachView(ref.hostView);
		accordion.appendChild(ref.location.nativeElement);
		await settle(fixture);
		const changes: boolean[] = [];
		ref.instance.expandedChange.subscribe(value => changes.push(value));

		heading(ref.location.nativeElement).click();
		await settle(fixture);

		expect(ref.location.nativeElement.open).toBe(true);
		expect(changes).toEqual([true]);
		ref.destroy();
	});
});

@Component({
	template: `
		<cds-accordion>
			<cds-accordion-item title="Own disabled" [disabled]="true">Content</cds-accordion-item>
			<cds-accordion-item title="Unset">Content</cds-accordion-item>
		</cds-accordion>
	`,
	imports: [Accordion, AccordionItem]
})
class AccordionStateTest {}

describe("Accordion defaults", () => {
	let fixture;
	let accordion;
	let items: any[];

	beforeEach(async () => {
		fixture = TestBed.createComponent(AccordionStateTest);
		await settle(fixture);
		accordion = fixture.nativeElement.querySelector("cds-accordion");
		items = Array.from(fixture.nativeElement.querySelectorAll("cds-accordion-item"));
	});

	it("should keep the web component defaults when inputs are unset", () => {
		expect(accordion.size).toBe("md");
		expect(accordion.disabled).toBe(false);
		expect(items[1].open).toBe(false);
		expect(items[1].disabled).toBe(false);
	});

	it("should keep an item's own disabled", () => {
		expect(items[0].disabled).toBe(true);
	});

	it("should not overwrite state the web component set itself", async () => {
		items[1].open = true;
		await settle(fixture);
		expect(items[1].open).toBe(true);
	});
});
