import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	SimpleChanges,
	inject
} from "@angular/core";
import { Subscription } from "rxjs";
import "@carbon/web-components/es/components/menu/index.js";
import { ContextMenuSelectionService } from "./context-menu-selection.service";

/**
 * Adds Angular selection handling to the `<cds-menu-item-group>` web component. With `type`,
 * its `checkbox` / `radio` items share one selection (`value` / `valueChange`).
 */
@Component({
	selector: "cds-menu-item-group",
	template: "<ng-content />",
	host: {
		"[label]": "label"
	},
	providers: [ContextMenuSelectionService],
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContextMenuGroupComponent implements OnInit, OnChanges, OnDestroy {
	@Input() label = null;
	@Input() value: any[] = [];
	@Input() type: null | "radio" | "checkbox" = null;

	@Output() valueChange = new EventEmitter<any[]>();

	protected contextMenuSelectionService = inject(ContextMenuSelectionService);
	private subscription = new Subscription();

	ngOnInit() {
		this.subscription.add(this.contextMenuSelectionService.selectionObservable.subscribe(value => this.valueChange.emit(value)));
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.value) {
			if (this.type === "radio") {
				this.contextMenuSelectionService.selectRadio(changes.value.currentValue);
			}
			if (this.type === "checkbox") {
				this.contextMenuSelectionService.selectCheckboxes(changes.value.currentValue);
			}
		}
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
