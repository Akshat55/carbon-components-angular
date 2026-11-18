import { TestBed } from "@angular/core/testing";
import { Component } from "@angular/core";

import { CdsLayer } from "./layer.component";
import { settle } from "../test-helpers/web-components";

@Component({
	template: `
		<cds-layer id="outer">
			One
			<cds-layer class="test">
				Two
				<cds-layer>Three</cds-layer>
			</cds-layer>
		</cds-layer>
		<cds-layer [level]="2" id="fixed">Fixed</cds-layer>
	`,
	imports: [CdsLayer]
})
class NestedLayerTest {}

@Component({
	template: `<cds-layer>One<cds-layer [withBackground]="true">Two</cds-layer></cds-layer>`,
	imports: [CdsLayer]
})
class CdsLayerTest {}

describe("Layer", () => {
	it("should create a layer at the first level", async () => {
		const fixture = TestBed.createComponent(NestedLayerTest);
		await settle(fixture);
		const outer = fixture.nativeElement.querySelector("#outer");
		expect(outer instanceof customElements.get("cds-layer")).toBe(true);
		expect(outer.level).toBe(0);
	});

	it("should put nested layers one level up, up to the last level", async () => {
		const fixture = TestBed.createComponent(NestedLayerTest);
		await settle(fixture);
		await settle(fixture);
		const [, second, third] = fixture.nativeElement.querySelectorAll("#outer, #outer cds-layer");
		expect(second.level).toBe(1);
		expect(third.level).toBe(2);
	});

	it("should keep user provided classes", async () => {
		const fixture = TestBed.createComponent(NestedLayerTest);
		await settle(fixture);
		expect(fixture.nativeElement.querySelector("cds-layer.test")).toBeTruthy();
	});

	it("should use a fixed level", async () => {
		const fixture = TestBed.createComponent(NestedLayerTest);
		await settle(fixture);
		expect(fixture.nativeElement.querySelector("#fixed").level).toBe(2);
	});
});

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
