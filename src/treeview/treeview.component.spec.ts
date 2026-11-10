import { TestBed, ComponentFixture } from "@angular/core/testing";
import { Component, DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";

import { settle, shadow } from "../test-helpers/web-components";
import { TreeViewComponent } from "./treeview.component";
import { TreeNodeComponent } from "./tree-node.component";
import { TreeViewService } from "./treeview.service";
import { Node } from "./tree-node.types";

@Component({
	template: `
		<cds-tree-view
			label="Tree view"
			style="width: 18rem; display: block;"
			[tree]="tree"
			(select)="onSelect($event)" />
	`,
	imports: [TreeViewComponent]
})
class TreeviewTestComponent {
	tree: Node[] = [
		{
			id: "1",
			value: "Artificial intelligence",
			label: "Artificial intelligence",
			selectable: true
		},
		{
			id: "2",
			value: "Blockchain",
			label: "Blockchain",
			selectable: true
		},
		{
			id: "bus-auto",
			value: "Business automation",
			label: "Business automation",
			expanded: true,
			disabled: true,
			children: [
				{
					id: "bus-auto-process",
					value: "Business process automation",
					label: "Business process automation"
				},
				{
					id: "bus-auto-process-map",
					value: "Business process mapping",
					label: "Business process mapping"
				}
			]
		}
	];
	onSelect(node) {}
}

describe("Treeview", () => {
	let component: TreeviewTestComponent;
	let fixture: ComponentFixture<TreeviewTestComponent>;
	let nodes: DebugElement[];
	let tree: DebugElement;
	const node = (index: number) => nodes[index].nativeElement;
	const clickNode = async (index: number) => {
		shadow<HTMLElement>(node(index), ".cds--tree-node__label").click();
		await settle(fixture);
	};

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [TreeviewTestComponent]
		});

		fixture = TestBed.createComponent(TreeviewTestComponent);
		component = fixture.componentInstance;
		await settle(fixture);
		tree = fixture.debugElement.query(By.directive(TreeViewComponent));
		nodes = fixture.debugElement.queryAll(By.directive(TreeNodeComponent));
	});

	it("should create a tree view", () => {
		expect(tree.componentInstance instanceof TreeViewComponent).toBe(true);
		expect(tree.nativeElement instanceof customElements.get("cds-tree-view")).toBe(true);
		expect(nodes.length).toBe(5);
		expect(node(0) instanceof customElements.get("cds-tree-node")).toBe(true);
	});

	it("should indicate if the node has children", () => {
		expect(nodes[2].componentInstance.expanded).toBeTruthy();
		expect(shadow(node(2), ".cds--tree-node__children")).toBeTruthy();
		expect(shadow(node(2), ".cds--tree-parent-node__toggle")).toBeTruthy();
		expect(shadow(node(0), ".cds--tree-node__children")).toBeFalsy();
	});

	it("should disable the children nodes when parent is disabled", () => {
		expect(nodes[2].componentInstance.disabled).toBeTruthy();
		expect(nodes[3].componentInstance.disabled).toBeTruthy();
		expect(node(3).disabled).toBe(true);
		expect(node(3).getAttribute("aria-disabled")).toBe("true");
	});

	it("should set the depth of a node based on the height of the tree", () => {
		expect(nodes[2].componentInstance.depth).toEqual(0);
		expect(nodes[3].componentInstance.depth).toEqual(1);
	});

	it("should toggle the child nodes from the parent's toggle", async () => {
		expect(node(2).getAttribute("aria-expanded")).toBe("true");
		component.tree = [component.tree[0], component.tree[1], { ...component.tree[2], disabled: false }];
		await settle(fixture);
		nodes = fixture.debugElement.queryAll(By.directive(TreeNodeComponent));

		shadow<HTMLElement>(node(2), ".cds--tree-parent-node__toggle").click();
		await settle(fixture);

		expect(node(2).isExpanded).toBe(false);
		expect(nodes[2].componentInstance.expanded).toBe(false);
		expect(shadow(node(2), ".cds--tree-node__children").classList).toContain("cds--tree-node__hidden");
	});

	it("should expand parent node to show child nodes", () => {
		expect(node(2).isExpanded).toBe(true);
		expect(shadow(node(2), ".cds--tree-node__children").classList).not.toContain("cds--tree-node__hidden");
	});

	it("should emit 'select' event from the tree wrapper when a node is clicked", async () => {
		spyOn(component, "onSelect");
		await clickNode(0);
		expect(component.onSelect).toHaveBeenCalledWith(jasmine.objectContaining({ id: "1", value: "Artificial intelligence" }));
	});

	it("should deselect the previously selected node", async () => {
		await clickNode(0);

		expect(nodes[0].componentInstance.selected).toBe(true);
		expect(node(0).selected).toBe(true);

		await clickNode(1);

		expect(nodes[0].componentInstance.selected).toBe(false);
		expect(node(0).selected).toBe(false);
		expect(node(1).selected).toBe(true);
	});

	it("should update aria-selected when the selection changes", async () => {
		await clickNode(0);
		expect(node(0).getAttribute("aria-selected")).toBe("true");

		await clickNode(1);
		expect(node(0).getAttribute("aria-selected")).toBe("false");
		expect(node(1).getAttribute("aria-selected")).toBe("true");
	});

	it("should select the node the service selects", async () => {
		tree.injector.get(TreeViewService).selectNode(component.tree[1] as any);
		await settle(fixture);

		expect(nodes[1].componentInstance.selected).toBe(true);
		expect(node(1).selected).toBe(true);
		expect(node(1).getAttribute("aria-selected")).toBe("true");
	});
});
