import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Component, OnInit, ViewChild } from "@angular/core";
import { I18nModule } from "../../i18n";
import { settle, shadow } from "../../test-helpers/web-components";
import { PaginationNav } from "./index";
import { PaginationOverflow } from "./pagination-overflow.component";
import { PaginationModule } from "../index";
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
});

@Component({
	template: `
		<cds-pagination-overflow
			[fromIndex]="fromIndex"
			[count]="count"
			(change)="selectedPage = $event">
		</cds-pagination-overflow>
	`,
	imports: [PaginationModule, I18nModule]
})
class PaginationOverflowTest {
	@ViewChild(PaginationOverflow) overflow: PaginationOverflow;
	fromIndex = 0;
	count = 5;
	selectedPage: number = null;
}

describe("PaginationOverflow", () => {
	let fixture: ComponentFixture<PaginationOverflowTest>;
	let wrapper: PaginationOverflowTest;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [PaginationOverflowTest]
		});

		fixture = TestBed.createComponent(PaginationOverflowTest);
		fixture.detectChanges();
		wrapper = fixture.componentInstance;
	});

	it("should work", () => {
		expect(wrapper.overflow instanceof PaginationOverflow).toBe(true);
	});

	it("should render a select with an option per page in the overflow", () => {
		const options = fixture.nativeElement.querySelectorAll("select option:not([hidden])");
		expect(options.length).toBe(5);
		expect(options[0].textContent.trim()).toBe("1");
		expect(options[4].textContent.trim()).toBe("5");
	});

	it("should emit the selected page on change", () => {
		const select = fixture.nativeElement.querySelector("select");
		select.selectedIndex = 3;
		select.dispatchEvent(new Event("change"));
		fixture.detectChanges();

		expect(wrapper.selectedPage).toBe(3);
	});

	it("should render more options as the page count grows", () => {
		expect(fixture.nativeElement.querySelectorAll("select option:not([hidden])").length).toBe(5);

		wrapper.count = 9;
		fixture.detectChanges();

		expect(fixture.nativeElement.querySelectorAll("select option:not([hidden])").length).toBe(9);
	});

	it("should renumber the options when the starting index moves", () => {
		wrapper.fromIndex = 10;
		fixture.detectChanges();

		const options = fixture.nativeElement.querySelectorAll("select option:not([hidden])");
		expect(options.length).toBe(5);
		expect(options[0].textContent.trim()).toBe("11");
		expect(options[4].textContent.trim()).toBe("15");
	});

	it("should collapse to a single nav item when the count drops to one", () => {
		wrapper.count = 1;
		fixture.detectChanges();

		expect(fixture.nativeElement.querySelector("select")).toBeFalsy();
		expect(fixture.nativeElement.querySelector("cds-pagination-nav-item")).toBeTruthy();
	});
});
