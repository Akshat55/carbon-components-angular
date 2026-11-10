import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ApplicationRef, Component, createComponent, EnvironmentInjector } from "@angular/core";

import { settle, shadow } from "../test-helpers/web-components";
import { Radio } from "./radio.component";
import { RadioGroup } from "./radio-group.component";

@Component({
	selector: "test-component",
	template: `
		<cds-radio-button-group [(ngModel)]="radio" [disabled]="disabled" [name]="name">
			@for (one of manyRadios; track one) {
				<cds-radio-button [value]="one" class="indent">
					Radio {{one}}
				</cds-radio-button>
			}
		</cds-radio-button-group>
		`,
	imports: [Radio, RadioGroup, FormsModule]
})
class RadioTest {
	manyRadios = ["one", "two", "three", "four", "five", "six"];
	radio: string;
	disabled = false;
	name = "test-group";
}

/** The web component radio buttons (and their shadow `<input>`s). */
const radioButtons = (fixture: ComponentFixture<any>): any[] => Array.from(fixture.nativeElement.querySelectorAll("cds-radio-button"));
const radioInputs = (fixture: ComponentFixture<any>) => radioButtons(fixture).map(button => shadow<HTMLInputElement>(button, "input"));

describe("RadioGroup", () => {
	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [RadioTest]
		}).compileComponents();
	}));

	it("should work", () => {
		const fixture = TestBed.createComponent(RadioTest);
		fixture.detectChanges();

		const directiveEl = fixture.debugElement.query(By.directive(RadioGroup));
		expect(directiveEl).not.toBeNull();
		expect(fixture.nativeElement.querySelector("cds-radio-button-group") instanceof customElements.get("cds-radio-button-group"))
			.toBe(true);
	});

	it("should select one", async () => {
		const fixture = TestBed.createComponent(RadioTest);
		await settle(fixture);

		radioButtons(fixture)[0].click();
		await settle(fixture);

		expect(fixture.componentInstance.radio).toBe("one");
	});

	it("should check the radio matching ngModel", async () => {
		const fixture = TestBed.createComponent(RadioTest);
		fixture.componentInstance.radio = "three";
		await settle(fixture);

		expect(radioButtons(fixture).map(button => button.checked)).toEqual([false, false, true, false, false, false]);
		expect(radioInputs(fixture)[2].checked).toBe(true);
	});

	it("should disable every radio when the group is disabled", async () => {
		const fixture = TestBed.createComponent(RadioTest);
		fixture.componentInstance.disabled = true;
		await settle(fixture);

		const inputs = radioInputs(fixture);
		expect(inputs.length).toBe(6);
		inputs.forEach(input => expect(input.disabled).toBe(true));
	});

	it("should re-enable every radio when the group is enabled", async () => {
		const fixture = TestBed.createComponent(RadioTest);
		fixture.componentInstance.disabled = true;
		await settle(fixture);

		fixture.componentInstance.disabled = false;
		await settle(fixture);

		radioInputs(fixture).forEach(input => expect(input.disabled).toBe(false));
	});

	it("should give every radio the group name", async () => {
		const fixture = TestBed.createComponent(RadioTest);
		await settle(fixture);

		radioInputs(fixture).forEach(input => expect(input.name).toBe("test-group"));
	});

	it("should configure radios added after the group is created", async () => {
		const fixture = TestBed.createComponent(RadioTest);
		fixture.componentInstance.disabled = true;
		await settle(fixture);

		fixture.componentInstance.manyRadios = [...fixture.componentInstance.manyRadios, "seven"];
		await settle(fixture);

		const inputs = radioInputs(fixture);
		expect(inputs.length).toBe(7);
		expect(inputs[6].disabled).toBe(true);
		expect(inputs[6].name).toBe("test-group");
	});

	it("should keep the selection when the radios change", async () => {
		const fixture = TestBed.createComponent(RadioTest);
		fixture.componentInstance.radio = "two";
		await settle(fixture);

		fixture.componentInstance.manyRadios = ["zero", ...fixture.componentInstance.manyRadios];
		await settle(fixture);

		const checked = radioButtons(fixture).filter(button => button.checked);
		expect(checked.length).toBe(1);
		expect(checked[0].value).toBe("two");
	});
});

@Component({
	template: `
		<cds-radio-button-group legend="Size" [formControl]="control" (change)="onChange($event)">
			<cds-radio-button [value]="1">Small</cds-radio-button>
			<cds-radio-button [value]="2">Large</cds-radio-button>
		</cds-radio-button-group>
	`,
	imports: [Radio, RadioGroup, ReactiveFormsModule]
})
class ReactiveRadioTest {
	control = new FormControl(2);
	onChange(_: any) {}
}

describe("RadioGroup with reactive forms", () => {
	let fixture: ComponentFixture<ReactiveRadioTest>;

	beforeEach(async () => {
		fixture = TestBed.createComponent(ReactiveRadioTest);
		await settle(fixture);
	});

	it("should check the radio matching the form value (non-string values)", () => {
		expect(radioButtons(fixture).map(button => button.checked)).toEqual([false, true]);
	});

	it("should update the form value with the radio's original value and emit change", async () => {
		spyOn(fixture.componentInstance, "onChange");
		radioButtons(fixture)[0].click();
		await settle(fixture);

		expect(fixture.componentInstance.control.value).toBe(1);
		expect(fixture.componentInstance.onChange).toHaveBeenCalledWith(jasmine.objectContaining({ value: 1 }));
	});

	it("should disable the radios with the form control", async () => {
		fixture.componentInstance.control.disable();
		await settle(fixture);
		radioInputs(fixture).forEach(input => expect(input.disabled).toBe(true));
	});

	it("should write form values to the radios", async () => {
		fixture.componentInstance.control.setValue(1);
		await settle(fixture);
		expect(radioButtons(fixture).map(button => button.checked)).toEqual([true, false]);
	});
});

describe("Radio created dynamically", () => {
	it("should create the web component and work inside a group", async () => {
		const fixture = TestBed.createComponent(RadioTest);
		await settle(fixture);
		const group = fixture.nativeElement.querySelector("cds-radio-button-group");

		const ref = createComponent(Radio, {
			environmentInjector: TestBed.inject(EnvironmentInjector),
			projectableNodes: [[document.createTextNode("Dynamic")]]
		});
		ref.setInput("value", { id: 3 });
		TestBed.inject(ApplicationRef).attachView(ref.hostView);
		group.appendChild(ref.location.nativeElement);
		await settle(fixture);

		const element = ref.location.nativeElement;
		expect(element instanceof customElements.get("cds-radio-button")).toBe(true);
		expect(element.textContent).toContain("Dynamic");
		expect(element.name).toBe(group.name);

		element.click();
		await settle(fixture);
		expect(fixture.debugElement.query(By.directive(RadioGroup)).componentInstance.value).toEqual({ id: 3 });
		ref.destroy();
	});
});
