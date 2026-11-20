# Migration decisions

This is the record of decisions for moving carbon-components-angular (CCA) onto the Carbon web components. Mapping-level decisions are also in [`mapping.json`](mapping.json), and the comparison output reflects them. This file records the reasoning behind them, plus the decisions that don't fit in `mapping.json`.

**Status:**
- **Decided:** agreed.
- **Proposed:** applied in `mapping.json`, but not yet explicitly signed off.
- **Open:** needs a decision.

All entries are dated 2026-11-18.

## 1. Direction

| # | Decision | Status |
| --- | --- | --- |
| 1.1 | **The web components are the source of truth.** The `@carbon/angular` generator (`carbon/packages/angular/tasks/generate-wrappers` → `.entries/`) keeps generating every input and output from the Custom Elements Manifest (CEM). The web components own the view and the logic. | Decided |
| 1.2 | **The migration files add only what the CEM can't provide:** backwards compatibility for v6 APIs, `[(x)]` two-way binding, `TemplateRef` → slot wiring, forms (CVA) overrides, and `ng update` rules. A tag with no file is generated exactly as it is today. Not every component maps one-to-one, and that's acceptable. | Decided |
| 1.3 | **`build-comparison.mjs` is a one-time script.** It seeds the per-tag files, which are then curated by hand. After that, the curated files are the source of truth and the script isn't re-run or maintained. | Decided |
| 1.4 | **Compare against the current branch only.** The legacy API is whatever is on the branch being migrated. The v7 branch is not used as evidence. | Decided |
| 1.5 | **The selector prefix is `cds-*`.** The generator can emit `cds-ng-*` instead, so this can be changed by regenerating. | Decided |
| 1.6 | **Deprecate, then remove.** In v7, renamed v6 inputs and outputs are kept as `@deprecated` aliases that forward to the web component name, so nothing breaks. `ng update` also rewrites them. The aliases are removed in v8. | Decided |
| 1.7 | **The generator validates the migration files** against the CEM on every build. A missing prop or event fails the build. A name listed in `unchanged` that no longer matches produces a warning. This replaces re-running the comparison. | Decided |
| 1.8 | **The migration files live next to the generator,** in `carbon/packages/angular/migration/components/<tag>.json`, so the build doesn't depend on this repo. `seed-generator-files.mjs` seeded them once from the comparison; from then on they are curated there. The generator (`tasks/generate-wrappers/migration.js`) validates each file against the CEM on every run (1.7). | Decided |

## 2. Per-tag migration file schema

| # | Decision | Status |
| --- | --- | --- |
| 2.1 | **One file per web component tag**, not per CCA class, because the generator works per tag. `legacy` lists the CCA classes that a tag replaces, each with an optional `when`. One class can span several tags (Dropdown → `cds-dropdown` / `cds-multi-select`), and several classes can share one tag (`TextInput`, `TextInputLabelComponent` → `cds-text-input`). | Decided |
| 2.2 | **Sections:** `legacy`, `unchanged`, `inputs`, `outputs`, `methods`, `twoWay`, `forms`, `content` and `mismatches`. | Decided |
| 2.3 | **`unchanged` lists v6 members that match the web component exactly.** The rule is that `inputs` ∪ `unchanged.inputs` covers every v6 input, so nothing is silently dropped. | Decided |
| 2.4 | **Every discrepancy goes in `mismatches`,** keyed by an id and referenced from the member. Each entry has a `kind` and a `resolution`. `kind` is one of `type`, `values`, `default`, `behavior`, `structural` or `missing-in-wc`. `resolution` is one of `wrapper`, `deprecate`, `upstream`, `manual` or `none`. | Decided |
| 2.5 | **Input kinds:** `alias`, `transform`, `templateSlot`, `slot`, `removed`, `keep` (Angular-only, declared on the wrapper) and `native` (a plain HTML attribute such as `id`, not declared). **Output kinds:** `alias`, `derived`, `native` and `removed`. **Model inputs:** `renderChildren` and `adapter` (section 6). | Decided |
| 2.6 | **Public methods are compared too** (e.g. `toggleExpanded()`). | Decided |
| 2.7 | **No `curated` or `provenance` fields.** The files are curated by definition (1.3). Evidence worth keeping goes in `mismatches[].notes`. | Decided |
| 2.8 | **Value-level renames use `valueMap`** on the member, e.g. `{ "danger--ghost": "danger-ghost" }`. The schematic rewrites static values too. | Decided |

## 3. Selectors and directives

| # | Decision | Status |
| --- | --- | --- |
| 3.1 | **Attribute directives that have a web component equivalent become that element** (23 classes, `selectorMigration: "element"`). Examples: `<button cdsButton="primary">` → `<cds-button kind="primary">`, `[cdsText]` → `<cds-text-input>`, `[cdsLink]` → `<cds-link>`, `option` → `<cds-select-item>`. A wrapper can't sit on the same native element, so only the schematic can migrate these. | Decided |
| 3.2 | **The self-named directive inputs carry values,** and they map to props: `cdsButton` / `ibmButton` → `kind`, `cdsLayer` / `ibmLayer` → `level`, `cdsStack` / `ibmStack` → `orientation`, `cdsIcon` / `ibmIcon` → `icon`. | Decided |
| 3.3 | **Inputs merge two v6 elements into one.** `<cds-text-label>` wrapping `<input cdsText>` becomes a single `<cds-text-input label="…">`, and likewise for textarea and password. This is the hardest schematic rewrite. | Decided |
| 3.4 | **`[cdsOverflowMenu]` → `<cds-overflow-menu>`.** A custom trigger element can only become the `icon` slot, so the schematic leaves a TODO. | Proposed |
| 3.5 | **`ibm-*` selectors and renamed tags** (`cds-number` → `cds-number-input`, `cds-sidenav` → `cds-side-nav`, and so on) are handled only by the schematic. The wrapper's host element has to be the web component tag. | Decided |
| 3.6 | **Removed in v7 (internal):** `[cdsDialog]` / Dialog, `[cdsScrollableList]`, `[cdsTabHeader]`, `[cdsExpandedRowHover]`, `[cdsTableHeadCellLabel]`, `AbstractDropdownView` and `TabHeaderBase`. The web components do this work internally. | Proposed |

## 4. Content projection and slots

| # | Decision | Status |
| --- | --- | --- |
| 4.1 | **`string \| TemplateRef` inputs map to slots.** A string is set on the prop, and a `TemplateRef` is rendered into the slot using the `cdsSlot` pattern. This requires the generator's runtime to ship a slot-template directive; today its template is only `<ng-content />`. | Decided |
| 4.2 | **All 21 content-marker directives are kept as tiny directives that set `slot`** on their host (`host: { slot: "title" }`), so v6 markup works without a schematic. Examples: `[cdsToggletipButton]` → `trigger`, `[cdsToastTitle]` → `title`, `[cdsAboveFold]` → `above-the-fold-content`, `[cdsActionableButton]` → `action`. `[cdsBelowFold]` and `[cdsToggletipLabel]` target the default slot and become no-ops. All 21 slots are confirmed in the web component source. | Decided |
| 4.3 | **Slots are read from the web component source as well as the CEM.** The CEM declares slots for only 63 of 305 tags. | Decided |

## 5. Two-way binding and forms

| # | Decision | Status |
| --- | --- | --- |
| 5.1 | **Two-way pairs are named after the web component prop:** `[(open)]` / `openChange`. The v6 name (`[(expanded)]` / `expandedChange`) is kept as a deprecated alias (1.6). | Decided |
| 5.2 | **Wiring follows the v7 host pattern:** `"[prop]": "input ?? element.prop"`, so the input wins while it's set and the web component keeps its own state when it isn't. The change is driven by the web component's event (preferred) or by `observeAttributes` on a reflected attribute. | Decided |
| 5.3 | **Native DOM events (`click`, `change`, …) get no `@Output`.** They bubble from the host, and re-emitting them causes double calls (ADR 0015 §4). | Decided |
| 5.4 | **`forms: null` uses the generator's CVA detection** (form-associated, plus `checked` / `value`). The remaining gaps need a `forms` override when the files are curated: no CVA from the generator for Radio, StructuredList, TileGroup and FileUploader, and no two-way source for Slider, TooltipDefinition and ContextMenuItem / ContextMenuGroup. | Decided |

## 6. Model-driven inputs

**`renderChildren`** means the wrapper renders web component children from the array. Because they're light DOM children, they land in the host's slots. `<ng-content>` is still projected after them, so both the v6 data style and the web component markup style work. Behaviour (selection, expansion, current state) stays in the web component; the wrapper only turns data into DOM.

**`adapter`** means model fields map onto host props.

| # | Component | Decision | Status |
| --- | --- | --- | --- |
| 6.1 | ProgressIndicator `steps` | Render `<cds-progress-step>`, with `state` computed from `complete` / `invalid` / `current`. `stepSelected` and `step.onClick` are fed by `cds-progress-step-click`. `current` → `currentIndex`, `orientation` → `vertical`, `spacing` → `spaceEqually`. Content projection is also supported. | Decided |
| 6.2 | Breadcrumb `items` | Render `<cds-breadcrumb-item><cds-breadcrumb-link>`. `item.template` renders in place of the link. | Decided |
| 6.3 | Breadcrumb `threshold` | **Kept, not deprecated.** Auto-collapse is a feature the web component doesn't have. It reproduces CCA's split: the first item, then `<cds-overflow-menu breadcrumb>` holding items `1 … length-3`, then the last two. (`cds-breadcrumb-overflow-menu` is deprecated upstream.) | Decided |
| 6.4 | TreeView `tree` / TreeNode `children` | Recursive `<cds-tree-node>` (`expanded` → `isExpanded`, `icon` → the `icon` slot) plus content projection. `select` / `toggle` map the event back to its `Node`. TreeNode `node` is an adapter onto the node's props. | Decided |
| 6.5 | UI shell items | `HeaderNavigation` / `SideNav` `navigationItems` choose the element by `item.type`: `<cds-header-menu>` / `<cds-side-nav-menu>` with item children, or `<cds-header-nav-item>` / `<cds-side-nav-link>`. `HeaderMenu.headerItems` and `SideNavMenu.menuItems` render plain items. | Proposed |
| 6.6 | Pagination / PaginationNav `model` | **Kept as an adapter:** `page` ← `currentPage`, `pageSize` ← `pageLength`, `totalItems` ← `totalDataLength`. It keeps v6 semantics: the consumer updates `model.currentPage` in `(selectPage)`, and a page-size change sets `model.pageLength` and then emits `selectPage(1)`. A pagination v2 will be introduced alongside table v2. | Decided |
| 6.7 | Pagination `itemsPerPageOptions` | Render `<cds-select-item>` children, which is how `cds-pagination` reads its page sizes. | Proposed |
| 6.8 | Notifications `notificationObj` | **An adapter, not a rewrite.** `type` → `kind`, `message` → `subtitle`, `title` / `caption` / `lowContrast` map directly, `showClose: false` → `hideCloseButton`, `duration` → `timeout`, `variant: 'inline'` → `inline`. Actionable `actions` render `<cds-actionable-notification-button slot="action">`. `NotificationService` keeps creating notifications programmatically. | Proposed |
| 6.9 | Column `columnNumbers` / `offsets` | An adapter onto `cds-column` `sm` / `md` / `lg` / `xlg` / `max`, using `{ span, offset }` per breakpoint. | Proposed |

## 7. Inputs that select a different tag

| # | Decision | Status |
| --- | --- | --- |
| 7.1 | **`skeleton` → `<cds-*-skeleton>` and `fluid` → `<cds-fluid-*>`.** These are separate tags in the web components. The base tags' `isFluid` prop is internal: the fluid tags set it themselves. | Decided |
| 7.2 | **Multi-select:** Dropdown `type="multi"` → `cds-multi-select`. ComboBox `type="multi"` → `cds-multi-select` with `filterable` set. | Decided |
| 7.3 | **SelectionTile** → `cds-radio-tile` when its parent `TileGroup` has `[multiple]="false"`, and `cds-selectable-tile` otherwise. **`[cdsList]`** on `<ol>` → `cds-ordered-list`, and otherwise `cds-unordered-list`. | Proposed |
| 7.4 | **`columnHang` → `<cds-column-hang>`.** | Proposed |

## 8. Rewrites

These get no backwards-compatible aliases. Every legacy member is deprecated, and the schematic leaves a TODO. The comparison rows are still kept as the deprecation list.

| # | Component | Reason | Status |
| --- | --- | --- | --- |
| 8.1 | Table (12 classes) | `TableModel` is replaced by `cds-table` child elements. | Decided |
| 8.2 | Dropdown, DropdownList, ComboBox | `ListItem[]` is replaced by `cds-dropdown` / `cds-combo-box` / `cds-multi-select` with item children. | Decided |
| 8.3 | Modal (7 classes) | Replaced by `cds-modal` and its part elements. | Decided |
| 8.4 | DatePicker, DatePickerInput | `cds-date-picker` is skipped by the generator (flatpickr, ADR 0021). The rewrite targets `cds-preview-date-picker`. | Decided |

## 9. Grid

| # | Decision | Status |
| --- | --- | --- |
| 9.1 | **The web components are CSS Grid only** (`cds-grid`, `cds-column`, `cds-column-hang`). The flexbox grid exists only as `@carbon/styles` classes. | Decided |
| 9.2 | **The flexbox grid stays Angular-only.** `[cdsGrid]` (with the default `useCssGrid=false`), `[cdsRow]` and `[cdsCol]` inside a flexbox grid stay as class-only directives. | Decided |
| 9.3 | **CSS Grid migrates to the web components.** `[cdsGrid][useCssGrid]` → `<cds-grid>`, and `[cdsCol]` inside it → `<cds-column>`. | Decided |
| 9.4 | **The schematic rewrites only a static `useCssGrid`.** A bound value gets a TODO. Columns whose nearest grid is a flexbox grid are skipped. Once CSS Grid has its own element, `useCssGrid` on the directive can be deprecated. | Proposed |

## 10. Router

| # | Decision | Status |
| --- | --- | --- |
| 10.1 | **Every tag with an `href` prop gets Angular router support** (27 tags, computed from the CEM), through one shared `[routerLink]` directive rather than per-component route inputs. | Decided |
| 10.2 | **How the directive behaves:** it sets the host's `href` to the serialized router URL, so the web component renders a real `<a>` and middle-click / new tab work. On a plain left click with no `target`, it calls `preventDefault()` and `router.navigateByUrl()`. `routerLinkActive` maps to the tag's active prop (`active` / `isActive` / `isCurrentPage`). This replaces the v6 `route` / `routeExtras` / `useRouter` inputs. Angular's own `RouterLink` isn't enough on its own: on a non-anchor host it doesn't set `href` or call `preventDefault()`, so the shadow `<a>` would also do a full page load. | Proposed |

## 11. Individual components

| # | Component | Decision | Status |
| --- | --- | --- | --- |
| 11.1 | Accordion | `align` → `alignment` (deprecated alias). `skeleton` → `<cds-accordion-skeleton>`. | Decided |
| 11.2 | AccordionItem | `expanded` → `open`, with `[(open)]`. `title` is a prop or slot. `context` is kept. `id` is native. `skeleton` → `<cds-accordion-item-skeleton>`. | Decided |
| 11.3 | AccordionItem `selected` | Fed by `cds-accordion-item-toggled`, which fires on user gestures only, matching v6. This deliberately differs from v7's `observeAttributes(['open'])`, which also emits on programmatic changes. The public `toggleExpanded()` becomes a derived method that sets `open` and emits `selected`. | Proposed |
| 11.4 | Button `ibmButton` / `ButtonType` | Needs a `valueMap`: CCA's `danger--primary` / `danger--tertiary` / `danger--ghost` → `danger-primary` / `danger-tertiary` / `danger-ghost`. | Proposed |
| 11.5 | Button `iconOnly` | No counterpart. The web component uses the `icon` slot plus `tooltipText`. | Proposed |
| 11.6 | Content-switcher `[cdsContentOption]` | → `cds-content-switcher-item`. `active` and its outputs have no counterpart: `selected` reflects instead. | Proposed |

## 12. Upstream issues found

| # | Issue | Where |
| --- | --- | --- |
| 12.1 | `ACCORDION_ALIGNMENT.END = 'END'` (uppercase). It's harmless, because only `'start'` is ever checked, but it leaks into the CEM type. It should be `'end'`. | `@carbon/web-components` accordion |
| 12.2 | The CEM types `cds-checkbox.warnText` as `boolean`; it's a `string`. Already patched by the generator's `MANIFEST_TYPE_OVERRIDES`. | CEM |
| 12.3 | `cds-tree-node` has no label slot, so a `Node.label` `TemplateRef` has no target. | `@carbon/web-components` tree-view |
| 12.4 | `cds-tree-view` has no multi-select (CCA's `isMultiSelect`). | `@carbon/web-components` tree-view |
| 12.5 | `cds-breadcrumb-overflow-menu` is deprecated in favour of `cds-overflow-menu[breadcrumb]`. | Informational |
| 12.6 | CCA's `TagType` has `high-contrast` and `outline`, which `cds-tag` doesn't support. | CCA vs. web components |

## 13. Open

| # | Question | Notes |
| --- | --- | --- |
| 13.1 | `BaseModal`: what replaces it for service-created modals? | It's public API today: consumers extend it to build modals through `ModalService`. Part of the modal rewrite (8.3). |
| 13.2 | Keep `[cdsTheme]` and `[cdsAspectRatio]` as Angular-only directives? | Both are CSS utilities with no web component equivalent. Keeping them is cheap and avoids breakage. |
| 13.3 | `cdsIcon`: icon name string vs. `CarbonIcon` object | Either keep a name → icon lookup in Angular, which ships every icon, or make it a breaking change where consumers import the icon. The lean is the breaking change, with a schematic TODO. |
