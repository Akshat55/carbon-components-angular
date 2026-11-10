import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { settle, shadow, typeInto } from "../test-helpers/web-components";
import { Search } from "./search.component";

@Component({
	template: `
		<cds-search
			[value]="value"
			[disabled]="disabled"
			[required]="required"
			[size]="size"
			[expandable]="expandable"
			[(active)]="active"
			(open)="onOpen($event)"
			(clear)="onClear()"
			(search)="onSearch($event)" />
	`,
	imports: [Search]
})
class SearchTest {
	value = "";
	disabled = false;
	required = false;
	size: "sm" | "md" | "lg" = "md";
	expandable = false;
	active = false;
	onOpen(_: boolean) {}
	onClear() {}
	onSearch(_: string) {}
}

describe("Search", () => {
	let host: SearchTest;
	let component: Search;
	let fixture: ComponentFixture<SearchTest>;
	let element: any;
	const inputElement = () => shadow<HTMLInputElement>(element, "input");
	const clearButtonElement = () => shadow<HTMLButtonElement>(element, ".cds--search-close");

	const update = async (changes: Partial<SearchTest>) => {
		Object.assign(host, changes);
		await settle(fixture);
	};

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [FormsModule, SearchTest]
		});
		fixture = TestBed.createComponent(SearchTest);
		host = fixture.componentInstance;
		await settle(fixture);
		component = fixture.debugElement.query(By.directive(Search)).componentInstance;
		element = fixture.nativeElement.querySelector("cds-search");
	});

	it("should work", () => {
		expect(component instanceof Search).toBe(true);
		expect(element instanceof customElements.get("cds-search")).toBe(true);
	});

	it("should bind input value", async () => {
		await update({ value: "Text" });
		expect(inputElement().value).toEqual("Text");
	});

	it("should bind input disabled", async () => {
		expect(inputElement().disabled).toEqual(false);
		await update({ disabled: true });
		expect(inputElement().disabled).toEqual(true);
	});

	it("should display component of the correct size", async () => {
		await update({ size: "lg" });
		expect(element.getAttribute("size")).toEqual("lg");
		await update({ size: "sm" });
		expect(element.getAttribute("size")).toEqual("sm");
	});

	it("should display clear button", async () => {
		await update({ value: "" });
		expect(clearButtonElement().className.includes("cds--search-close--hidden")).toEqual(true);
		await update({ value: "Text" });
		expect(clearButtonElement().className.includes("cds--search-close--hidden")).toEqual(false);
	});

	it("should clear input when clear button is clicked, and emit clear", async () => {
		spyOn(host, "onClear");
		await update({ value: "Text" });
		clearButtonElement().click();
		await settle(fixture);
		expect(component.value).toEqual("");
		expect(host.onClear).toHaveBeenCalled();
	});

	it("should clear the input when the clear button is clicked on the expandable component", async () => {
		await update({ expandable: true, active: true, value: "TextToClear" });
		clearButtonElement().click();
		await settle(fixture);
		expect(component.value).toEqual("");
	});

	it("should clear the input when the escape key is pressed", async () => {
		await update({ value: "TextToClear" });
		inputElement().focus();
		inputElement().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, composed: true }));
		await settle(fixture);
		expect(component.value).toBe("");
		expect(clearButtonElement().className.includes("cds--search-close--hidden")).toEqual(true);
	});

	it("should clear the input and keep the expanded state open when the escape key is pressed", async () => {
		await update({ expandable: true, active: true, value: "TextToClear" });
		expect(element.hasAttribute("expanded")).toBe(true);
		inputElement().focus();
		inputElement().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, composed: true }));
		await settle(fixture);
		expect(component.value).toBe("");
		expect(element.hasAttribute("expanded")).toBe(true);
		expect(host.active).toBe(true);
	});

	it("should close the expandable search component when esc is pressed when content is empty", async () => {
		spyOn(host, "onOpen");
		await update({ expandable: true, active: true, value: "" });
		inputElement().focus();
		inputElement().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, composed: true }));
		await settle(fixture);
		expect(component.active).toEqual(false);
		expect(host.active).toEqual(false);
		expect(host.onOpen).toHaveBeenCalledWith(false);
	});

	it("should open the expandable search when the magnifier is clicked", async () => {
		spyOn(host, "onOpen");
		await update({ expandable: true });
		expect(element.hasAttribute("expanded")).toBe(false);

		shadow<HTMLElement>(element, ".cds--search-magnifier").click();
		await settle(fixture);

		expect(host.active).toBe(true);
		expect(host.onOpen).toHaveBeenCalledWith(true);
	});

	it("should emit search with the value when Enter is pressed", async () => {
		spyOn(host, "onSearch");
		await update({ value: "query" });
		inputElement().dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, composed: true }));
		expect(host.onSearch).toHaveBeenCalledWith("query");
	});
});

@Component({
	template: `
		<cds-search [(ngModel)]="model" (valueChange)="onValueChange($event)" />
		<cds-search [formControl]="control" />
	`,
	imports: [Search, FormsModule, ReactiveFormsModule]
})
class SearchFormsTest {
	model = "start";
	control = new FormControl("reactive");
	onValueChange(_: string) {}
}

describe("Search with forms", () => {
	let fixture: ComponentFixture<SearchFormsTest>;
	let modelSearch: any;
	let reactiveSearch: any;

	beforeEach(async () => {
		fixture = TestBed.createComponent(SearchFormsTest);
		await settle(fixture);
		[modelSearch, reactiveSearch] = fixture.nativeElement.querySelectorAll("cds-search");
	});

	it("should write the ngModel value to the input", () => {
		expect(shadow<HTMLInputElement>(modelSearch, "input").value).toBe("start");
	});

	it("should update ngModel and emit valueChange when the user types", async () => {
		spyOn(fixture.componentInstance, "onValueChange");
		typeInto(shadow<HTMLInputElement>(modelSearch, "input"), "typed");
		await settle(fixture);
		expect(fixture.componentInstance.model).toBe("typed");
		expect(fixture.componentInstance.onValueChange).toHaveBeenCalledWith("typed");
	});

	it("should write form control values and disable with the control", async () => {
		expect(shadow<HTMLInputElement>(reactiveSearch, "input").value).toBe("reactive");
		fixture.componentInstance.control.setValue("next");
		fixture.componentInstance.control.disable();
		await settle(fixture);
		expect(shadow<HTMLInputElement>(reactiveSearch, "input").value).toBe("next");
		expect(shadow<HTMLInputElement>(reactiveSearch, "input").disabled).toBe(true);
	});

	it("should clear the form value with the clear button", async () => {
		shadow<HTMLButtonElement>(reactiveSearch, ".cds--search-close").click();
		await settle(fixture);
		expect(fixture.componentInstance.control.value).toBe("");
	});
});
