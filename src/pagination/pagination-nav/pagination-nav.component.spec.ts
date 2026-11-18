import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Component, OnInit } from "@angular/core";
import { I18nModule } from "../../i18n";
import { settle, shadow } from "../../test-helpers/web-components";
import { PaginationNav } from "./index";
import { PaginationModel } from "../pagination-model.class";

@Component({
	template: `
		<cds-pagination-nav
			[model]="model"
			[disabled]="disabled"
			[loop]="loop"
			[numOfItemsToShow]="4"
			[translations]="translations"
			(selectPage)="selectPage($event)" />
	`,
	imports: [
		PaginationNav
	]
})
class PaginationNavTest implements OnInit {
	model = new PaginationModel();
	disabled = false;
	loop = false;
	translations = { NEXT: "Next page", PREVIOUS: "Previous page" };

	selectPage(page) {
		this.model.currentPage = page;
	}

	ngOnInit() {
		this.model.currentPage = 1;
		this.model.totalDataLength = 105;
	}
}

describe("PaginationNav", () => {
	let fixture, wrapper, nav: PaginationNav, element;
	const arrows = (): any[] => Array.from(element.shadowRoot.querySelectorAll("cds-icon-button"));
	const pages = (): HTMLButtonElement[] => Array.from(element.shadowRoot.querySelectorAll("button.cds--pagination-nav__page"));

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				PaginationNavTest
			]
		});
	});

	const create = async (changes: Partial<PaginationNavTest> = {}) => {
		fixture = TestBed.createComponent(PaginationNavTest);
		wrapper = fixture.componentInstance;
		Object.assign(wrapper, changes);
		spyOn(wrapper, "selectPage").and.callThrough();
		await settle(fixture);
		nav = fixture.debugElement.query(By.directive(PaginationNav)).componentInstance;
		element = fixture.nativeElement.querySelector("cds-pagination-nav");
	};

	it("should work", async () => {
		await create();
		expect(nav instanceof PaginationNav).toBe(true);
		expect(element instanceof customElements.get("cds-pagination-nav")).toBe(true);
		expect(element.page).toBe(0);
		expect(element.totalItems).toBe(105);
	});

	it("should emit selectPage with the correct page when current page changes", async () => {
		await create();
		nav.currentPage = 4;
		await settle(fixture);
		expect(wrapper.selectPage).toHaveBeenCalledWith(4);
		expect(wrapper.model.currentPage).toBe(4);
		expect(element.page).toBe(3);
	});

	it("should move to a page when a user clicks on one", async () => {
		await create();
		pages()[1].click();
		await settle(fixture);
		expect(wrapper.selectPage).toHaveBeenCalledWith(2);
		expect(wrapper.model.currentPage).toBe(2);
	});

	it("should go to the next and previous page when the forward/backward buttons are clicked", async () => {
		await create();
		arrows()[1].click();
		await settle(fixture);
		expect(nav.currentPage).toBe(2);
		expect(wrapper.model.currentPage).toBe(2);

		arrows()[0].click();
		await settle(fixture);
		expect(nav.currentPage).toBe(1);
		expect(wrapper.model.currentPage).toBe(1);
	});

	it("should jump to the next and previous page", async () => {
		await create();
		nav.jumpToNext();
		expect(wrapper.model.currentPage).toBe(2);
		nav.jumpToPrevious();
		nav.jumpToPrevious();
		expect(wrapper.model.currentPage).toBe(1);
	});

	it("should loop from the first page to the last", async () => {
		await create({ loop: true });
		nav.jumpToPrevious();
		expect(wrapper.model.currentPage).toBe(105);
	});

	it("should disable the backward arrow on the first page", async () => {
		await create();
		expect(nav.leftArrowDisabled).toBe(true);
		expect(nav.rightArrowDisabled).toBe(false);
		expect(arrows()[0].disabled).toBe(true);
	});

	it("should block interaction when disabled is true", async () => {
		await create({ disabled: true });
		nav.currentPage = 5;
		await settle(fixture);
		wrapper.selectPage.calls.reset();

		expect(element.inert).toBe(true);
		expect(element.getAttribute("aria-disabled")).toBe("true");
		expect(nav.leftArrowDisabled).toBe(true);
		expect(nav.rightArrowDisabled).toBe(true);
	});

	it("should use the translations for the arrow labels", async () => {
		await create();
		expect(arrows()[0].querySelector("[slot=tooltip-content]").textContent.trim()).toBe("Previous page");
		expect(arrows()[1].querySelector("[slot=tooltip-content]").textContent.trim()).toBe("Next page");
	});

	it("should render the hidden pages in the web component's overflow select", async () => {
		await create();
		const select = shadow<HTMLSelectElement>(element, "select.cds--pagination-nav__page--select");
		const options = Array.from(select.querySelectorAll("option:not([hidden])"), option => option.textContent.trim());
		// `totalDataLength` is the number of pages (105); the first and last pages stay visible
		expect(options.length).toBeGreaterThan(1);
		expect(options.every(page => Number(page) > 1 && Number(page) < 105)).toBe(true);
	});

	it("should emit selectPage when a page is picked from the overflow select", async () => {
		await create();
		const select = shadow<HTMLSelectElement>(element, "select.cds--pagination-nav__page--select");
		// the web component renders new options once the page moves, so read the value first
		const index = Number(select.querySelector<HTMLOptionElement>("option:not([hidden])").value);
		select.value = String(index);
		select.dispatchEvent(new Event("change"));
		await settle(fixture);

		expect(wrapper.selectPage).toHaveBeenCalledWith(index + 1);
		expect(element.page).toBe(index);
	});
});
