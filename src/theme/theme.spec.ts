import { TestBed, ComponentFixture } from "@angular/core/testing";
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { By } from "@angular/platform-browser";

import { ThemeDirective } from "./theme.directive";
import { CdsLayerDirective } from "../layer";

@Component({
	template: `<div cdsTheme></div>`
})
class TestThemeComponent { }

describe("Theme", () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [
				TestThemeComponent,
				ThemeDirective
			],
			imports: [
				// standalone directive
				CdsLayerDirective
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		});
	});

	it("should assign theme class to div", () => {
		let fixture: ComponentFixture<TestThemeComponent> = TestBed.createComponent(TestThemeComponent);
		let component: TestThemeComponent = fixture.componentInstance;
		fixture.detectChanges();

		expect(component).toBeTruthy();
		const directiveEl = fixture.debugElement.query(By.directive(ThemeDirective));
		expect(directiveEl).not.toBeNull();
		expect(directiveEl.nativeElement.classList.contains("cds--white")).toBeTruthy();
		expect(directiveEl.nativeElement.classList.contains("cds--layer-one")).toBeTruthy();
	});

	it("should reset nested layer level", () => {
		TestBed.overrideComponent(TestThemeComponent, {
			set: {
				template: `
					<cds-layer level="2">
						<div cdsTheme>
							<cds-layer id="nested-layer"></cds-layer>
						</div>
					</cds-layer>
				`
			}
		});

		let fixture: ComponentFixture<TestThemeComponent> = TestBed.createComponent(TestThemeComponent);
		fixture.detectChanges();

		// A theme boundary restarts layering — the layer nested directly
		// inside the theme is reset to level 1.
		const nestedLayer = fixture.debugElement.query(By.css("#nested-layer")).nativeElement;
		expect(nestedLayer.getAttribute("level")).toBe("1");
	});

	it("should not override an explicit [cdsLayer] level inside a theme", () => {
		TestBed.overrideComponent(TestThemeComponent, {
			set: {
				template: `
					<div cdsTheme>
						<cds-layer id="explicit-layer" [cdsLayer]="2"></cds-layer>
					</div>
				`
			}
		});

		let fixture: ComponentFixture<TestThemeComponent> = TestBed.createComponent(TestThemeComponent);
		fixture.detectChanges();

		const explicitLayer = fixture.debugElement.query(By.css("#explicit-layer")).nativeElement;
		expect(explicitLayer.getAttribute("level")).toBe("2");
	});

	/**
	 * @todo Remove this test when `ibmTheme` is removed
	 * v6
	 */
	it("should work with deprecated `ibmTheme` input property", () => {
		TestBed.overrideComponent(TestThemeComponent, {
			set: {
				template: `
					<div ibmTheme="g100"></div>
				`
			}
		});

		TestBed.compileComponents().then(() => {
			let fixture: ComponentFixture<TestThemeComponent> = TestBed.createComponent(TestThemeComponent);
			fixture.detectChanges();

			const directiveEl = fixture.debugElement.query(By.directive(ThemeDirective));
			expect(directiveEl.nativeElement.classList.contains("cds--g100")).toBeTruthy();
			expect(directiveEl.nativeElement.classList.contains("cds--layer-one")).toBeTruthy();
		});
	});
});
