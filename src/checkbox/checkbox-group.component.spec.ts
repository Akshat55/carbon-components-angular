import {
	ApplicationRef,
	Component,
	createComponent,
	CUSTOM_ELEMENTS_SCHEMA,
	EnvironmentInjector,
	TemplateRef,
	ViewChild
} from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { settle } from "../test-helpers/web-components";

import { Checkbox } from "./checkbox.component";
import { CheckboxGroup } from "./checkbox-group.component";

const rendered = (element: any) => element.updateComplete as Promise<boolean>;

@Component({
	template: `
		<cds-checkbox-group
			[legend]="legend"
			legendId="group-legend"
			helperText="Helper"
			orientation="horizontal"
			[readOnly]="readOnly"
			[invalid]="invalid"
			invalidText="Invalid"
			[warn]="warn"
			[decorator]="withDecorator ? decorator : null">
			<cds-checkbox>One</cds-checkbox>
			<cds-checkbox [readOnly]="false" [invalid]="false" [warn]="false">Two</cds-checkbox>
		</cds-checkbox-group>
		<ng-template #legendTemplate><b class="legend">Template legend</b></ng-template>
		<ng-template #decorator><cds-ai-label class="decorator" /></ng-template>
	`,
	imports: [Checkbox, CheckboxGroup],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
class CheckboxGroupTest {
	@ViewChild("legendTemplate") legendTemplate: TemplateRef<any>;
	legend: string | TemplateRef<any> = "Legend";
	readOnly = false;
	invalid = false;
	warn = false;
	withDecorator = false;
}

describe("CheckboxGroup", () => {
	let fixture;
	let group;
	let one;
	let two;

	beforeEach(async () => {
		fixture = TestBed.createComponent(CheckboxGroupTest);
		fixture.detectChanges();
		group = fixture.nativeElement.querySelector("cds-checkbox-group");
		[one, two] = fixture.nativeElement.querySelectorAll("cds-checkbox");
		await rendered(group);
	});

	const update = async (changes: Partial<CheckboxGroupTest>) => {
		Object.assign(fixture.componentInstance, changes);
		fixture.detectChanges();
		await fixture.whenStable();
		fixture.detectChanges();
		await rendered(group);
		await rendered(one);
	};

	it("should pass inputs through to the web component", () => {
		expect(group instanceof customElements.get("cds-checkbox-group")).toBe(true);
		expect(group.legendText).toBe("Legend");
		expect(group.legendId).toBe("group-legend");
		expect(group.helperText).toBe("Helper");
		expect(group.orientation).toBe("horizontal");
		expect(group.shadowRoot.querySelector("legend").textContent).toContain("Legend");
	});

	it("should render a TemplateRef legend", async () => {
		await update({ legend: fixture.componentInstance.legendTemplate });
		expect(group.shadowRoot.querySelector("legend .legend").textContent).toBe("Template legend");
	});

	it("should project the decorator into the decorator slot", async () => {
		await update({ withDecorator: true });
		expect(group.querySelector(".decorator").getAttribute("slot")).toBe("decorator");
	});

	it("should let the web component pass readOnly on to every checkbox", async () => {
		await update({ readOnly: true });
		expect(group.readonly).toBe(true);
		expect(one.readonly).toBe(true);
		expect(two.readonly).toBe(true);
	});

	it("should mark the whole group invalid through the web component", async () => {
		await update({ invalid: true });
		expect(group.invalid).toBe(true);
		expect(one.hasAttribute("invalid-group")).toBe(true);
		expect(two.hasAttribute("invalid-group")).toBe(true);
		expect(one.invalid).toBe(false);

		await update({ invalid: false });
		expect(one.hasAttribute("invalid-group")).toBe(false);
	});

	it("should pass warn to the web component group only", async () => {
		await update({ warn: true });
		expect(group.warn).toBe(true);
		expect(one.warn).toBe(false);
	});
});

@Component({
	template: `
		<cds-checkbox-group [disabled]="disabled" legend="Group">
			<cds-checkbox [readOnly]="true">Own read-only</cds-checkbox>
			<cds-checkbox [disabled]="true">Own disabled</cds-checkbox>
			<cds-checkbox>Plain</cds-checkbox>
		</cds-checkbox-group>
	`,
	imports: [Checkbox, CheckboxGroup]
})
class CheckboxGroupStateTest {
	disabled: boolean | undefined;
}

describe("CheckboxGroup state propagation", () => {
	let fixture;
	let group;
	let checkboxes: any[];

	beforeEach(async () => {
		fixture = TestBed.createComponent(CheckboxGroupStateTest);
		await settle(fixture);
		group = fixture.nativeElement.querySelector("cds-checkbox-group");
		checkboxes = Array.from(fixture.nativeElement.querySelectorAll("cds-checkbox"));
	});

	it("should keep the web component's defaults when inputs are unset", () => {
		expect(group.orientation).toBe("vertical");
		expect(group.disabled).toBe(false);
	});

	it("should let the web component disable and re-enable every checkbox", async () => {
		fixture.componentInstance.disabled = true;
		await settle(fixture);
		expect(checkboxes.map(checkbox => checkbox.disabled)).toEqual([true, true, true]);

		fixture.componentInstance.disabled = false;
		await settle(fixture);
		expect(checkboxes.map(checkbox => checkbox.disabled)).toEqual([false, false, false]);
	});
});
