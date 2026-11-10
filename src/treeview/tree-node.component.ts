import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	DestroyRef,
	ElementRef,
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
import { IconDirective } from "carbon-components-angular/icon";
import { TemplateSlot } from "carbon-components-angular/utils";
import { TreeViewService } from "./treeview.service";
import { EventOnNode, Node } from "./tree-node.types";

/**
 * Wraps the `<cds-tree-node>` web component. Child nodes come from `children` / `node.children`
 * or projected `cds-tree-node`s.
 */
@Component({
	selector: "cds-tree-node",
	template: `
		@if (isTemplate(icon)) {
			<ng-container cdsSlot="icon" [cdsSlotTemplate]="icon" [cdsSlotContext]="{ $implicit: iconContext }" />
		} @else if (icon) {
			<svg [cdsIcon]="icon" size="16" slot="icon"></svg>
		}
		@for (child of children; track child.id ?? $index) {
			<cds-tree-node [node]="child" [depth]="depth + 1" [disabled]="disabled || !!child.disabled" />
		}
		<ng-content />
	`,
	host: {
		"[id]": "id",
		"[label]": "isTemplate(label) ? '' : label",
		"[active]": "active",
		"[disabled]": "disabled",
		"[selected]": "selected",
		"[isExpanded]": "expanded",
		"(cds-tree-node-selected)": "onSelected($event)",
		"(cds-tree-node-toggled)": "onToggled($event)",
		"(focusin)": "onFocus($event)",
		"(focusout)": "nodeBlur.emit({ node: currentNode, event: $event })"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [IconDirective, TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TreeNodeComponent implements OnInit, OnDestroy {
	static treeNodeCount = 0;

	@Input() id = `tree-node-${TreeNodeComponent.treeNodeCount++}`;
	@Input() active = false;
	@Input() disabled = false;
	/**
	 * Only applies to nodes with children: `false` makes a click toggle instead of select.
	 */
	@Input() selectable = true;
	@Input() expanded = false;
	/**
	 * Node label. A `TemplateRef` is not supported by the web component and renders nothing.
	 */
	@Input() label: string | TemplateRef<any>;
	@Input() labelContext: any;
	@Input() selected = false;
	@Input() value: any;
	@Input() icon: string | TemplateRef<any>;
	@Input() iconContext: any;
	@Input() children: Node[] = [];
	@Input() depth = 0;
	/**
	 * @deprecated the web component indents nodes itself.
	 */
	@Input() gap = 0;

	@Input() set node(node: Node) {
		this._node = node;
		this.id = node.id ?? this.id;
		this.active = node.active ?? this.active;
		this.disabled = node.disabled ?? this.disabled;
		this.selectable = node.selectable ?? this.selectable;
		this.expanded = node.expanded ?? this.expanded;
		this.label = node.label ?? this.label;
		this.labelContext = node.labelContext ?? this.labelContext;
		this.value = node.value ?? this.value;
		this.icon = node.icon ?? this.icon;
		this.iconContext = node.iconContext ?? this.iconContext;
		this.selected = node.selected ?? this.selected;
		this.children = node.children ?? this.children;
	}
	get node() {
		return this._node;
	}

	@Output() nodeFocus = new EventEmitter<EventOnNode>();
	@Output() nodeBlur = new EventEmitter<EventOnNode>();
	@Output() nodeSelect = new EventEmitter<Node>();
	@Output() nodetoggle = new EventEmitter<EventOnNode>();

	private _node: Node;
	private subscription: Subscription;
	private treeViewService = inject(TreeViewService);
	private changeDetectorRef = inject(ChangeDetectorRef);

	constructor() {
		// The web component only looks for child nodes when it connects (before Angular adds
		// them) or when its child slot changes (which it only renders once it has children).
		const element = inject(ElementRef).nativeElement;
		const update = () => {
			const hasChildren = Array.from(element.children).some((child: Element) => child.tagName === "CDS-TREE-NODE");
			if (hasChildren !== element._hasChildren) {
				element._hasChildren = hasChildren;
				element.toggleAttribute("parent", hasChildren);
				if (hasChildren && !element.hasAttribute("aria-expanded")) {
					element.setAttribute("aria-expanded", String(!!element.isExpanded));
				}
				element.requestUpdate?.();
			}
		};
		const observer = new MutationObserver(update);
		observer.observe(element, { childList: true });
		inject(DestroyRef).onDestroy(() => observer.disconnect());
	}

	get currentNode(): Node {
		return { id: this.id, label: this.label, value: this.value };
	}

	ngOnInit() {
		this.subscription = this.treeViewService.selectionObservable.subscribe((value: Map<string, Node>) => {
			this.selected = this.selectable && value.has(this.id);
			this.active = this.selected;
			this.changeDetectorRef.markForCheck();
		});
	}

	ngOnDestroy() {
		this.subscription?.unsubscribe();
	}

	onSelected(event: Event) {
		// Selection events bubble from child nodes; only handle our own.
		if (event.target !== event.currentTarget || this.disabled) {
			return;
		}
		if (!this.selectable && this.children.length) {
			return;
		}
		const node = this.currentNode;
		this.treeViewService.selectNode(node);
		this.nodeSelect.emit(node);
	}

	onToggled(event: Event) {
		if (event.target !== event.currentTarget) {
			return;
		}
		this.expanded = (event.currentTarget as any).isExpanded;
		this.nodetoggle.emit({ node: { ...this.currentNode, expanded: this.expanded }, event });
	}

	onFocus(event: FocusEvent) {
		if (event.target === event.currentTarget) {
			this.treeViewService.focusNode(this.currentNode);
			this.nodeFocus.emit({ node: this.currentNode, event });
		}
	}

	isTemplate(value: unknown): value is TemplateRef<any> {
		return value instanceof TemplateRef;
	}
}
