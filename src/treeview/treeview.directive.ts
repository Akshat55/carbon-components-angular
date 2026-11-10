/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsTreeViewDirective
 *
 * Sits directly on <cds-tree-view> — no wrapper element, no extra DOM node.
 *
 * The web component uses <cds-tree-node> children. To preserve the old
 * carbon-components-angular API — where the tree was driven by a `[tree]`
 * array of Node objects — this directive renders the node tree from the
 * array. Projected <cds-tree-node> children also work.
 *
 * Backwards-compatible API surface (matches carbon-components-angular):
 *   [tree]      → renders nested <cds-tree-node> children from Node objects
 *   [label]     → label attribute (string only)
 *   [hideLabel] → informational (web component hides label when empty)
 *   (select)    ← bridged from the `cds-tree-node-selected` event
 *   (toggle)    ← bridged from the `cds-tree-node-toggled` event
 */
import {
	Directive,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
	TemplateRef
} from "@angular/core";
import { Node } from "./tree-node.types";

@Directive({
	selector: "cds-tree-view, [cdsTreeView], [ibmTreeView]",
	standalone: true
})
export class CdsTreeViewDirective implements OnChanges {
	/** Array of tree nodes — same `Node` interface as before. */
	@Input() tree: Node[];

	/** Tree label (string only). */
	@Input() label: string | TemplateRef<any>;

	/** Visually hide the label. */
	@Input() hideLabel = false;

	/** Emits the selected node. */
	@Output() select = new EventEmitter<Node | Node[]>();

	/** Emits the toggled (expanded/collapsed) node. */
	@Output() toggle = new EventEmitter<Node>();

	private _generated: HTMLElement[] = [];
	private _nodeMap = new Map<HTMLElement, Node>();

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(changes: SimpleChanges): void {
		const el = this._el.nativeElement;

		if (typeof this.label === "string" && !this.hideLabel) {
			el.setAttribute("label", this.label);
		}

		if (changes["tree"]) {
			this._renderTree();
		}
	}

	@HostListener("cds-tree-node-selected", ["$event"])
	onSelected(event: CustomEvent): void {
		const node = this._nodeMap.get(event.target as HTMLElement);
		if (node) {
			node.selected = true;
			this.select.emit(node);
		}
	}

	@HostListener("cds-tree-node-toggled", ["$event"])
	onToggled(event: CustomEvent): void {
		const node = this._nodeMap.get(event.target as HTMLElement);
		if (node) {
			node.expanded = !node.expanded;
			this.toggle.emit(node);
		}
	}

	private _renderTree(): void {
		const el = this._el.nativeElement;

		this._generated.forEach((node) => node.remove());
		this._generated = [];
		this._nodeMap.clear();

		if (!this.tree) {
			return;
		}

		for (const node of this.tree) {
			const nodeEl = this._createNode(node);
			el.appendChild(nodeEl);
			this._generated.push(nodeEl);
		}
	}

	private _createNode(node: Node): HTMLElement {
		const nodeEl = document.createElement("cds-tree-node");

		if (typeof node.label === "string") {
			nodeEl.setAttribute("label", node.label);
		}
		if (node.id) {
			nodeEl.setAttribute("id", node.id);
		}
		if (node.disabled) {
			nodeEl.setAttribute("disabled", "");
		}
		if (node.selected) {
			nodeEl.setAttribute("selected", "");
		}
		if (node.active) {
			nodeEl.setAttribute("active", "");
		}
		if (node.expanded) {
			nodeEl.setAttribute("is-expanded", "");
		}

		this._nodeMap.set(nodeEl, node);

		for (const child of node.children ?? []) {
			nodeEl.appendChild(this._createNode(child));
		}

		return nodeEl;
	}
}
