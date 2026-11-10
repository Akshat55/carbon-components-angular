import { Component, CUSTOM_ELEMENTS_SCHEMA, Type } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { Breadcrumb, BreadcrumbItemComponent } from "carbon-components-angular/breadcrumb";
import { CodeSnippet } from "carbon-components-angular/code-snippet";
import { ContentSwitcher, ContentSwitcherOption } from "carbon-components-angular/content-switcher";
import { Pagination, PaginationModel, PaginationNav } from "carbon-components-angular/pagination";
import { ProgressIndicator } from "carbon-components-angular/progress-indicator";
import { TreeNodeComponent, TreeViewComponent } from "carbon-components-angular/treeview";
import { ContainedList, ContainedListItem } from "carbon-components-angular/contained-list";
import { FileUploader } from "carbon-components-angular/file-uploader";
import { InlineLoading } from "carbon-components-angular/inline-loading";
import { CdsLink, Link, LinkIconDirective } from "carbon-components-angular/link";
import { Loading } from "carbon-components-angular/loading";
import { ProgressBar } from "carbon-components-angular/progress-bar";
import { SkeletonIcon, SkeletonPlaceholder, SkeletonText } from "carbon-components-angular/skeleton";
import { ListColumn, ListHeader, ListRow, StructuredList } from "carbon-components-angular/structured-list";
import {
	Tag,
	TagFilter,
	TagIconDirective,
	TagOperationalComponent,
	TagSelectableComponent
} from "carbon-components-angular/tag";
import {
	ClickableTile,
	ExpandableTile,
	ExpandableTileAboveFoldDirective,
	SelectionTile,
	Tile,
	TileGroup
} from "carbon-components-angular/tiles";
import { TimePicker } from "carbon-components-angular/timepicker";
import { TimePickerSelect } from "carbon-components-angular/timepicker-select";

/**
 * Smoke tests for every web component wrapper: the real web component renders,
 * inputs reach its properties and projected content lands in the right slot.
 * Behaviour-heavy components (forms, overlays, services) have their own specs.
 */
interface SmokeCase {
	name: string;
	imports: Type<any>[];
	template: string;
	/** The web component tag that must be upgraded. */
	tag: string;
	/** Expected web component property values. */
	props?: Record<string, any>;
	/** Properties set on the host test component (for template bindings). */
	hostProps?: Record<string, any>;
	/** Extra checks against the upgraded element. */
	check?: (element: any, host: HTMLElement) => void;
}

const cases: SmokeCase[] = [
	{
		name: "Tag",
		imports: [Tag, TagIconDirective],
		template: `<cds-tag type="red" size="sm"><svg cdsTagIcon></svg>Label</cds-tag>`,
		tag: "cds-tag",
		props: { type: "red", size: "sm" },
		check: element => {
			expect(element.textContent).toContain("Label");
			expect(element.querySelector("svg").getAttribute("slot")).toBe("icon");
		}
	},
	{
		name: "TagFilter",
		imports: [TagFilter],
		template: `<cds-tag-filter type="blue" title="Filter">Label</cds-tag-filter>`,
		tag: "cds-tag",
		props: { filter: true, type: "blue", title: "Filter" }
	},
	{
		name: "TagSelectable",
		imports: [TagSelectableComponent],
		template: `<cds-tag-selectable [selected]="true">Label</cds-tag-selectable>`,
		tag: "cds-selectable-tag",
		props: { selected: true }
	},
	{
		name: "TagOperational",
		imports: [TagOperationalComponent],
		template: `<cds-tag-operational type="green">Label</cds-tag-operational>`,
		tag: "cds-operational-tag",
		props: { type: "green" }
	},
	{
		name: "CdsLink",
		imports: [CdsLink, LinkIconDirective],
		template: `<cds-link href="/docs" [inline]="true">Docs<svg cdsLinkIcon></svg></cds-link>`,
		tag: "cds-link",
		props: { href: "/docs", inline: true },
		check: element => expect(element.querySelector("svg").getAttribute("slot")).toBe("icon")
	},
	{
		name: "Link (native)",
		imports: [Link],
		template: `<a cdsLink href="/docs">Docs</a>`,
		tag: "",
		check: (_, host) => expect(host.querySelector("a.cds--link")).toBeTruthy()
	},
	{
		name: "Loading",
		imports: [Loading],
		template: `<cds-loading size="sm" [isActive]="false" title="Busy" />`,
		tag: "cds-loading",
		props: { small: true, active: false, description: "Busy" }
	},
	{
		name: "InlineLoading",
		imports: [InlineLoading],
		template: `<cds-inline-loading state="finished" loadingText="Loading" successText="Done" />`,
		tag: "cds-inline-loading",
		props: { status: "finished" },
		check: element => expect(element.textContent.trim()).toBe("Done")
	},
	{
		name: "ProgressBar",
		imports: [ProgressBar],
		template: `<cds-progress-bar label="Upload" [value]="40" size="small" />`,
		tag: "cds-progress-bar",
		props: { label: "Upload", value: 40, size: "small" }
	},
	{
		name: "Breadcrumb (projected items)",
		imports: [Breadcrumb, BreadcrumbItemComponent],
		template: `<cds-breadcrumb [noTrailingSlash]="true"><cds-breadcrumb-item href="/a">A</cds-breadcrumb-item></cds-breadcrumb>`,
		tag: "cds-breadcrumb",
		props: { noTrailingSlash: true },
		check: element => expect(element.querySelector("cds-breadcrumb-item cds-breadcrumb-link").href).toBe("/a")
	},
	{
		name: "Breadcrumb (items with overflow)",
		imports: [Breadcrumb],
		template: `<cds-breadcrumb [threshold]="4" [items]="[{ content: '1', href: '/1' }, { content: '2' }, { content: '3' }, { content: '4' }, { content: '5', current: true }]" />`,
		tag: "cds-breadcrumb",
		check: element => {
			expect(element.querySelectorAll(":scope > cds-breadcrumb-item").length).toBe(4);
			expect(element.querySelectorAll("cds-overflow-menu-item").length).toBe(2);
		}
	},
	{
		name: "SkeletonText",
		imports: [SkeletonText, SkeletonIcon, SkeletonPlaceholder],
		template: `<cds-skeleton-text [lines]="3" /><cds-skeleton-icon /><cds-skeleton-placeholder />`,
		tag: "cds-skeleton-text",
		props: { paragraph: true, lineCount: 3 },
		check: (_, host) => {
			expect(host.querySelector("cds-skeleton-icon") instanceof customElements.get("cds-skeleton-icon")).toBe(true);
			expect(host.querySelector("cds-skeleton-placeholder") instanceof customElements.get("cds-skeleton-placeholder")).toBe(true);
		}
	},
	{
		name: "ContainedList",
		imports: [ContainedList, ContainedListItem],
		template: `<cds-contained-list label="List" [isInset]="true"><cds-contained-list-item icon="add" [clickable]="true">Item</cds-contained-list-item></cds-contained-list>`,
		tag: "cds-contained-list",
		props: { label: "List", isInset: true },
		check: element => {
			const item = element.querySelector("cds-contained-list-item");
			expect(item.clickable).toBe(true);
			expect(item.querySelector("svg").getAttribute("slot")).toBe("icon");
		}
	},
	{
		name: "StructuredList",
		imports: [StructuredList, ListHeader, ListRow, ListColumn],
		template: `
			<cds-structured-list [selection]="true" [condensed]="true">
				<cds-list-header><cds-list-column>Head</cds-list-column></cds-list-header>
				<cds-list-row value="a"><cds-list-column>A</cds-list-column></cds-list-row>
			</cds-structured-list>`,
		tag: "cds-structured-list",
		check: element => {
			expect(element.condensed).toBe(true);
			expect(element.selectionName).toContain("structured-list-");
			expect(element.querySelector("cds-structured-list-head cds-structured-list-header-cell").textContent).toContain("Head");
			const cell = element.querySelector("cds-structured-list-body cds-structured-list-row cds-structured-list-cell");
			expect(cell.textContent).toContain("A");
		}
	},
	{
		name: "Tiles",
		imports: [Tile, ClickableTile, ExpandableTile, ExpandableTileAboveFoldDirective],
		template: `
			<cds-tile theme="light">Tile</cds-tile>
			<cds-clickable-tile href="/go">Go</cds-clickable-tile>
			<cds-expandable-tile [expanded]="true"><div cdsAboveFold>Above</div><div>Below</div></cds-expandable-tile>`,
		tag: "cds-tile",
		props: { colorScheme: "light" },
		check: (_, host) => {
			expect((host.querySelector("cds-clickable-tile") as any).href).toBe("/go");
			const expandable: any = host.querySelector("cds-expandable-tile");
			expect(expandable.expanded).toBe(true);
			expect(expandable.querySelector("[cdsAboveFold]").getAttribute("slot")).toBe("above-the-fold-content");
		}
	},
	{
		name: "TileGroup (single select)",
		imports: [TileGroup, SelectionTile],
		template: `<cds-tile-group legend="Pick"><cds-selection-tile value="a" [selected]="true">A</cds-selection-tile></cds-tile-group>`,
		tag: "cds-tile-group",
		check: element => expect(element.querySelector("cds-radio-tile").selected).toBe(true)
	},
	{
		name: "CodeSnippet",
		imports: [CodeSnippet],
		template: `<cds-code-snippet display="multi">const a = 1;</cds-code-snippet>`,
		tag: "cds-code-snippet",
		props: { type: "multi" },
		check: element => expect(element.textContent).toContain("const a = 1;")
	},
	{
		name: "FileUploader",
		imports: [FileUploader],
		template: `<cds-file-uploader title="Files" [files]="files" />`,
		tag: "cds-file-uploader",
		props: { labelTitle: "Files" },
		hostProps: { files: new Set([{ file: new File(["a"], "a.txt"), state: "complete", uploaded: true }]) },
		check: element => {
			expect(element.querySelector("cds-file-uploader-button")).toBeTruthy();
			const item = element.querySelector("cds-file-uploader-item");
			expect(item.state).toBe("complete");
			expect(item.textContent).toContain("a.txt");
		}
	},
	{
		name: "TimePicker with TimePickerSelect",
		imports: [TimePicker, TimePickerSelect],
		template: `<cds-timepicker label="Time"><cds-timepicker-select><option value="AM">AM</option><option value="PM">PM</option></cds-timepicker-select></cds-timepicker>`,
		tag: "cds-time-picker",
		check: element => {
			const items = element.querySelectorAll("cds-time-picker-select cds-select-item");
			expect(Array.from<any>(items).map(item => item.value)).toEqual(["AM", "PM"]);
		}
	},
	{
		name: "Pagination",
		imports: [Pagination],
		template: `<cds-pagination [model]="model" [itemsPerPageOptions]="[5, 10]" />`,
		hostProps: { model: Object.assign(new PaginationModel(), { currentPage: 2, pageLength: 5, totalDataLength: 42 }) },
		tag: "cds-pagination",
		props: { page: 2, pageSize: 5, totalItems: 42 },
		check: element => expect(Array.from<any>(element.querySelectorAll("cds-select-item")).map(item => item.value)).toEqual(["5", "10"])
	},
	{
		name: "PaginationNav",
		imports: [PaginationNav],
		template: `<cds-pagination-nav [model]="model" [numOfItemsToShow]="5" />`,
		hostProps: { model: Object.assign(new PaginationModel(), { currentPage: 3, totalDataLength: 10 }) },
		tag: "cds-pagination-nav",
		props: { page: 2, totalItems: 10, itemsShown: 5 }
	},
	{
		name: "ProgressIndicator",
		imports: [ProgressIndicator],
		template: `<cds-progress-indicator [current]="1" [steps]="steps" orientation="vertical" />`,
		hostProps: { steps: [{ label: "One", complete: true }, { label: "Two" }, { label: "Three", invalid: true }] },
		tag: "cds-progress-indicator",
		props: { vertical: true },
		check: element => expect(Array.from<any>(element.querySelectorAll("cds-progress-step")).map(step => [step.state, step.invalid]))
			.toEqual([["complete", false], ["current", false], ["incomplete", true]])
	},
	{
		name: "ContentSwitcher",
		imports: [ContentSwitcher, ContentSwitcherOption],
		template: `
			<cds-content-switcher [selectedIndex]="1" size="sm">
				<cds-content-switcher-item name="a">A</cds-content-switcher-item>
				<cds-content-switcher-item name="b">B</cds-content-switcher-item>
			</cds-content-switcher>`,
		tag: "cds-content-switcher",
		props: { size: "sm", selectedIndex: 1 },
		check: element => {
			const [a, b] = element.querySelectorAll("cds-content-switcher-item");
			expect(a.value).toBe("a");
			expect(b.selected).toBe(true);
		}
	},
	{
		name: "TreeView",
		imports: [TreeViewComponent, TreeNodeComponent],
		template: `<cds-tree-view label="Files" [tree]="tree" />`,
		hostProps: { tree: [{ id: "docs", label: "Docs", expanded: true, children: [{ id: "readme", label: "README" }] }] },
		tag: "cds-tree-view",
		props: { label: "Files" },
		check: element => {
			const parent = element.querySelector("cds-tree-node");
			expect(parent.label).toBe("Docs");
			expect(parent.isExpanded).toBe(true);
			expect(parent.querySelector("cds-tree-node").label).toBe("README");
		}
	}
];

describe("Web component wrappers", () => {
	cases.forEach(({ name, imports, template, tag, props, hostProps, check }) => {
		it(`${name} should render the web component and pass inputs through`, async () => {
			@Component({ template, imports, schemas: [CUSTOM_ELEMENTS_SCHEMA] })
			class Host {}

			const fixture = TestBed.createComponent(Host);
			Object.assign(fixture.componentInstance, hostProps);
			fixture.detectChanges();
			const host = fixture.nativeElement as HTMLElement;
			const element: any = tag ? host.querySelector(tag) : null;

			if (tag) {
				expect(element instanceof (customElements.get(tag) as any)).withContext(`${tag} upgraded`).toBe(true);
				await element.updateComplete;
			}
			Object.entries(props ?? {}).forEach(([key, value]) => {
				expect(element[key]).withContext(`${tag}.${key}`).toEqual(value);
			});
			check?.(element, host);
		});
	});
});
