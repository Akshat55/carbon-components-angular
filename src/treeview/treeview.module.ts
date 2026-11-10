/**
 * Copyright IBM Corp. 2024
 *
 * TreeviewModule
 *
 * Drop-in replacement for the old carbon-components-angular TreeviewModule.
 * Registers the tree-view web components and exports the thin Angular
 * directive that maps the old @Input/@Output API onto them.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import CDSTreeView from "@carbon/web-components/es/components/tree-view/tree-view.js";
import CDSTreeNode from "@carbon/web-components/es/components/tree-view/tree-node.js";

import { CdsTreeViewDirective } from "./treeview.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-tree-view", CDSTreeView);
safeDefine("cds-tree-node", CDSTreeNode);

@NgModule({
	imports: [
		CommonModule,
		CdsTreeViewDirective
	],
	exports: [
		CdsTreeViewDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TreeviewModule { }
