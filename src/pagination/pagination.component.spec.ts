import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Component, type OnInit } from "@angular/core";

import { settle, shadow } from "../test-helpers/web-components";
import { Pagination } from "./index";
import { PaginationModel } from "./pagination-model.class";

@Component({
	template: `
		<cds-pagination [model]="model"
			[disabled]="disabled"
			[pageInputDisabled]="pageInputDisabled"
			[pagesUnknown]="pagesUnknown"
			(selectPage)="selectPage($event)" />
	`,
	imports: [Pagination]
})
class PaginationTest implements OnInit {
	model = new PaginationModel();
	disabled = false;
	pageInputDisabled = false;
	pagesUnknown = false;

	selectPage(page) {
		this.model.currentPage = page;
	}

	ngOnInit() {
		this.model.pageLength = 10;
		this.model.currentPage = 1;
		this.model.totalDataLength = 105;
	}
}

describe("Pagination", () => {
	let fixture, wrapper, element, pagination: Pagination;
	const backward = () => shadow<HTMLElement>(element, "cds-button[button-class-name*='cds--pagination__button--backward']");
	const forward = () => shadow<HTMLElement>(element, "cds-button[button-class-name*='cds--pagination__button--forward']");

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [PaginationTest]
		});
	});

	const create = async (changes: Partial<PaginationTest> = {}) => {
		fixture = TestBed.createComponent(PaginationTest);
		wrapper = fixture.componentInstance;
		Object.assign(wrapper, changes);
		spyOn(wrapper, "selectPage").and.callThrough();
		await settle(fixture);
		element = fixture.nativeElement.querySelector("cds-pagination");
		pagination = fixture.debugElement.query(By.directive(Pagination)).componentInstance;
	};

	it("should work", async () => {
		await create();
		expect(pagination instanceof Pagination).toBe(true);
		expect(element instanceof customElements.get("cds-pagination")).toBe(true);
		expect(element.page).toBe(1);
		expect(element.pageSize).toBe(10);
		expect(element.totalItems).toBe(105);
	});

	it("should emit selectPage with the correct page when current page changes", async () => {
		await create();
		pagination.currentPage = 4;
		await settle(fixture);
		expect(wrapper.selectPage).toHaveBeenCalledWith(4);
		expect(wrapper.model.currentPage).toBe(4);
		expect(element.page).toBe(4);
	});

	it("should get next page and previous page from the current page", async () => {
		await create();
		pagination.currentPage = 4;
		await settle(fixture);
		expect(pagination.nextPage).toBe(5);
		expect(pagination.previousPage).toBe(3);
	});

	it("should set endItemIndex to totalDataLength when the page is longer than the data", async () => {
		await create();
		wrapper.model.pageLength = 107;
		await settle(fixture);
		expect(pagination.startItemIndex).toBe(1);
		expect(pagination.endItemIndex).toBe(105);
	});

	it("should set startItemIndex to 0 when there is nothing to show", async () => {
		await create();
		wrapper.model.currentPage = 0;
		await settle(fixture);
		expect(pagination.startItemIndex).toBe(0);
	});

	it("should go to the next and previous page when the forward/backward buttons are clicked", async () => {
		await create();
		forward().click();
		await settle(fixture);
		expect(pagination.currentPage).toBe(2);
		expect(wrapper.model.currentPage).toBe(2);
		expect(wrapper.selectPage).toHaveBeenCalledWith(2);

		backward().click();
		await settle(fixture);
		expect(pagination.currentPage).toBe(1);
		expect(wrapper.model.currentPage).toBe(1);
	});

	it("should disable the backward button on the first page", async () => {
		await create();
		expect(backward().hasAttribute("disabled")).toBe(true);
		expect(forward().hasAttribute("disabled")).toBe(false);
	});

	it("should disable the forward and backward buttons when disabled is true", async () => {
		await create({ disabled: true });
		wrapper.model.currentPage = 5;
		await settle(fixture);

		expect(forward().hasAttribute("disabled")).toBe(true);
		expect(backward().hasAttribute("disabled")).toBe(true);
	});

	it("should reset to the first page when the page size changes", async () => {
		await create();
		wrapper.model.currentPage = 3;
		await settle(fixture);

		element.dispatchEvent(new CustomEvent("cds-page-sizes-select-changed", { detail: { pageSize: 20 } }));
		await settle(fixture);

		expect(wrapper.model.pageLength).toBe(20);
		expect(wrapper.selectPage).toHaveBeenCalledWith(1);
		expect(wrapper.model.currentPage).toBe(1);
	});

	/**
	 * Number of pages should always be 1 even if totalDataLength is greater than 0
	 */
	it("should recalculate pages when changing data", async () => {
		await create();
		const model = wrapper.model;
		model.pageLength = 5;
		model.totalDataLength = 9;
		expect(pagination.pageOptions.length).toEqual(2);
		model.totalDataLength = 2;
		expect(pagination.pageOptions.length).toEqual(1);
		model.totalDataLength = 20;
		expect(pagination.pageOptions.length).toEqual(4);
		model.totalDataLength = 0;
		expect(pagination.pageOptions.length).toEqual(1);
	});

	it("should replace the page select with text when the page input is disabled", async () => {
		await create();
		expect(shadow(element, "cds-select")).toBeTruthy();

		wrapper.pageInputDisabled = true;
		await settle(fixture);

		expect(element.pageInputDisabled).toBe(true);
	});
});
