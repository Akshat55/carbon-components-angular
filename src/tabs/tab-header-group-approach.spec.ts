import { ApplicationRef, Component, createComponent, EnvironmentInjector } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { settle } from "../test-helpers/web-components";
import { TabsModule } from "./tabs.module";
import { Tab } from "./tab.component";
import { Tabs } from "./tabs.component";

/**
 * Ported from the v6 "tab header group approach" specs: headers rendered apart from their
 * panels. That is how v7 tabs always work, so these cover panels placed anywhere and tabs
 * created dynamically.
 */
describe("Tabs — headers apart from panels", () => {
	beforeEach(() => {
		TestBed.configureTestingModule({ imports: [TabsModule] });
	});

	it("should toggle panels placed anywhere in the document", async () => {
		const fixture = TestBed.createComponent(DistantPanelsTest);
		await settle(fixture);
		const panel = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;
		expect(panel("far-one").hidden).toBe(false);
		expect(panel("far-two").hidden).toBe(true);

		(fixture.nativeElement.querySelectorAll("cds-tab")[1] as HTMLElement).click();
		await settle(fixture);
		expect(panel("far-one").hidden).toBe(true);
		expect(panel("far-two").hidden).toBe(false);
	});

	it("should support tabs and panels rendered with @for", async () => {
		const fixture = TestBed.createComponent(ForTabsTest);
		await settle(fixture);
		const tabs = () => fixture.nativeElement.querySelectorAll("cds-tab");
		expect(tabs().length).toBe(3);

		fixture.componentInstance.items = ["a", "b"];
		await settle(fixture);
		expect(tabs().length).toBe(2);

		(fixture.nativeElement.querySelector("#tab-b") as HTMLElement).click();
		await settle(fixture);
		expect(fixture.componentInstance.value).toBe("b");
		expect((fixture.nativeElement.querySelector("#for-panel-b") as HTMLElement).hidden).toBe(false);
	});

	it("should default each tab's value to its id so every tab can be selected", async () => {
		const fixture = TestBed.createComponent(ForTabsTest);
		fixture.componentInstance.useValues = false;
		await settle(fixture);
		const tabs = Array.from(fixture.nativeElement.querySelectorAll("cds-tab")) as any[];
		tabs[1].click();
		await settle(fixture);
		expect(fixture.componentInstance.value).toBe("tab-b");
		tabs[2].click();
		await settle(fixture);
		expect(fixture.componentInstance.value).toBe("tab-c");
	});

	it("should emit `selected` for tabs created with createComponent", async () => {
		const fixture = TestBed.createComponent(DistantPanelsTest);
		await settle(fixture);
		const ref = createComponent(Tab, { environmentInjector: TestBed.inject(EnvironmentInjector) });
		let emitted = false;
		ref.instance.selected.subscribe(() => emitted = true);
		TestBed.inject(ApplicationRef).attachView(ref.hostView);
		fixture.nativeElement.querySelector("cds-tabs").append(ref.location.nativeElement);
		await settle(fixture);

		ref.location.nativeElement.click();
		await settle(fixture);
		expect(emitted).toBe(true);
		expect(ref.instance.active).toBe(true);
		ref.destroy();
	});
});

@Component({
	template: `
		<cds-tabs>
			<cds-tab target="far-one">One</cds-tab>
			<cds-tab target="far-two">Two</cds-tab>
		</cds-tabs>
		<section>
			<p>Content between the tabs and their panels</p>
			<div id="far-one" role="tabpanel">One</div>
			<div id="far-two" role="tabpanel" hidden>Two</div>
		</section>
	`,
	imports: [TabsModule]
})
class DistantPanelsTest {}

@Component({
	template: `
		<cds-tabs [(value)]="value">
			@for (item of items; track item) {
				<cds-tab [id]="'tab-' + item" [value]="useValues ? item : undefined" [target]="'for-panel-' + item">{{item}}</cds-tab>
			}
		</cds-tabs>
		@for (item of items; track item) {
			<div [id]="'for-panel-' + item" role="tabpanel" hidden>{{item}}</div>
		}
	`,
	imports: [TabsModule]
})
class ForTabsTest {
	items = ["a", "b", "c"];
	useValues = true;
	value: string;
}
