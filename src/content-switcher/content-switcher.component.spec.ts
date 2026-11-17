import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { ApplicationRef, Component, createComponent, EnvironmentInjector } from "@angular/core";

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
	selected(item: HTMLElement & { value: string }) {
		this.selectedValue = item.value;
	}
}

describe("ContentSwitcher", () => {
	let fixture, wrapper, element, switcher: ContentSwitcher;
	const option = (id: string): any => element.querySelector(`#${id}`);
	const options = (): ContentSwitcherOption[] =>
		fixture.debugElement.queryAll(By.directive(ContentSwitcherOption)).map(debug => debug.componentInstance);
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
		expect(options().length).toBe(3);
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
		options().forEach(o => expect(o.active).toBe(o.name === "Second"));

		await choose("third");
		options().forEach(o => expect(o.active).toBe(o.name === "Third"));
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
		expect(options()[0].active).toBe(true);
		expect(option("first").selected).toBe(true);
		expect(shadow(option("first"), "button").getAttribute("tabindex")).toBe("0");
	});

	it("should select an option created dynamically and update [(selectedIndex)]", async () => {
		const ref = createComponent(ContentSwitcherOption, {
			environmentInjector: TestBed.inject(EnvironmentInjector),
			projectableNodes: [[document.createTextNode("Fourth section")]]
		});
		ref.setInput("name", "Fourth");
		TestBed.inject(ApplicationRef).attachView(ref.hostView);
		ref.location.nativeElement.id = "fourth";
		element.appendChild(ref.location.nativeElement);
		await settle(fixture);
		const indexes = [];
		switcher.selectedIndexChange.subscribe(index => indexes.push(index));

		await choose("fourth");

		expect(wrapper.selectedValue).toBe("Fourth");
		expect(indexes).toEqual([3]);
		expect(options().map(o => o.active)).toEqual([false, false, false]);
		expect(ref.instance.active).toBe(true);
		ref.destroy();
	});
});

@Component({
	template: `
		<cds-content-switcher>
			<cds-content-switcher-item>One</cds-content-switcher-item>
			<cds-content-switcher-item [active]="true">Two</cds-content-switcher-item>
		</cds-content-switcher>
	`,
	imports: [ContentSwitcher, ContentSwitcherOption]
})
class PlainContentSwitcherTest {}

describe("ContentSwitcher defaults", () => {
	it("should keep the web component's defaults and select the active option first", async () => {
		const fixture = TestBed.createComponent(PlainContentSwitcherTest);
		await settle(fixture);
		const element = fixture.nativeElement.querySelector("cds-content-switcher");
		const items = Array.from<any>(fixture.nativeElement.querySelectorAll("cds-content-switcher-item"));
		expect(element.size).toBe("");
		expect(element.selectionMode).toBe("automatic");
		expect(items[0].value).not.toBe(items[1].value);
		expect(items.map(item => item.selected)).toEqual([false, true]);
		expect(items.every(item => item.getAttribute("size") === "md")).toBe(true);
	});
});
