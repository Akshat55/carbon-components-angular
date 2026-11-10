import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA
} from "@angular/core";
import "@carbon/web-components/es/components/modal/index.js";

/**
 * Wraps the `<cds-modal-footer>` web component. Project the footer buttons.
 */
@Component({
	selector: "cds-modal-footer",
	template: `<ng-content />`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalFooter {}
