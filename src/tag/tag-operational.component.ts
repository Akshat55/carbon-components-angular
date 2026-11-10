import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input
} from "@angular/core";
import "@carbon/web-components/es/components/tag/index.js";
import { TagType } from "./tag.component";

/**
 * Wraps the `<cds-operational-tag>` web component.
 *
 * [See demo](../../?path=/story/components-tag--operational)
 */
@Component({
	selector: "cds-tag-operational",
	template: `
		<cds-operational-tag [type]="type" [size]="size" [disabled]="disabled">
			@if (!skeleton) {
				<ng-content />
			}
		</cds-operational-tag>
	`,
	styles: [":host { display: contents; }"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TagOperationalComponent {
	@Input() type: TagType = "gray";
	@Input() size: "sm" | "md" | "lg" = "md";
	@Input() skeleton = false;
	@Input() disabled = false;
}
