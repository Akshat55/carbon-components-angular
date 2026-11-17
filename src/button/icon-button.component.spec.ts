import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { IconButton } from "./icon-button.component";
import { settle, shadow } from "../test-helpers/web-components";

@Component({
	template: `
		<cds-icon-button
			[kind]="kind"
			[size]="size"
			[align]="align"
			[disabled]="disabled"
			description="Add"
			(click)="clicked()"
			(tooltipClick)="tooltipClicked()">
			<svg class="icon" width="16" height="16"></svg>
		</cds-icon-button>
		<cds-icon-button description="Plain"><svg></svg></cds-icon-button>
	`,
	imports: [IconButton]
})
class IconButtonTest {
	kind: any = "ghost";
	size: any = "sm";
	align: any = "bottom";
	disabled = false;
	clicked = jasmine.createSpy("clicked");
	tooltipClicked = jasmine.createSpy("tooltipClicked");
}

describe("IconButton", () => {
	let fixture;
	let element;

	beforeEach(async () => {
		fixture = TestBed.createComponent(IconButtonTest);
		await settle(fixture);
		element = fixture.nativeElement.querySelector("cds-icon-button");
	});

	it("should register the web component and put the icon and tooltip in their slots", () => {
		expect(element instanceof customElements.get("cds-icon-button")).toBe(true);
		expect(element.querySelector("[slot='icon'] .icon")).toBeTruthy();
		expect(element.querySelector("[slot='tooltip-content']").textContent.trim()).toBe("Add");
	});

	it("should pass inputs to the web component", async () => {
		expect(element.kind).toBe("ghost");
		expect(element.size).toBe("sm");
		expect(element.align).toBe("bottom");
		fixture.componentInstance.disabled = true;
		await settle(fixture);
		expect(element.disabled).toBe(true);
		expect(shadow<HTMLButtonElement>(element, "button").disabled).toBe(true);
	});

	it("should keep the web component's defaults when inputs are unset", () => {
		const plain = fixture.nativeElement.querySelectorAll("cds-icon-button")[1];
		expect(plain.kind).toBe("primary");
		expect(plain.size).toBe("lg");
		expect(plain.align).toBe("top");
		expect(plain.type).toBe("button");
		expect(plain.leaveDelayMs).toBe(100);
	});

	it("should emit native clicks through (click)", () => {
		shadow<HTMLButtonElement>(element, "button").click();
		expect(fixture.componentInstance.clicked).toHaveBeenCalledTimes(1);
	});

	it("should emit tooltipClick, not click, for clicks on the tooltip", () => {
		element.querySelector("[slot='tooltip-content']").click();
		expect(fixture.componentInstance.tooltipClicked).toHaveBeenCalledTimes(1);
		expect(fixture.componentInstance.clicked).not.toHaveBeenCalled();
	});
});
