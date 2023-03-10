import {
	Component,
	Input,
	Output,
	TemplateRef,
	EventEmitter
} from '@angular/core';

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
			role="tree">
			<ng-content></ng-content>
		</div>
	`
})

export class TreeViewComponent {
	static treeViewCount = 0;

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


	@Output() select = new EventEmitter();
}
