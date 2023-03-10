import {
	Component,
	ContentChildren,
	Input,
	Output,
	QueryList,
	TemplateRef,
	EventEmitter,
	HostListener,
	AfterContentInit,
	AfterContentChecked,
	AfterViewInit
} from '@angular/core';

@Component({
	selector: 'cds-tree-node',
	template: `
		<div
			[id]="id"
			class="cds--tree-node"
			[ngClass]="{
				'cds--tree-node--active': active,
				'cds--tree-node--disabled': disabled,
				'cds--tree-node--selected': isSelected,
				'cds--tree-leaf-node': !children.length,
				'cds--tree-parent-node': children.length,
				'cds--tree-node--with-icon': withIcon
			}"
			[attr.aria-expanded]="expanded || null"
			[attr.aria-current]="active || null"
			[attr.aria-selected]="disabled ? null : selected"
			[attr.aria-disabled]="disabled"
			role="treeitem"
			[attr.tab-index]="selected ? 0 : -1">
			<div
				*ngIf="!children.length"
				class="cds--tree-node__label"
				[style.padding-left.rem]="offset"
				[style.margin-left.rem]="-offset">
				<!-- Icon -->
				{{label}} {{depth}}
			</div>
			<div
				*ngIf="children.length"
				class="cds--tree-node__label"
				[style.padding-left.rem]="offset"
				[style.margin-left.rem]="-offset"
				role="group">
				<span
					class="cds--tree-parent-node__toggle"
					[attr.disabled]="disabled || null"
					(click)="toggleClick($event)">
					<svg
						class="cds--tree-parent-node__toggle-icon"
						[ngClass]="{'cds--tree-parent-node__toggle-icon--expanded' : expanded}"
						ibmIcon="caret--down"
						size="16">
					</svg>
				</span>
				<span class="cds--tree-node__label__details">
					<!-- Icon -->
					{{label}} {{depth}}
				</span>
			</div>
			<div
				*ngIf="expanded"
				role="group"
				class="cds--tree-node__children">
				<ng-content select="cds-tree-node"></ng-content>
			</div>
		</div>
	`
})
export class TreeNodeComponent implements AfterContentInit, AfterContentChecked, AfterViewInit {

	static treeNodeCount = 0;
	@Input() id = `tree-node-${TreeNodeComponent.treeNodeCount++}`;
	@Input() active = false;
	@Input() disabled = false;
	@Input() expanded = false;
	@Input() label: string | TemplateRef<any>;
	@Input() value;
	@Input() selected: string[];
	@Input() withIcon = false;

	isSelected: boolean = false;
	offset;

	@ContentChildren(TreeNodeComponent, {descendants: true}) children: QueryList<TreeNodeComponent>;

	@Output() nodeFocus = new EventEmitter();
	@Output() nodeSelect = new EventEmitter();
	@Output() nodetoggle = new EventEmitter();

	/**
	 * Calculated by default
	 */
	@Input() depth = 0;

	toggleClick(event) {
		this.expanded = !this.expanded;
	}

	ngAfterContentInit() {

	}

	ngAfterViewInit() {
		if(this.children.length){
			console.log(this.children);
			}
	}

	ngAfterContentChecked() {

		this.offset = this.calculateOffset();
		this.children.forEach((node) => {
			node.depth = this.depth + 1;
		});

	}

	@HostListener("click") click() {
		this.active = true;
		this.isSelected = true;
	}

	calculateOffset() {
		if (this.children.length) {
			return this.depth + 1;
		}

		if (this.withIcon) {
			return this.depth + 2;
		}

		return this.depth + 2.5;
	}
}
