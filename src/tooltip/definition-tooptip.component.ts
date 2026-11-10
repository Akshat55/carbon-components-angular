import {
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
import { NgTemplateOutlet } from "@angular/common";
import "@carbon/web-components/es/components/tooltip/index.js";

/**
 * Adds Angular inputs and `[(isOpen)]` to the `<cds-definition-tooltip>` web component.
 * The term goes in the default slot; `description` fills the `definition` slot.
 *
 * ```html
 * <cds-definition-tooltip description="Uniform Resource Locator">URL</cds-definition-tooltip>
 * ```
 *
 * [See demo](../../?path=/story/components-tooltip-definition--basic)
 */
@Component({
	selector: "cds-definition-tooltip",
	template: `
		<ng-content />
		@if (description) {
			<span slot="definition">
				@if (isTemplate(description)) {
					<ng-template [ngTemplateOutlet]="description" [ngTemplateOutletContext]="{ $implicit: templateContext }" />
				} @else {
					{{ description }}
				}
			</span>
		}
	`,
	host: {
		"[id]": "id",
		"[align]": "align",
		"[autoalign]": "autoAlign",
		"[openOnHover]": "openOnHover",
		"[open]": "isOpen"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TooltipDefinition {
	static tooltipCount = 0;

	@Input() id = `tooltip-definition-${TooltipDefinition.tooltipCount++}`;
	@Input() description: string | TemplateRef<any>;
	@Input() templateContext: any;
	@Input() openOnHover = false;
	@Input() align = "bottom";
	@Input() autoAlign = false;
	@Input() isOpen = false;

	// eslint-disable-next-line @angular-eslint/no-output-on-prefix
	@Output() onClose: EventEmitter<Event> = new EventEmitter();
	// eslint-disable-next-line @angular-eslint/no-output-on-prefix
	@Output() onOpen: EventEmitter<Event> = new EventEmitter();
	@Output() isOpenChange = new EventEmitter<boolean>();

	protected element = inject(ElementRef).nativeElement;
	protected changeDetectorRef = inject(ChangeDetectorRef);

	constructor() {
		// The web component keeps `open` as internal state; read it back after each interaction.
		// Capture, as it stops some events (e.g. Escape) inside its shadow root.
		["mousedown", "keydown", "focusin", "focusout", "mouseenter", "mouseleave"].forEach(type =>
			this.element.addEventListener(type, () => this.syncOpen(), { capture: true })
		);
	}

	async syncOpen() {
		await this.element.updateComplete;
		if (this.element.open !== this.isOpen) {
			this.isOpen = this.element.open;
			this.isOpenChange.emit(this.isOpen);
			(this.isOpen ? this.onOpen : this.onClose).emit();
			this.changeDetectorRef.markForCheck();
		}
	}

	isTemplate(value: unknown): value is TemplateRef<any> {
		return value instanceof TemplateRef;
	}
}
