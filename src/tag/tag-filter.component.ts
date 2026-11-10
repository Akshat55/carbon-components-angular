import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output,
	TemplateRef
} from "@angular/core";
import "@carbon/web-components/es/components/tag/index.js";
import { TemplateSlot } from "carbon-components-angular/utils";
import { TagType } from "./tag.component";

/**
 * A dismissible tag. Renders `<cds-tag filter>`, which keeps the label in the default slot.
 *
 * [See demo](../../?path=/story/components-tag--filter)
 */
@Component({
	selector: "cds-tag-filter",
	template: `
		<cds-tag
			filter
			[type]="type"
			[size]="size"
			[disabled]="disabled"
			[title]="title || closeButtonLabel"
			(click)="onClick($event)"
			(cds-tag-beingclosed)="onClose($event)">
			@if (!skeleton) {
				<ng-content />
				<ng-container cdsSlot="decorator" [cdsSlotTemplate]="decorator" />
			}
		</cds-tag>
	`,
	styles: [":host { display: contents; }"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TagFilter {
	@Input() type: TagType = "gray";
	@Input() size: "sm" | "md" | "lg" = "md";
	@Input() skeleton = false;
	@Input() decorator: TemplateRef<any>;
	@Input() closeButtonLabel = "Clear Filter";
	@Input() disabled = false;
	@Input() title: string;

	@Output() close = new EventEmitter<any>();
	/**
	 * Emits `{ action: "click" }` for label clicks and `{ action: "close" }` for the close button.
	 */
	// eslint-disable-next-line @angular-eslint/no-output-native
	@Output() click = new EventEmitter<{ action: "click" | "close" }>();

	onClick(event: Event) {
		event.stopImmediatePropagation();
		const onCloseButton = event.composedPath().some(node => (node as Element).classList?.contains("cds--tag__close-icon"));
		if (!this.disabled && !onCloseButton) {
			this.click.emit({ action: "click" });
		}
	}

	/**
	 * The web component removes itself on close; Angular owns this element, so cancel that
	 * and let the consumer remove the tag (e.g. with `@if`), as in v6.
	 */
	onClose(event: Event) {
		event.preventDefault();
		this.click.emit({ action: "close" });
		this.close.emit();
	}
}
