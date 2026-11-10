import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	TemplateRef,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/tag/index.js";
import { TemplateSlot } from "carbon-components-angular/utils";
import { TagType } from "./tag.component";

/**
 * Adds Angular inputs/outputs to the `<cds-dismissible-tag>` web component.
 *
 * ```html
 * <cds-dismissible-tag text="Filter" (close)="remove()" />
 * ```
 *
 * The web component hides itself when closed; Angular owns the element, so that is
 * cancelled and `close` emits instead. Remove the tag yourself (e.g. with `@if`).
 *
 * [See demo](../../?path=/story/components-tag--filter)
 */
@Component({
	selector: "cds-dismissible-tag",
	template: `
		<ng-content />
		<ng-container cdsSlot="decorator" [cdsSlotTemplate]="decorator" />
	`,
	host: {
		"[text]": "text",
		"[type]": "type",
		"[size]": "size",
		"[disabled]": "disabled",
		"[tagTitle]": "title",
		"[dismissTooltipLabel]": "closeButtonLabel",
		"(cds-dismissible-tag-beingclosed)": "onClose($event)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TagFilter {
	@Input() text = "";
	@Input() type: TagType = "gray";
	@Input() size: "sm" | "md" | "lg" = "md";
	@Input() decorator: TemplateRef<any>;
	@Input() closeButtonLabel: string;
	@Input() disabled = false;
	@Input() title: string;

	@Output() close = new EventEmitter<void>();
	/**
	 * Emits `{ action: "click" }` for label clicks and `{ action: "close" }` for the close button.
	 */
	// eslint-disable-next-line @angular-eslint/no-output-native
	@Output() click = new EventEmitter<{ action: "click" | "close" }>();

	constructor() {
		// A host `(click)` listener would subscribe to the `click` output instead of the DOM event.
		inject(ElementRef).nativeElement.addEventListener("click", (event: Event) => this.onClick(event));
	}

	onClick(event: Event) {
		event.stopImmediatePropagation();
		const onCloseButton = event.composedPath().some(node => (node as Element).classList?.contains("cds--tag__close-icon"));
		if (!this.disabled && !onCloseButton) {
			this.click.emit({ action: "click" });
		}
	}

	onClose(event: Event) {
		event.preventDefault();
		this.click.emit({ action: "close" });
		this.close.emit();
	}
}
