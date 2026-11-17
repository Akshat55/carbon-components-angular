import { TestBed, ComponentFixture } from "@angular/core/testing";
import { Component } from "@angular/core";
import { By } from "@angular/platform-browser";

import { LayerDirective } from "./layer.directive";
import { CdsLayer } from "./layer.component";
import { settle } from "../test-helpers/web-components";

@Component({
	template: `<div cdsLayer></div>`,
	imports: [LayerDirective]
})
class TestLayerComponent {
}

@Component({
	template: `
		<div cdsLayer>
			<div cdsLayer class="test"></div>
		</div>
	`,
	imports: [LayerDirective]
})
class TestNestedLayerComponent {}

describe("Layer", () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				TestLayerComponent,
				TestNestedLayerComponent
			]
		});
	});

	it("should create a Layer", () => {
		let fixture: ComponentFixture<TestLayerComponent> = TestBed.createComponent(TestLayerComponent);
		let component: TestLayerComponent = fixture.componentInstance;
		fixture.detectChanges();

		expect(component).toBeTruthy();
		const directiveEl = fixture.debugElement.query(By.directive(LayerDirective));
		expect(directiveEl).not.toBeNull();
		expect(directiveEl.nativeElement.classList.contains("cds--layer-two")).toBeTruthy();
	});

	it("should create a nested Layer", () => {
		let fixture: ComponentFixture<TestNestedLayerComponent> = TestBed.createComponent(TestNestedLayerComponent);
		fixture.detectChanges();

		const directiveEl = fixture.debugElement.query(By.directive(LayerDirective)).nativeElement;
		expect(directiveEl.querySelector("div").className.includes("cds--layer-three")).toBeTruthy();
	});

	it("should have additional user provided classes", () => {
		let fixture: ComponentFixture<TestNestedLayerComponent> = TestBed.createComponent(TestNestedLayerComponent);
		fixture.detectChanges();

		const directiveEl = fixture.debugElement.query(By.directive(LayerDirective)).nativeElement;
		expect(directiveEl.querySelector("div").className.includes("test")).toBeTruthy();
	});

	/**
	 * @todo Remove this test when `ibmLayer` is removed
	 * v6
	 */
	it("should work with deprecated `ibmLayer` input property", async () => {
		TestBed.overrideComponent(TestNestedLayerComponent, {
			set: {
				template: `
					<div cdsLayer>
						<div ibmLayer class="test">sdfs</div>
					</div>
				`
			}
		});

		await TestBed.compileComponents();

		let fixture = TestBed.createComponent(TestNestedLayerComponent);
		fixture.detectChanges();
		const directiveEl = fixture.debugElement.query(By.directive(LayerDirective));
		expect(directiveEl.nativeElement.querySelector("div").className.includes("cds--layer-three")).toBeTruthy();
	});
});

@Component({
	template: `<cds-layer>One<cds-layer [withBackground]="true">Two</cds-layer></cds-layer>`,
	imports: [CdsLayer]
})
class CdsLayerTest {}

describe("CdsLayer", () => {
	it("should keep the web component's defaults and pass inputs through", async () => {
		const fixture = TestBed.createComponent(CdsLayerTest);
		await settle(fixture);
		const [outer, inner] = fixture.nativeElement.querySelectorAll("cds-layer");
		expect(outer instanceof customElements.get("cds-layer")).toBe(true);
		expect(outer.withBackground).toBeFalsy();
		expect(inner.withBackground).toBe(true);
		expect(inner.level).toBe(outer.level + 1);
	});
});
