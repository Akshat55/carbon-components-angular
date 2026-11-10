import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	OnInit,
	TemplateRef,
	ViewChild,
	inject
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import "@carbon/web-components/es/components/tooltip/index.js";

/**
 * Renders the `<cds-definition-tooltip>` web component. The term goes in the default slot.
 *
 * ```html
 * <cds-tooltip-definition description="Uniform Resource Locator">URL</cds-tooltip-definition>
 * ```
 *
 * [See demo](../../?path=/story/components-tooltip-definition--basic)
 */
@Component({
	selector: "cds-tooltip-definition",
	template: `
		<cds-definition-tooltip
			#tooltip
			[id]="id"
			[align]="align"
			[autoalign]="autoAlign"
			[openOnHover]="openOnHover"
			[open]="isOpen">
			<ng-content />
			<span slot="definition">
				@if (isTemplate(description)) {
					<ng-template [ngTemplateOutlet]="description" [ngTemplateOutletContext]="{ $implicit: templateContext }" />
				} @else {
					{{ description }}
				}
			</span>
		</cds-definition-tooltip>
	`,
	styles: [":host { display: inline; }"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TooltipDefinition implements OnInit {
	static tooltipCount = 0;

	@Input() id = `tooltip-definition-${TooltipDefinition.tooltipCount++}`;
	@Input() description: string | TemplateRef<any>;
	@Input() templateContext: any;
	@Input() openOnHover = false;
	@Input() align = "bottom";
	@Input() autoAlign = false;
	/**
	 * Initial open state.
	 */
	@Input() isOpen = false;

	// eslint-disable-next-line @angular-eslint/no-output-on-prefix
	@Output() onClose: EventEmitter<Event> = new EventEmitter();
	// eslint-disable-next-line @angular-eslint/no-output-on-prefix
	@Output() onOpen: EventEmitter<Event> = new EventEmitter();
	@Output() isOpenChange = new EventEmitter<boolean>();

	@ViewChild("tooltip", { static: true }) tooltip: ElementRef;

	protected changeDetectorRef = inject(ChangeDetectorRef);

	ngOnInit() {
		// Capture, as the web component stops some events (e.g. Escape) inside its shadow root.
		["mousedown", "keydown", "focusin", "focusout", "mouseenter", "mouseleave"].forEach(type =>
			this.tooltip.nativeElement.addEventListener(type, () => this.syncOpen(), { capture: true })
		);
	}

	/**
	 * The web component keeps `open` as internal state; read it back after each interaction.
	 */
	async syncOpen() {
		const element = this.tooltip.nativeElement;
		await element.updateComplete;
		if (element.open !== this.isOpen) {
			this.isOpen = element.open;
			this.isOpenChange.emit(this.isOpen);
			(this.isOpen ? this.onOpen : this.onClose).emit();
			this.changeDetectorRef.markForCheck();
		}
	}

	isTemplate(value: unknown): value is TemplateRef<any> {
		return value instanceof TemplateRef;
	}
}
