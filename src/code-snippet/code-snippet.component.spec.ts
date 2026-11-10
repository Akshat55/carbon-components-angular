import { Component, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { settle, shadow } from "../test-helpers/web-components";
import { CodeSnippet } from "./code-snippet.component";
import { CodeSnippetModule } from "./code-snippet.module";

@Component({
	template: `
		<cds-code-snippet
			[display]="display"
			[feedbackTimeout]="feedbackTimeout"
			feedbackText="Copied!">{{code}}</cds-code-snippet>
	`,
	imports: [CodeSnippetModule]
})
class CodeSnippetTest {
	@ViewChild(CodeSnippet) snippet: CodeSnippet;
	display = "single";
	feedbackTimeout = 300;
	code = "npm install carbon-components-angular";
}

describe("CodeSnippet", () => {
	let fixture: ComponentFixture<CodeSnippetTest>;
	let snippet: CodeSnippet;
	let element: any;

	/** The `cds-copy` element rendered inside the snippet's copy button. */
	const copy = (): any => shadow(shadow(element, "cds-copy-button"), "cds-copy");
	const copyButtonClasses = () => shadow<HTMLButtonElement>(copy(), "button").classList;

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [CodeSnippetTest]
		});

		fixture = TestBed.createComponent(CodeSnippetTest);
		await settle(fixture);
		snippet = fixture.componentInstance.snippet;
		element = fixture.nativeElement.querySelector("cds-code-snippet");
	});

	it("should work", () => {
		expect(snippet instanceof CodeSnippet).toBe(true);
		expect(element instanceof customElements.get("cds-code-snippet")).toBe(true);
		expect(element.type).toBe("single");
		expect(element.textContent).toContain("npm install carbon-components-angular");
	});

	it("should show the copied feedback when the copy button is clicked", async () => {
		copy().click();
		await settle(fixture);

		expect(copyButtonClasses()).toContain("cds--copy-btn--fade-in");
		expect(copyButtonClasses()).toContain("cds--copy-btn--animating");
		expect(shadow(copy(), "cds-tooltip-content").textContent).toContain("Copied!");
	});

	it("should hide the copied feedback again after the timeout", async () => {
		copy().click();
		await settle(fixture);
		expect(copyButtonClasses()).toContain("cds--copy-btn--fade-in");

		await new Promise(resolve => setTimeout(resolve, fixture.componentInstance.feedbackTimeout + 50));
		await settle(fixture);

		expect(copyButtonClasses()).not.toContain("cds--copy-btn--fade-in");
		expect(shadow(copy(), "cds-tooltip-content").textContent).not.toContain("Copied!");
	});

	it("should show the overflow indicators when the snippet is scrolled", async () => {
		const container = shadow(element, ".cds--snippet-container");
		// force a horizontal overflow so the scroll handler has something to report
		Object.defineProperty(container, "scrollWidth", { value: 400, configurable: true });
		Object.defineProperty(container, "clientWidth", { value: 100, configurable: true });
		Object.defineProperty(container, "scrollLeft", { value: 50, configurable: true });

		container.dispatchEvent(new Event("scroll"));
		await settle(fixture);

		expect(shadow(element, ".cds--snippet__overflow-indicator--left")).toBeTruthy();
		expect(shadow(element, ".cds--snippet__overflow-indicator--right")).toBeTruthy();
	});

	it("should render the multi line variant", async () => {
		fixture.componentInstance.display = "multi";
		await settle(fixture);

		expect(element.type).toBe("multi");
		expect(shadow(element, "pre[aria-multiline=true]")).toBeTruthy();
	});
});
