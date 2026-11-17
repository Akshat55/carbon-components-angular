import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import Add16 from "@carbon/icons/es/add/16";
import Add20 from "@carbon/icons/es/add/20";

import { settle } from "../test-helpers/web-components";
import { CdsIcon } from "./icon.component";
import { IconService } from "./icon.service";

@Component({
	template: `
		<cds-icon icon="add" />
		<cds-icon icon="add" [size]="20" ariaLabel="Add" />
	`,
	imports: [CdsIcon]
})
class IconTest {}

describe("CdsIcon", () => {
	beforeEach(() => {
		TestBed.inject(IconService).registerAll([Add16, Add20]);
	});

	it("should register the web component and pass a registered icon by name", async () => {
		const fixture = TestBed.createComponent(IconTest);
		await settle(fixture);
		const [plain, sized] = fixture.nativeElement.querySelectorAll("cds-icon");
		expect(plain instanceof customElements.get("cds-icon")).toBe(true);
		expect(plain.icon).toBe(Add16);
		expect(sized.icon).toBe(Add20);
		expect(sized.size).toBe(20);
		expect(sized.ariaLabel).toBe("Add");
	});

	it("should keep the web component's defaults when inputs are unset", async () => {
		const fixture = TestBed.createComponent(IconTest);
		await settle(fixture);
		const plain = fixture.nativeElement.querySelector("cds-icon");
		expect(plain.size).toBe(16);
		expect(plain.ariaLabel).toBeNull();
	});
});
