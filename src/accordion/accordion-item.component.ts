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
	TemplateRef,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/accordion/index.js";
import "@carbon/web-components/es/components/skeleton-text/index.js";
import { observeAttributes, TemplateSlot } from "carbon-components-angular/utils";

/**
 * Adds Angular inputs and outputs to the `<cds-accordion-item>` web component.
 *
 * [See demo](../../?path=/story/components-accordion--basic)
 */
@Component({
	selector: "cds-accordion-item",
	template: `
		@if (skeleton) {
			<cds-skeleton-text slot="title" />
			<cds-skeleton-text paragraph lineCount="3" />
		} @else {
			<ng-container cdsSlot="title" [cdsSlotTemplate]="isTemplate(title) ? title : null" [cdsSlotContext]="context" />
			<ng-content />
		}
	`,
	host: {
		"[id]": "id",
		"[title]": "isTemplate(title) || skeleton ? '' : (title ?? element.title)",
		"[open]": "expanded ?? element.open",
		"[disabled]": "disabled ?? element.disabled",
		"(cds-accordion-item-beingtoggled)": "onBeforeToggle($event)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AccordionItem {
	static accordionItemCount = 0;

	/**
	 * Plain text, or a template rendered in the `title` slot with `context`.
	 */
	@Input() title: string | TemplateRef<any>;
	@Input() context: object | null = null;
	@Input() id = `accordion-item-${AccordionItem.accordionItemCount++}`;
	/**
	 * Shows skeleton text instead of the title and content.
	 */
	@Input({ transform: booleanAttribute }) skeleton = false;
	/**
	 * Supports two-way binding with `expandedChange`. Unset, the web component keeps its own state.
	 */
	@Input({ transform: booleanAttribute }) expanded?: boolean;

	/**
	 * Unset, the item follows its `cds-accordion`'s `disabled`.
	 */
	@Input({ transform: booleanAttribute }) disabled?: boolean;

	/**
	 * Emits `{ id, expanded }` after the item is toggled.
	 */
	@Output() selected = new EventEmitter<{ id: string, expanded: boolean }>();
	@Output() expandedChange = new EventEmitter<boolean>();

	protected element = inject(ElementRef).nativeElement;
	private changeDetector = inject(ChangeDetectorRef);

	constructor() {
		// The web component reflects `open`, whoever toggles it.
		observeAttributes(this.element, ["open"], () => {
			const expanded = this.element.open;
			if (expanded !== !!this.expanded) {
				this.expanded = expanded;
				this.expandedChange.emit(expanded);
				this.selected.emit({ id: this.id, expanded });
				this.changeDetector.markForCheck();
			}
		});
	}

	/**
	 * Toggles the item, the same as a user click.
	 */
	toggleExpanded() {
		// The element is also disabled when its `cds-accordion` is.
		if (!this.skeleton && !this.element.disabled) {
			this.element.open = !this.element.open;
		}
	}

	onBeforeToggle(event: Event) {
		if (this.skeleton) {
			event.preventDefault();
		}
	}

	isTemplate(value: unknown): value is TemplateRef<any> {
		return value instanceof TemplateRef;
	}
}
