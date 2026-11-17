import { Component, Type } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { AccordionItemSkeleton, AccordionSkeleton } from "carbon-components-angular/accordion";
import { AILabelActionButton } from "carbon-components-angular/ai-label";
import { BreadcrumbLink, BreadcrumbOverflowMenu, BreadcrumbSkeleton } from "carbon-components-angular/breadcrumb";
import { ButtonSkeleton } from "carbon-components-angular/button";
import { CheckboxSkeleton } from "carbon-components-angular/checkbox";
import { CodeSnippetSkeleton } from "carbon-components-angular/code-snippet";
import { ContainedListDescription } from "carbon-components-angular/contained-list";
import { ContextMenuItemComponent, MenuItemRadioGroup, MenuItemSelectable } from "carbon-components-angular/context-menu";
import { DatePickerInputSkeleton } from "carbon-components-angular/datepicker-input";
import { DropdownSkeleton } from "carbon-components-angular/dropdown";
import { FileUploaderButton, FileUploaderDropContainer, FileUploaderSkeleton } from "carbon-components-angular/file-uploader";
import { CdsColumn, CdsGrid } from "carbon-components-angular/grid";
import { CdsIcon, IconService } from "carbon-components-angular/icon";
import { PasswordInputSkeleton, TextareaSkeleton, TextInputSkeleton } from "carbon-components-angular/input";
import { CdsLayer } from "carbon-components-angular/layer";
import { CdsListItem, CdsOrderedList, CdsUnorderedList } from "carbon-components-angular/list";
import {
	ModalBody,
	ModalBodyContent,
	ModalCloseButton,
	ModalFooterButton,
	ModalHeading,
	ModalLabel
} from "carbon-components-angular/modal";
import { ActionableNotificationButton } from "carbon-components-angular/notification";
import { ProgressIndicatorSkeleton, ProgressStepSkeleton } from "carbon-components-angular/progress-indicator";
import { SearchSkeleton } from "carbon-components-angular/search";
import { SelectItem, SelectItemGroup, SelectSkeleton } from "carbon-components-angular/select";
import { SliderSkeleton } from "carbon-components-angular/slider";
import { TagSkeleton } from "carbon-components-angular/tag";
import { ToggleSkeleton } from "carbon-components-angular/toggle";
import { TooltipContent } from "carbon-components-angular/tooltip";
import { HeaderName, HeaderSideNavItems, SideNavDivider, SwitcherDivider } from "carbon-components-angular/ui-shell";
import Add16 from "@carbon/icons/es/add/16";
import Add20 from "@carbon/icons/es/add/20";

import { settle } from "./test-helpers/web-components";

/**
 * Every web component tag consumers write has an Angular class, so templates compile without
 * `CUSTOM_ELEMENTS_SCHEMA` and inputs reach the web component. These hosts deliberately have no
 * schema: a tag without a class would not get its instance.
 */
interface PartCase {
	type: Type<any>;
	tag: string;
	template: string;
	/** Expected web component property values. */
	props?: Record<string, any>;
	check?: (element: any) => void;
}

const cases: PartCase[] = [
	{ type: AccordionSkeleton, tag: "cds-accordion-skeleton", template: `<cds-accordion-skeleton [count]="3" [open]="true" />`, props: { count: 3, open: true } },
	{ type: AccordionItemSkeleton, tag: "cds-accordion-item-skeleton", template: `<cds-accordion-item-skeleton />` },
	{ type: BreadcrumbLink, tag: "cds-breadcrumb-link", template: `<cds-breadcrumb-link href="/home" [isCurrentPage]="true">Home</cds-breadcrumb-link>`, props: { href: "/home", isCurrentPage: true } },
	{ type: BreadcrumbOverflowMenu, tag: "cds-breadcrumb-overflow-menu", template: `<cds-breadcrumb-overflow-menu align="bottom" />`, props: { align: "bottom" } },
	{ type: BreadcrumbSkeleton, tag: "cds-breadcrumb-skeleton", template: `<cds-breadcrumb-skeleton [items]="4" />`, props: { items: 4 } },
	{ type: ButtonSkeleton, tag: "cds-button-skeleton", template: `<cds-button-skeleton size="sm" />`, props: { size: "sm" } },
	{ type: CheckboxSkeleton, tag: "cds-checkbox-skeleton", template: `<cds-checkbox-skeleton />` },
	{ type: CodeSnippetSkeleton, tag: "cds-code-snippet-skeleton", template: `<cds-code-snippet-skeleton type="multi" />`, props: { type: "multi" } },
	{ type: DatePickerInputSkeleton, tag: "cds-date-picker-input-skeleton", template: `<cds-date-picker-input-skeleton [range]="true" />`, props: { range: true } },
	{ type: DropdownSkeleton, tag: "cds-dropdown-skeleton", template: `<cds-dropdown-skeleton [hideLabel]="true" size="sm" />`, props: { hideLabel: true, size: "sm" } },
	{ type: FileUploaderSkeleton, tag: "cds-file-uploader-skeleton", template: `<cds-file-uploader-skeleton />` },
	{ type: ProgressIndicatorSkeleton, tag: "cds-progress-indicator-skeleton", template: `<cds-progress-indicator-skeleton [vertical]="true"><cds-progress-step-skeleton /></cds-progress-indicator-skeleton>`, props: { vertical: true } },
	{ type: ProgressStepSkeleton, tag: "cds-progress-step-skeleton", template: `<cds-progress-step-skeleton [vertical]="true" />`, props: { vertical: true } },
	{ type: SearchSkeleton, tag: "cds-search-skeleton", template: `<cds-search-skeleton size="lg" />`, props: { size: "lg" } },
	{ type: SelectSkeleton, tag: "cds-select-skeleton", template: `<cds-select-skeleton [hideLabel]="true" />`, props: { hideLabel: true } },
	{ type: SelectItemGroup, tag: "cds-select-item-group", template: `<cds-select-item-group label="Group" [disabled]="true"><cds-select-item value="a" label="A" /></cds-select-item-group>`, props: { label: "Group", disabled: true } },
	{ type: SelectItem, tag: "cds-select-item", template: `<cds-select-item value="a" label="A" [disabled]="true" />`, props: { value: "a", label: "A", disabled: true } },
	{ type: SliderSkeleton, tag: "cds-slider-skeleton", template: `<cds-slider-skeleton [twoHandles]="true" />`, props: { twoHandles: true } },
	{ type: TagSkeleton, tag: "cds-tag-skeleton", template: `<cds-tag-skeleton size="sm" />`, props: { size: "sm" } },
	{ type: TextInputSkeleton, tag: "cds-text-input-skeleton", template: `<cds-text-input-skeleton [hideLabel]="true" />`, props: { hideLabel: true } },
	{ type: TextareaSkeleton, tag: "cds-textarea-skeleton", template: `<cds-textarea-skeleton />` },
	{ type: PasswordInputSkeleton, tag: "cds-password-input-skeleton", template: `<cds-password-input-skeleton />` },
	{ type: ToggleSkeleton, tag: "cds-toggle-skeleton", template: `<cds-toggle-skeleton />` },
	{ type: TooltipContent, tag: "cds-tooltip-content", template: `<cds-tooltip-content>Tip</cds-tooltip-content>`, check: element => expect(element.textContent).toContain("Tip") },
	{ type: ContainedListDescription, tag: "cds-contained-list-description", template: `<cds-contained-list-description>More</cds-contained-list-description>` },
	{ type: ModalHeading, tag: "cds-modal-heading", template: `<cds-modal-heading>Title</cds-modal-heading>` },
	{ type: ModalLabel, tag: "cds-modal-label", template: `<cds-modal-label>Label</cds-modal-label>` },
	{ type: ModalBody, tag: "cds-modal-body", template: `<cds-modal-body>Body</cds-modal-body>` },
	{ type: ModalBodyContent, tag: "cds-modal-body-content", template: `<cds-modal-body-content>Text</cds-modal-body-content>` },
	{ type: ModalCloseButton, tag: "cds-modal-close-button", template: `<cds-modal-close-button closeButtonLabel="Shut" />`, props: { closeButtonLabel: "Shut" } },
	{ type: ModalFooterButton, tag: "cds-modal-footer-button", template: `<cds-modal-footer-button kind="secondary">Cancel</cds-modal-footer-button>`, props: { kind: "secondary" } },
	{ type: ActionableNotificationButton, tag: "cds-actionable-notification-button", template: `<cds-actionable-notification-button [disabled]="true">Act</cds-actionable-notification-button>`, props: { disabled: true } },
	{ type: HeaderName, tag: "cds-header-name", template: `<cds-header-name href="/" prefix="IBM">Platform</cds-header-name>`, props: { href: "/", prefix: "IBM" } },
	{ type: HeaderSideNavItems, tag: "cds-header-side-nav-items", template: `<cds-header-side-nav-items [hasDivider]="true" />`, props: { hasDivider: true } },
	{ type: SideNavDivider, tag: "cds-side-nav-divider", template: `<cds-side-nav-divider />` },
	{ type: SwitcherDivider, tag: "cds-switcher-divider", template: `<cds-switcher-divider />` },
	{ type: AILabelActionButton, tag: "cds-ai-label-action-button", template: `<cds-ai-label-action-button kind="ghost">View</cds-ai-label-action-button>`, props: { kind: "ghost" } },
	{ type: CdsGrid, tag: "cds-grid", template: `<cds-grid [narrow]="true"><cds-column [sm]="2" lg="25%">A</cds-column></cds-grid>`, props: { narrow: true } },
	{ type: CdsColumn, tag: "cds-column", template: `<cds-grid><cds-column [sm]="2" lg="25%">A</cds-column></cds-grid>`, props: { sm: 2, lg: "25%" } },
	{ type: CdsUnorderedList, tag: "cds-unordered-list", template: `<cds-unordered-list [isExpressive]="true"><cds-list-item>One</cds-list-item></cds-unordered-list>`, props: { isExpressive: true } },
	{ type: CdsOrderedList, tag: "cds-ordered-list", template: `<cds-ordered-list [native]="true"><cds-list-item>One</cds-list-item></cds-ordered-list>`, props: { native: true } },
	{ type: CdsListItem, tag: "cds-list-item", template: `<cds-unordered-list><cds-list-item>One</cds-list-item></cds-unordered-list>` },
	{ type: CdsLayer, tag: "cds-layer", template: `<cds-layer [withBackground]="true">Layer</cds-layer>`, props: { level: 0, withBackground: true } },
	{ type: FileUploaderButton, tag: "cds-file-uploader-button", template: `<cds-file-uploader-button accept=".png" [multiple]="true">Add</cds-file-uploader-button>`, props: { accept: ".png", multiple: true } },
	{ type: FileUploaderDropContainer, tag: "cds-file-uploader-drop-container", template: `<cds-file-uploader-drop-container accept=".png">Drop</cds-file-uploader-drop-container>`, props: { accept: ".png" } }
];

describe("Web component part wrappers", () => {
	cases.forEach(({ type, tag, template, props, check }) => {
		it(`${type.name} should wrap <${tag}> and pass inputs through`, async () => {
			@Component({ template, imports: [type, ...cases.map(c => c.type).filter(t => t !== type)] })
			class Host {}

			const fixture = TestBed.createComponent(Host);
			await settle(fixture);
			const debug = fixture.debugElement.query(By.directive(type));
			expect(debug).withContext(`${type.name} instance`).not.toBeNull();
			const element = debug.nativeElement;
			expect(element.localName).toBe(tag);
			expect(element instanceof (customElements.get(tag) as any)).withContext(`${tag} upgraded`).toBe(true);
			Object.entries(props ?? {}).forEach(([key, value]) => {
				expect(element[key]).withContext(`${tag}.${key}`).toEqual(value);
			});
			check?.(element);
		});
	});

	it("should keep web component defaults for unset inputs", async () => {
		@Component({ template: `<cds-dropdown-skeleton /><cds-breadcrumb-skeleton />`, imports: [DropdownSkeleton, BreadcrumbSkeleton] })
		class Host {}
		const fixture = TestBed.createComponent(Host);
		await settle(fixture);
		const fresh = (tag: string) => new (customElements.get(tag) as any)();
		expect(fixture.nativeElement.querySelector("cds-dropdown-skeleton").size).toBe(fresh("cds-dropdown-skeleton").size);
		expect(fixture.nativeElement.querySelector("cds-breadcrumb-skeleton").items).toBe(fresh("cds-breadcrumb-skeleton").items);
	});

	it("CdsLayer should step nested layers up", async () => {
		@Component({ template: `<cds-layer><cds-layer id="inner">Inner</cds-layer></cds-layer>`, imports: [CdsLayer] })
		class Host {}
		const fixture = TestBed.createComponent(Host);
		await settle(fixture);
		await settle(fixture);
		expect(fixture.nativeElement.querySelector("#inner").level).toBe(1);
	});

	it("CdsIcon should render an icon object or a registered icon name", async () => {
		TestBed.inject(IconService).registerAll([Add16, Add20]);
		@Component({
			template: `<cds-icon id="object" [icon]="add" /><cds-icon id="name" icon="add" [size]="20" ariaLabel="Add" />`,
			imports: [CdsIcon]
		})
		class Host {
			add = Add16;
		}
		const fixture = TestBed.createComponent(Host);
		await settle(fixture);
		const byObject = fixture.nativeElement.querySelector("#object");
		const byName = fixture.nativeElement.querySelector("#name");
		expect(byObject.icon).toBe(Add16);
		expect(byObject.shadowRoot.querySelector("svg")).not.toBeNull();
		expect(byName.icon).toEqual(jasmine.objectContaining({ name: "add", size: 20 }));
		expect(byName.size).toBe(20);
		expect(byName.shadowRoot.querySelector("svg")).not.toBeNull();
	});

	it("FileUploaderButton should emit the picked files", async () => {
		@Component({ template: `<cds-file-uploader-button (filesAdded)="files = $event">Add</cds-file-uploader-button>`, imports: [FileUploaderButton] })
		class Host {
			files: File[];
		}
		const fixture = TestBed.createComponent(Host);
		await settle(fixture);
		const file = new File(["x"], "a.txt");
		fixture.nativeElement.querySelector("cds-file-uploader-button").dispatchEvent(
			new CustomEvent("cds-file-uploader-button-changed", { detail: { addedFiles: [file] }, bubbles: true })
		);
		expect(fixture.componentInstance.files).toEqual([file]);
	});

	it("MenuItemSelectable should two-way bind `selected`", async () => {
		@Component({
			template: `<cds-menu><cds-menu-item-selectable label="Bold" [(selected)]="bold" /></cds-menu>`,
			imports: [MenuItemSelectable]
		})
		class Host {
			bold = false;
		}
		const fixture = TestBed.createComponent(Host);
		await settle(fixture);
		const item = fixture.nativeElement.querySelector("cds-menu-item-selectable");
		expect(item.selected).toBe(false);
		item.shadowRoot.querySelector("cds-menu-item").click();
		await settle(fixture);
		expect(fixture.componentInstance.bold).toBe(true);

		fixture.componentInstance.bold = false;
		await settle(fixture);
		expect(item.selected).toBe(false);
	});

	it("MenuItemRadioGroup should two-way bind the checked item's label", async () => {
		@Component({
			template: `
				<cds-menu>
					<cds-menu-item-radio-group label="Size" [(selected)]="size">
						<cds-menu-item label="Small" />
						<cds-menu-item label="Large" />
					</cds-menu-item-radio-group>
				</cds-menu>`,
			imports: [MenuItemRadioGroup, ContextMenuItemComponent]
		})
		class Host {
			size = "Small";
		}
		const fixture = TestBed.createComponent(Host);
		await settle(fixture);
		const items = fixture.nativeElement.querySelectorAll("cds-menu-item");
		expect(items[0].getAttribute("aria-checked")).toBe("true");
		expect(items[1].getAttribute("aria-checked")).toBe("false");

		items[1].click();
		await settle(fixture);
		expect(fixture.componentInstance.size).toBe("Large");
		expect(items[1].getAttribute("aria-checked")).toBe("true");
	});
});
