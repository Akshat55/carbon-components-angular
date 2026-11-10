import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { Button } from "./button.directive";
import { CdsButton } from "./button.component";
import { ButtonType } from "./button.types";

const rendered = (element: any) => element.updateComplete as Promise<boolean>;

@Component({
	template: `
		<cds-button [cdsButton]="kind" size="sm" [disabled]="disabled" (click)="onClick()">Label</cds-button>
		<button cdsButton="secondary">Native</button>
	`,
	imports: [CdsButton, Button]
})
class ButtonTest {
	kind: ButtonType | "" = "";
	disabled = false;
	onClick() {}
}

describe("CdsButton", () => {
	let fixture;
	let element;

	beforeEach(async () => {
		fixture = TestBed.createComponent(ButtonTest);
		fixture.detectChanges();
		element = fixture.nativeElement.querySelector("cds-button");
		await rendered(element);
	});

	it("should render the cds-button web component with projected content", () => {
		expect(element instanceof customElements.get("cds-button")).toBe(true);
		expect(element.textContent).toBe("Label");
		expect(element.kind).toBe("primary");
		expect(element.size).toBe("sm");
	});

	it("should map v6 danger kinds to the web component spelling", async () => {
		fixture.componentInstance.kind = "danger--tertiary";
		fixture.detectChanges();
		await rendered(element);
		expect(element.kind).toBe("danger-tertiary");
		expect(element.shadowRoot.querySelector(".cds--btn--danger--tertiary")).toBeTruthy();
	});

	it("should emit native click events", () => {
		spyOn(fixture.componentInstance, "onClick");
		element.shadowRoot.querySelector("button").click();
		expect(fixture.componentInstance.onClick).toHaveBeenCalled();
	});

	it("should disable the inner button", async () => {
		fixture.componentInstance.disabled = true;
		fixture.detectChanges();
		await rendered(element);
		expect(element.shadowRoot.querySelector("button").disabled).toBe(true);
	});

	it("should leave cds-button alone and keep styling native buttons with the cdsButton directive", () => {
		expect(element.classList.contains("cds--btn")).toBe(false);
		expect(fixture.nativeElement.querySelector("button.cds--btn--secondary")).toBeTruthy();
	});
});
