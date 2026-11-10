import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Component } from "@angular/core";

import { settle, shadow } from "../test-helpers/web-components";
import { TagFilter } from "./tag-filter.component";

@Component({
	template: `
	<cds-dismissible-tag text="TagFilter" [disabled]="disabled" />`,
	imports: [TagFilter]
})
class TagFilterTest {
	disabled = false;
}

describe("TagFilter", () => {
	let fixture, tagFilter: TagFilter, tag: any;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TagFilterTest]
		});
	});

	const create = async (disabled = false) => {
		fixture = TestBed.createComponent(TagFilterTest);
		fixture.componentInstance.disabled = disabled;
		await settle(fixture);
		tagFilter = fixture.debugElement.query(By.directive(TagFilter)).componentInstance;
		tag = fixture.nativeElement.querySelector("cds-dismissible-tag");
		spyOn(tagFilter.click, "emit");
		spyOn(tagFilter.close, "emit");
	};

	it("should render a filter tag", async () => {
		await create();
		expect(tag instanceof customElements.get("cds-dismissible-tag")).toBe(true);
		expect(shadow(tag, ".cds--tag__label").textContent.trim()).toBe("TagFilter");
		expect(shadow(tag, ".cds--tag__close-icon")).toBeTruthy();
	});

	it("should call onClick on label click", async () => {
		await create();
		shadow<HTMLElement>(tag, ".cds--tag__label").click();
		await settle(fixture);
		expect(tagFilter.click.emit).toHaveBeenCalledWith({ action: "click" });
		expect(tagFilter.close.emit).not.toHaveBeenCalled();
	});

	it("should call both onClick and onClose on close icon click", async () => {
		await create();
		shadow<HTMLElement>(tag, ".cds--tag__close-icon").click();
		await settle(fixture);
		expect(tagFilter.close.emit).toHaveBeenCalled();
		expect(tagFilter.click.emit).toHaveBeenCalledWith({ action: "close" });
		expect(tagFilter.click.emit).not.toHaveBeenCalledWith({ action: "click" });
		// Angular owns the element, so it is not removed by the web component
		expect(fixture.nativeElement.querySelector("cds-dismissible-tag")).toBe(tag);
	});

	it("should not call onClick when disabled", async () => {
		await create(true);
		shadow<HTMLElement>(tag, ".cds--tag__label").click();
		await settle(fixture);
		expect(tagFilter.click.emit).not.toHaveBeenCalled();
	});

	it("should not call onClick nor onClose when disabled", async () => {
		await create(true);
		shadow<HTMLButtonElement>(tag, ".cds--tag__close-icon").dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
		await settle(fixture);
		expect(tagFilter.close.emit).not.toHaveBeenCalled();
		expect(tagFilter.click.emit).not.toHaveBeenCalled();
	});
});
