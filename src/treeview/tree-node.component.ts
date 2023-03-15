import {
	Component,
	Input,
	Output,
	EventEmitter,
	AfterContentChecked,
	ElementRef,
	Inject,
} from '@angular/core';

@Component({
	selector: 'cds-tree-node',
	template: `
		<div
			[id]="node.id"
			class="cds--tree-node"
			[ngClass]="{
				'cds--tree-node--active': node.active,
				'cds--tree-node--disabled': node.disabled,
				'cds--tree-node--selected': isSelected,
				'cds--tree-leaf-node': !node.children,
				'cds--tree-parent-node': node.children && node.children.length,
				'cds--tree-node--with-icon': node.withIcon
			}"
			[attr.aria-expanded]="node.isExpanded || null"
			[attr.aria-current]="node.active || null"
			[attr.aria-selected]="node.disabled ? null : node.selected"
			[attr.aria-disabled]="node.disabled"
			role="treeitem"
			[attr.tabindex]="isSelected ? 0 : -1"
			(focus)="emitFocusEvent($event)"
			(blur)="emitBlurEvent($event)"
			(keydown)="navigateTree($event)">
			<div
				*ngIf="!node.children"
				class="cds--tree-node__label"
				[style.padding-left.rem]="offset"
				[style.margin-left.rem]="-offset"
				(click)="nodeClick($event)">
				<!-- Icon -->
				{{node.label}}
			</div>
			<div
				*ngIf="node.children && node.children.length"
				class="cds--tree-node__label"
				[style.padding-left.rem]="offset"
				[style.margin-left.rem]="-offset"
				role="group">
				<span
					class="cds--tree-parent-node__toggle"
					[attr.disabled]="disabled || null"
					(click)="toggleExpanded($event)">
					<svg
						class="cds--tree-parent-node__toggle-icon"
						[ngClass]="{'cds--tree-parent-node__toggle-icon--expanded' : node.isExpanded}"
						ibmIcon="caret--down"
						size="16">
					</svg>
				</span>
				<span class="cds--tree-node__label__details">
					<!-- Icon -->
					{{node.label}}
				</span>
			</div>
			<div
				*ngIf="node.isExpanded"
				role="group"
				class="cds--tree-node__children">
				<cds-tree-node
					#node
					*ngFor="let childNode of node.children"
					[node]="childNode"
					[depth]="depth + 1">
				</cds-tree-node>
			</div>
		</div>
	`
})
export class TreeNodeComponent implements AfterContentChecked {
	static treeNodeCount = 0;
	// @Input() id = `tree-node-${TreeNodeComponent.treeNodeCount++}`;
	// @Input() active = false;
	// @Input() disabled = false;
	// @Input() expanded = false;
	// @Input() label: string | TemplateRef<any>;
	// @Input() value;
	// @Input() selected: string[];
	// @Input() withIcon = false;


	/**
	 * TEMP
	 */
	@Input() node: any = {};
	constructor(public element: ElementRef) { }


	isSelected: boolean = false;
	offset;
	// @ContentChildren(TreeNodeComponent, {descendants: true}) children: QueryList<TreeNodeComponent>;

	@Output() nodeFocus = new EventEmitter();
	@Output() nodeBlur = new EventEmitter();
	@Output() nodeSelect = new EventEmitter();
	@Output() nodetoggle = new EventEmitter();

	/**
	 * Calculated by default
	 */
	@Input() depth = 0;

	ngAfterContentChecked() {
		if (this.node.children) {
			this.node?.children.forEach((node) => {
				node.depth = this.depth + 1;
				// We disable all child nodes if current node is disabled
				if (this.node?.disabled) {
					node.disabled = this.node?.disabled;
				}
			});
		}
		this.offset = this.calculateOffset();
	}

	nodeClick(event) {
		if (!this.node.disabled) {
			this.node.active = true;
			this.isSelected = true;
			event.target.parentElement.focus();
		}
	}


	calculateOffset() {
		if (this.node.children && this.node.children.length) {
			return this.depth + 1;
		}

		if (this.node.withIcon) {
			return this.depth + 2;
		}

		return this.depth + 2.5;
	}

	emitFocusEvent(event) {
		this.nodeFocus.emit({ node: this.node, event });
	}

	emitBlurEvent(event) {
		this.nodeBlur.emit({ node: this.node, event });
	}

	toggleExpanded(event) {
		if (!this.node.disabled) {
			this.nodetoggle.emit({ node: this.node, event });
			this.node.isExpanded = !this.node.isExpanded;
		}
	}


	/**
	 * Manages the keyboard accessibility for children expansion & selection
	 */
	navigateTree(event: KeyboardEvent) {
		if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "Enter") {
			event.stopPropagation();
		}
		// Unexpand
		if (event.key === "ArrowLeft") {
			if (this.node.isExpanded && this.node.children) {
				this.toggleExpanded(event);
			}
		}

		if (event.key === "ArrowRight") {
			if (!this.node.isExpanded && this.node.children) {
				this.toggleExpanded(event);
			}
		}

		if (event.key === "Enter") {
			event.preventDefault();
			this.nodeClick(event);
		}
	}
}
