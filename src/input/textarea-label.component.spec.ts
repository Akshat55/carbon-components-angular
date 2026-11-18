import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { InputModule } from "./input.module";
import { settle, shadow, typeInto } from "../test-helpers/web-components";

/** The "count/max" text the web component renders. */
const counter = (element: Element) =>
	Array.from(element.shadowRoot.querySelectorAll("label, div"), node => node.textContent.trim()).find(text => /^\d+\/\d+$/.test(text));

@Component({
	template: `
		<cds-textarea label="Comments" enableCounter [maxCount]="20" [rows]="6" [counterMode]="counterMode" [formControl]="control" />
		<cds-textarea-skeleton />
	`,
	imports: [InputModule, ReactiveFormsModule]
})
class ReactiveTextareaTest {
	control = new FormControl("");
	counterMode: "character" | "word" = "character";
}

describe("Textarea", () => {
	it("should work", async () => {
		const fixture = TestBed.createComponent(ReactiveTextareaTest);
		await settle(fixture);
		const textarea = fixture.nativeElement.querySelector("cds-textarea");
		expect(textarea instanceof customElements.get("cds-textarea")).toBe(true);
		expect(textarea.rows).toBe(6);
		expect(shadow(textarea, "textarea")).toBeTruthy();
	});

	it("should update the character counter when the control value changes", async () => {
		const fixture = TestBed.createComponent(ReactiveTextareaTest);
		await settle(fixture);
		const textarea = fixture.nativeElement.querySelector("cds-textarea");
		expect(counter(textarea)).toBe("0/20");

		fixture.componentInstance.control.setValue("carbon design");
		await settle(fixture);
		expect(counter(textarea)).toBe("13/20");
	});

	it("should count words with counterMode word", async () => {
		const fixture = TestBed.createComponent(ReactiveTextareaTest);
		fixture.componentInstance.counterMode = "word";
		fixture.componentInstance.control.setValue("carbon design system");
		await settle(fixture);
		const textarea = fixture.nativeElement.querySelector("cds-textarea");
		expect(textarea.counterMode).toBe("word");
		expect(counter(textarea)).toBe("3/20");
	});

	it("should update the control as the user types", async () => {
		const fixture = TestBed.createComponent(ReactiveTextareaTest);
		await settle(fixture);
		const textarea = fixture.nativeElement.querySelector("cds-textarea");

		typeInto(shadow<HTMLTextAreaElement>(textarea, "textarea"), "abcd");
		await settle(fixture);
		expect(fixture.componentInstance.control.value).toBe("abcd");
		expect(counter(textarea)).toBe("4/20");
	});

	it("should render the skeleton", async () => {
		const fixture = TestBed.createComponent(ReactiveTextareaTest);
		await settle(fixture);
		expect(fixture.nativeElement.querySelector("cds-textarea-skeleton").shadowRoot).toBeTruthy();
	});
});
