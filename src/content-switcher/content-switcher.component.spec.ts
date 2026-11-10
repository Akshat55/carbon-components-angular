import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Component } from "@angular/core";

import { settle, shadow } from "../test-helpers/web-components";
import { ContentSwitcher } from "./content-switcher.component";
import { ContentSwitcherOption } from "./index";

@Component({
	template: `
		<cds-content-switcher (selected)="selected($event)" ariaLabel="Test">
			<cds-content-switcher-item name="First" id="first">First section</cds-content-switcher-item>
			<cds-content-switcher-item name="Second" id="second">Second section</cds-content-switcher-item>
			<cds-content-switcher-item name="Third" id="third">Third section</cds-content-switcher-item>
		</cds-content-switcher>
	`,
	imports: [ContentSwitcher, ContentSwitcherOption]
})
class ContentSwitcherTest {
	selectedValue = null;
	selected(event) {
		this.selectedValue = event.name;
	}
}

describe("ContentSwitcher", () => {
	let fixture, wrapper, element, switcher: ContentSwitcher;
	const option = (id: string): any => element.querySelector(`#${id}`);
	/** Clicks the option the way a user would: on its inner button. */
	const choose = async (id: string) => {
		shadow<HTMLButtonElement>(option(id), "button").click();
		await settle(fixture);
	};

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [ContentSwitcherTest]
		});
		fixture = TestBed.createComponent(ContentSwitcherTest);
		wrapper = fixture.componentInstance;
		await settle(fixture);
		element = fixture.nativeElement.querySelector("cds-content-switcher");
		switcher = fixture.debugElement.query(By.directive(ContentSwitcher)).componentInstance;
	});

	it("should work", () => {
		expect(switcher instanceof ContentSwitcher).toBe(true);
		expect(element instanceof customElements.get("cds-content-switcher")).toBe(true);
	});

	it("should set aria-label to 'Test'", () => {
		expect(element.getAttribute("aria-label")).toBe("Test");
	});

	it("should set all options in the content switcher component", () => {
		expect(switcher.options.length).toBe(3);
		switcher.options.forEach(o => expect(o instanceof ContentSwitcherOption).toBe(true));
	});

	it("should emit the correct value according to which option is clicked", async () => {
		await choose("second");
		expect(wrapper.selectedValue).toBe("Second");
		await choose("third");
		expect(wrapper.selectedValue).toBe("Third");
		await choose("first");
		expect(wrapper.selectedValue).toBe("First");
	});

	it("should select the option the keyboard moves to", async () => {
		// the web component navigates from the focused option
		shadow<HTMLButtonElement>(option("first"), "button").focus();
		shadow<HTMLButtonElement>(option("first"), "button").dispatchEvent(
			new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, composed: true })
		);
		await settle(fixture);
		expect(wrapper.selectedValue).toBe("Second");
	});

	it("should unselect all other options when an option is chosen", async () => {
		await choose("second");
		switcher.options.forEach(o => expect(o.active).toBe(o.name === "Second"));

		await choose("third");
		switcher.options.forEach(o => expect(o.active).toBe(o.name === "Third"));
	});

	it("should move the selected state and aria state to the chosen option", async () => {
		expect(option("first").selected).toBe(true);

		await choose("second");

		expect(option("first").selected).toBe(false);
		expect(shadow(option("first"), "button").getAttribute("aria-selected")).toBe("false");
		expect(option("second").selected).toBe(true);
		expect(shadow(option("second"), "button").getAttribute("aria-selected")).toBe("true");
	});

	it("should select the first option on init", () => {
		expect(switcher.options.first.active).toBe(true);
		expect(option("first").selected).toBe(true);
		expect(shadow(option("first"), "button").getAttribute("tabindex")).toBe("0");
	});
});
