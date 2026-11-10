import {
	ApplicationRef,
	ChangeDetectorRef,
	DestroyRef,
	Directive,
	ElementRef,
	EmbeddedViewRef,
	forwardRef,
	inject,
	Input,
	OnChanges,
	OnDestroy,
	Provider,
	SimpleChanges,
	TemplateRef,
	Type,
	ViewContainerRef
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

/*
 * Wrapping a web component
 * ------------------------
 * - Use a `@Component` whose selector is the web component's tag, with `<ng-content />` as the
 *   template, and import the web component file so it registers itself.
 * - Pass inputs with `host` property bindings and add `schemas: [CUSTOM_ELEMENTS_SCHEMA]`
 *   to the wrapper (consumers don't need it).
 * - Angular rewrites `[readonly]`, `[tabindex]`, `[for]` and `[class]` to the DOM properties
 *   `readOnly`, `tabIndex`, `htmlFor` and `className`, so bind those as attributes instead:
 *   `"[attr.readonly]": "readOnly ? '' : null"`.
 * - A host `(event)` listener whose name matches one of the component's outputs subscribes to
 *   that output, not the DOM event. Use `addEventListener` for those.
 */

/**
 * Turns a `string | TemplateRef` input into a value a web component property can render.
 *
 * Strings pass straight through. Templates are rendered into a `<span>`; the web component
 * renders that node inside its shadow DOM and Angular keeps updating the template's bindings.
 *
 * Use it from a field initializer so `inject()` runs in an injection context:
 *
 * ```ts
 * private content = new TemplateContent();
 * // host: { "[helperText]": "content.render('helperText', helperText)" }
 * ```
 */
export class TemplateContent {
	private appRef = inject(ApplicationRef);
	private views = new Map<string, { template: TemplateRef<any>, view: EmbeddedViewRef<any>, element: HTMLElement }>();

	constructor() {
		inject(DestroyRef).onDestroy(() => this.views.forEach((_, key) => this.destroy(key)));
	}

	render(key: string, value: string | TemplateRef<any> | null | undefined, context: object = {}) {
		if (!(value instanceof TemplateRef)) {
			this.destroy(key);
			return value;
		}

		let entry = this.views.get(key);
		if (entry?.template !== value) {
			this.destroy(key);
			const view = value.createEmbeddedView({ ...context });
			const element = document.createElement("span");
			element.append(...view.rootNodes);
			this.appRef.attachView(view);
			entry = { template: value, view, element };
			this.views.set(key, entry);
		} else {
			Object.assign(entry.view.context, context);
		}
		return entry.element;
	}

	private destroy(key: string) {
		const entry = this.views.get(key);
		if (entry) {
			entry.view.destroy();
			entry.element.remove();
			this.views.delete(key);
		}
	}
}

/**
 * Renders a template into one of the web component's named slots.
 *
 * Root elements get the `slot` attribute directly (web components such as `cds-checkbox`
 * expect e.g. the `cds-ai-label` itself in the slot). If the template also has root text,
 * everything is wrapped in a `<span slot="...">` instead.
 *
 * ```html
 * <ng-container cdsSlot="decorator" [cdsSlotTemplate]="decorator" />
 * ```
 */
@Directive({ selector: "[cdsSlot]" })
export class TemplateSlot implements OnChanges, OnDestroy {
	@Input("cdsSlot") name: string;
	@Input("cdsSlotTemplate") template: TemplateRef<any> | null | undefined;
	@Input("cdsSlotContext") context: object = {};

	private viewContainer = inject(ViewContainerRef);
	private wrapper: HTMLElement | null = null;

	ngOnChanges(changes: SimpleChanges) {
		if (!changes["template"] && !changes["name"]) {
			const view = this.viewContainer.get(0) as EmbeddedViewRef<any>;
			if (view) {
				Object.assign(view.context, this.context);
			}
			return;
		}

		this.ngOnDestroy();
		if (!(this.template instanceof TemplateRef)) {
			return;
		}
		const view = this.viewContainer.createEmbeddedView(this.template, { ...this.context });
		view.detectChanges();
		const nodes = view.rootNodes.filter(node => !(node instanceof Comment));
		if (nodes.every(node => node instanceof Element)) {
			nodes.forEach(node => node.setAttribute("slot", this.name));
		} else {
			this.wrapper = document.createElement("span");
			this.wrapper.setAttribute("slot", this.name);
			nodes[0].parentNode.insertBefore(this.wrapper, nodes[0]);
			this.wrapper.append(...nodes);
		}
	}

	ngOnDestroy() {
		this.viewContainer.clear();
		this.wrapper?.remove();
		this.wrapper = null;
	}
}

/**
 * Calls `onChange` when a boolean attribute the web component reflects (e.g. `open`,
 * `expanded`) is added or removed, so the wrapper can mirror state the user changed.
 */
export function observeAttribute(
	element: Element,
	name: string,
	destroyRef: DestroyRef,
	onChange: (present: boolean) => void
) {
	const observer = new MutationObserver(() => onChange(element.hasAttribute(name)));
	observer.observe(element, { attributes: true, attributeFilter: [name] });
	destroyRef.onDestroy(() => observer.disconnect());
}

/**
 * `cds-overflow-menu-body` moves itself to `document.body` (or the closest
 * `[data-floating-menu-container]`) when it opens, so it is no longer inside the
 * Angular view that created it. Remove it with that view, wherever it ended up.
 */
// eslint-disable-next-line @angular-eslint/directive-selector -- matches the web component tag
@Directive({ selector: "cds-overflow-menu-body" })
export class FloatingMenuCleanup implements OnDestroy {
	private element: HTMLElement = inject(ElementRef).nativeElement;

	ngOnDestroy() {
		this.element.remove();
	}
}

/**
 * Registers a component as the `ControlValueAccessor` for `ngModel` and reactive forms.
 */
export function provideValueAccessor(type: () => Type<any>): Provider {
	return { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(type), multi: true };
}

/**
 * Shared `ControlValueAccessor` plumbing for form controls that wrap a web component.
 * Subclasses implement `writeValue` and call `onChange(value)` when the web component changes.
 */
@Directive({
	host: { "(focusout)": "onTouched()" }
})
export abstract class WebComponentValueAccessor<T = any> implements ControlValueAccessor {
	/**
	 * Set to `true` to disable the control.
	 */
	@Input() set disabled(value: boolean) {
		this._disabled = value;
		this.onDisabledChange();
	}
	get disabled() {
		return this._disabled;
	}

	protected changeDetectorRef = inject(ChangeDetectorRef);
	protected _disabled = false;

	onChange: (value: T) => void = () => {};
	onTouched: () => void = () => {};

	abstract writeValue(value: T): void;

	registerOnChange(fn: (value: T) => void) {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => void) {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean) {
		this.disabled = isDisabled;
		this.changeDetectorRef.markForCheck();
	}

	/**
	 * Called when `disabled` changes, for subclasses that pass it on to children.
	 */
	protected onDisabledChange() {}
}
