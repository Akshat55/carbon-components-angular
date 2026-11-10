import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
	TemplateRef,
	inject
} from "@angular/core";
import { Subscription } from "rxjs";
import "@carbon/web-components/es/components/tree-view/index.js";
import { TreeNodeComponent } from "./tree-node.component";
import { TreeViewService } from "./treeview.service";
import { EventOnNode, Node } from "./tree-node.types";

/**
 * Wraps the `<cds-tree-view>` web component. Pass `tree` or project `cds-tree-node`s.
 *
 * ```html
 * <cds-tree-view label="Files" [tree]="nodes" (select)="onSelect($event)" />
 * ```
 *
 * [See demo](../../?path=/story/components-tree-view--basic)
 */
@Component({
	selector: "cds-tree-view",
	template: `
		@for (node of tree; track node.id ?? $index) {
			<cds-tree-node [node]="node" (nodetoggle)="onToggle($event)" />
		}
		<ng-content />
	`,
	host: {
		"[id]": "id",
		"[label]": "isTemplate(label) ? '' : label",
		"[hideLabel]": "hideLabel",
		"[size]": "size"
	},
	providers: [TreeViewService],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TreeNodeComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TreeViewComponent implements OnInit, OnDestroy {
	static treeViewCount = 0;

	treeViewService = inject(TreeViewService);

	@Input() set tree(treeNodes: Node[]) {
		this._tree = treeNodes;
		this.treeViewService.contentProjected = false;
	}
	get tree() {
		return this._tree;
	}
	@Input() id = `tree-view-${TreeViewComponent.treeViewCount++}`;
	/**
	 * Tree label. A `TemplateRef` is not supported by the web component and renders nothing.
	 */
	@Input() label: string | TemplateRef<any>;
	@Input() hideLabel = false;
	@Input() labelContext: any;
	@Input() size: "xs" | "sm" = "sm";
	@Input() set isMultiSelect(isMulti: boolean) {
		this.treeViewService.isMultiSelect = isMulti;
	}

	/**
	 * Emits the selected node, or all selected nodes when `isMultiSelect`.
	 */
	@Output() select = new EventEmitter<Node | Node[]>();
	// eslint-disable-next-line @angular-eslint/no-output-native
	@Output() toggle = new EventEmitter<Node>();

	private _tree: Node[] = [];
	private subscription: Subscription;

	ngOnInit() {
		this.subscription = this.treeViewService.selectionObservable.subscribe((nodesMap: Map<string, Node>) => {
			const nodes = [...nodesMap.values()];
			this.select.emit(this.treeViewService.isMultiSelect ? nodes : nodes[0]);
		});
	}

	ngOnDestroy() {
		this.subscription?.unsubscribe();
	}

	onToggle({ node }: EventOnNode) {
		this.toggle.emit(node);
	}

	isTemplate(value: unknown): value is TemplateRef<any> {
		return value instanceof TemplateRef;
	}
}
