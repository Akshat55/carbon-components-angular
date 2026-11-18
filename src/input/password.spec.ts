import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { CdsPasswordInput } from "./";
import { settle, shadow, typeInto } from "../test-helpers/web-components";

@Component({
	template: `
		<cds-password-input
			label="Password"
			showPasswordLabel="Reveal"
			hidePasswordLabel="Conceal"
			[(ngModel)]="value" />
	`,
	imports: [CdsPasswordInput, FormsModule]
})
class TestPasswordInputComponent {
	value = "";
}

describe("Password", () => {
	let fixture: ComponentFixture<TestPasswordInputComponent>;
	let password: any;

	beforeEach(async () => {
		fixture = TestBed.createComponent(TestPasswordInputComponent);
		await settle(fixture);
		password = fixture.nativeElement.querySelector("cds-password-input");
	});

	it("should create a password component", () => {
		expect(password instanceof customElements.get("cds-password-input")).toBe(true);
		expect(password.showPasswordLabel).toBe("Reveal");
		expect(password.hidePasswordLabel).toBe("Conceal");
	});

	it("should set initial input type to 'password'", () => {
		expect(shadow<HTMLInputElement>(password, "input").type).toBe("password");
	});

	it("should set input type to 'text' when toggle button is clicked", async () => {
		shadow<HTMLButtonElement>(password, ".cds--text-input--password__visibility__toggle").click();
		await settle(fixture);
		expect(shadow<HTMLInputElement>(password, "input").type).toBe("text");
	});

	it("should support ngModel", async () => {
		typeInto(shadow<HTMLInputElement>(password, "input"), "secret");
		await settle(fixture);
		expect(fixture.componentInstance.value).toBe("secret");
	});
});
