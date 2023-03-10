import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TreeViewComponent } from './treeview.component';
import { TreeNodeComponent } from './tree-node.component';
import { IconModule } from 'carbon-components-angular/icon';

@NgModule({
	declarations: [TreeViewComponent, TreeNodeComponent],
	exports: [TreeViewComponent, TreeNodeComponent],
	imports: [CommonModule, IconModule]
})
export class TreeviewModule {}
