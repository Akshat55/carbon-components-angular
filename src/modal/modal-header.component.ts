import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output,
	TemplateRef,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/modal/index.js";
import { I18n } from "carbon-components-angular/i18n";
import { TemplateSlot } from "carbon-components-angular/utils";

/**
 * Wraps the `<cds-modal-header>` web component. `closeSelect` emits when the close button is clicked.
 */
@Component({
	selector: "cds-modal-header",
	template: `
		@if (showCloseButton) {
			<cds-modal-close-button [closeButtonLabel]="closeLabel" (click)="onClose()" />
		}
		<ng-content />
		<ng-container cdsSlot="ai-label" [cdsSlotTemplate]="decorator" />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalHeader {
	public i18n = inject(I18n);

	/**
	 * @deprecated set `theme` on `cds-modal`.
	 */
	@Input() theme = "default";
	@Input() closeLabel = this.i18n.get().MODAL.CLOSE;
	@Input() showCloseButton = true;
	@Input() decorator: TemplateRef<any>;

	@Output() closeSelect = new EventEmitter();

	onClose() {
		this.closeSelect.emit();
	}
}
