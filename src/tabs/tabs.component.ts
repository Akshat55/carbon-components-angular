import {
	booleanAttribute,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/tabs/index.js";

/**
 * Adds Angular inputs and outputs to the `<cds-tabs>` web component. Importing it registers the web component.
 *
 * Project `cds-tab`s. Panels live outside `cds-tabs`; each `cds-tab` points at one with `target`.
 * `[(value)]` tracks the selected tab, so panels can also be rendered with `@if`.
 *
 * ```html
 * <cds-tabs [(value)]="tab">
 * 	<cds-tab value="one" target="panel-one">One</cds-tab>
 * 	<cds-tab value="two" target="panel-two">Two</cds-tab>
 * </cds-tabs>
 * <div id="panel-one" role="tabpanel">First panel</div>
 * <div id="panel-two" role="tabpanel" hidden>Second panel</div>
 * ```
 *
 * [See demo](../../?path=/story/components-tabs--basic)
 */
@Component({
	selector: "cds-tabs",
	template: "<ng-content />",
	host: {
		"[type]": "type",
		"[size]": "size",
		"[iconSize]": "iconSize",
		"[fullWidth]": "fullWidth",
		"[dismissable]": "dismissable",
		"[selectionMode]": "selectionMode",
		"[value]": "value ?? element.value",
		"[triggerContent]": "triggerContent",
		"(cds-tabs-selected)": "onSelected($event)",
		"(cds-tab-closed)": "onClosed($event)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tabs {
	@Input() type: "line" | "contained" = "line";
	/**
	 * `sm` and `md` for line tabs, `sm`, `md` and `lg` for contained tabs (`xl` in `cds-tabs-vertical`).
	 */
	@Input() size: "sm" | "md" | "lg" | "xl";
	@Input() iconSize: "default" | "lg";
	/**
	 * Contained tabs only: tabs share the full width of the container.
	 */
	@Input({ transform: booleanAttribute }) fullWidth = false;
	/**
	 * Adds a close button to every tab. Remove a tab on its `tabClose`.
	 */
	@Input({ transform: booleanAttribute }) dismissable = false;
	/**
	 * `automatic` selects a tab when the keyboard focuses it, `manual` waits for Enter or Space.
	 */
	@Input() selectionMode: "automatic" | "manual" = "automatic";
	/**
	 * @deprecated use `selectionMode`: `true` is `automatic`, `false` is `manual`.
	 */
	@Input() set followFocus(value: boolean) {
		this.selectionMode = value ? "automatic" : "manual";
	}
	/**
	 * The `value` of the selected tab. Without it, a tab marked `active` (or the first) is selected.
	 */
	@Input() value: string | undefined;
	/**
	 * The text of the menu button tabs collapse into on small screens.
	 */
	@Input() triggerContent: string;

	@Output() valueChange = new EventEmitter<string>();
	/**
	 * Emits the selected `cds-tab` element after a user selects it.
	 */
	@Output() selected = new EventEmitter<HTMLElement>();
	/**
	 * Emits the index of the tab whose close button was clicked.
	 */
	@Output() tabClose = new EventEmitter<number>();

	readonly element: any = inject(ElementRef).nativeElement;
	protected changeDetectorRef = inject(ChangeDetectorRef);

	onSelected(event: Event) {
		const { item } = (event as CustomEvent<{ item: HTMLElement & { value: string } }>).detail;
		this.value = item.value;
		this.valueChange.emit(this.value);
		this.selected.emit(item);
		this.changeDetectorRef.markForCheck();
	}

	onClosed(event: Event) {
		this.tabClose.emit((event as CustomEvent<{ index: number }>).detail.index);
	}
}
