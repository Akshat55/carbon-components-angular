import { Component, TemplateRef, ViewChild } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { Accordion } from "./accordion.component";
import { AccordionItem } from "./accordion-item.component";

const rendered = (element: any) => element.updateComplete as Promise<boolean>;
const heading = (item: HTMLElement) => item.shadowRoot.querySelector<HTMLButtonElement>(".cds--accordion__heading");

@Component({
	template: `
		<cds-accordion [size]="size" align="start" [disabled]="accordionDisabled" [skeleton]="skeleton">
			<cds-accordion-item
				[title]="title"
				[context]="{ name: 'context' }"
				[disabled]="disabled"
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
		await update();

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

	it("should disable items when the accordion is disabled, then restore the item's own value", async () => {
		await update({ accordionDisabled: true });
		expect(item.disabled).toBe(true);
		expect(heading(item).disabled).toBe(true);

		await update({ accordionDisabled: false });
		expect(item.disabled).toBe(false);

		await update({ disabled: true, accordionDisabled: false });
		expect(item.disabled).toBe(true);
	});

	it("should collapse items when the accordion is disabled", async () => {
		await update({ expanded: true });
		await update({ accordionDisabled: true });
		expect(item.open).toBe(false);
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
});
