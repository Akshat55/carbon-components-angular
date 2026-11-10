import { ComponentFixture } from "@angular/core/testing";

/**
 * Helpers for specs of the web component wrappers. The web components render
 * asynchronously (Lit) and keep their markup in a shadow root.
 */

/**
 * Waits for a web component's pending render.
 */
export async function rendered(element: Element | null): Promise<void> {
	await (element as any)?.updateComplete;
}

/**
 * Runs change detection, lets `ngModel` / microtasks settle, and waits for every
 * web component under the fixture to render.
 *
 * It also yields one macrotask: zone.js drains chained promises in a single microtask,
 * so native microtasks such as `MutationObserver` callbacks (used to mirror the web
 * components' reflected attributes) would otherwise run after the test continues.
 */
export async function settle(fixture: ComponentFixture<any>): Promise<void> {
	fixture.detectChanges();
	await new Promise(resolve => setTimeout(resolve));
	await fixture.whenStable();
	fixture.detectChanges();
	const elements = Array.from<Element>(fixture.nativeElement.querySelectorAll("*"));
	await Promise.all(elements.filter(element => element.localName.includes("-")).map(rendered));
}

/**
 * First match of `selector` inside `element`'s shadow root.
 */
export function shadow<T extends Element = HTMLElement>(element: Element | null, selector: string): T | null {
	return element?.shadowRoot?.querySelector<T>(selector) ?? null;
}

/**
 * Sets an input element's value and fires `input`, as typing does.
 */
export function typeInto(input: HTMLInputElement | HTMLTextAreaElement, value: string): void {
	input.value = value;
	input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
}
