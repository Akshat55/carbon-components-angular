import { DOCUMENT } from '@angular/common';
import {
	Component,
	Input,
	Output,
	TemplateRef,
	EventEmitter,
	AfterViewInit,
	Inject,
	QueryList,
	ViewChildren,
	ViewChild,
	ElementRef
} from '@angular/core';
import { TreeNodeComponent } from './tree-node.component';
import { TreeViewSelectionService } from './treeview-selection.service';

@Component({
	selector: 'cds-tree-view',
	template: `
		<label
			*ngIf="label"
			[id]="id"
			class="cds--label">
			{{label}}
		</label>
		<div
			class="cds--tree"
			[ngClass]="{
				'cds--tree--sm': size === 'sm',
				'cds--tree-xs': size === 'xs'
			}"
			[attr.aria-label]="label ? label : null"
			[attr.aria-labelledby]="!label ? id : null"
			[attr.aria-multiselectable]="isMultiSelect || null"
			role="tree"
			(keydown)="navigateTree($event)"
			#treeWrapper>
			<cds-tree-node
				#node
				*ngFor="let node of tree"
				[node]="node"
				(nodeFocus)="nodeFocus($event)">
			</cds-tree-node>
		</div>
	`,
	providers: [TreeViewSelectionService]
})
export class TreeViewComponent implements AfterViewInit {
	static treeViewCount = 0;

	treeWalker: any;
	/**
	 * @todo
	 * Double check how id is done in tree view, look into TreeLabel component in React
	 */
	@Input() id = `tree-view-${TreeViewComponent.treeViewCount++}`;
	@Input() label: string | TemplateRef<any>;
	/**
	 * Specify the size of the list items in the tree
	 */
	@Input() size: "xs" | "sm" = "sm";
	/**
	 * **Experimental** - Enable to select multiple nodes
	 */
	@Input() isMultiSelect = false;

	/**
	 * Add interface
	 */
	@Input() tree: any = [];


	@Output() select = new EventEmitter();

	nodeFocus(event) {
		console.log(event);
	}

	constructor(@Inject(DOCUMENT) private document: Document) { }
	@ViewChild('treeWrapper') root: ElementRef;
	@ViewChildren('node') children: QueryList<TreeNodeComponent>;

	ngAfterViewInit(): void {
		setTimeout(() => {
			console.log(this.children);
		},3000);
		this.treeWalker = this.document.createTreeWalker(this.root.nativeElement, NodeFilter.SHOW_ELEMENT, {
			acceptNode: function (node: HTMLElement) {
				if (node.classList.contains(`cds--tree-node--disabled`)) {
					return NodeFilter.FILTER_REJECT;
				}
				if (node.matches(`div.cds--tree-node`)) {
					return NodeFilter.FILTER_ACCEPT;
				}
				return NodeFilter.FILTER_SKIP;
			},
		});
	}

	navigateTree(event: KeyboardEvent) {
		if (event.key === "ArrowUp") {
			this.treeWalker.previousNode()?.focus();
		}

		if (event.key === "ArrowDown") {
			this.treeWalker.nextNode()?.focus();
		}
	}
}
