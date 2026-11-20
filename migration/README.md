# Web component ↔ Angular comparison

A one-time script that compares each carbon-components-angular (CCA) component on the current branch with its Carbon web component. The output seeds the per-tag migration files: the `@carbon/angular` generator (`carbon/packages/angular/tasks/generate-wrappers`) will read those to add backwards compatibility, `[(x)]` binding and `TemplateRef` → slot wiring on top of what it already generates from the web components. The script also lists which v6 inputs and outputs need to be deprecated.

The reasoning behind the mappings, and the decisions that don't fit in `mapping.json`, are in [`DECISIONS.md`](DECISIONS.md).

## Run

```bash
npm run docs:json                    # refresh dist/docs/documentation.json (compodoc)
node migration/build-comparison.mjs  # writes wc-angular-comparison.json and unmatched.json
node migration/seed-generator-files.mjs  # one-time: seeds carbon/packages/angular/migration/components/<tag>.json
```

The seed script never overwrites an existing file, because the files are curated by hand in the carbon repo. Pass `--force` to overwrite them anyway, or `--out <dir>` to write elsewhere.

| Flag | Default | Meaning |
| --- | --- | --- |
| `--wc <dir>` | `../carbon/packages/web-components` | Web components package. Its `custom-elements.json` must exist (`yarn workspace @carbon/web-components cem`). |
| `--out <file>` | `migration/wc-angular-comparison.json` | Output path. `unmatched.json` is written next to it. |

## Sources

1. **Custom Elements Manifest (CEM)**: `custom-elements.json` from `@carbon/web-components`. It lists props, attributes, events, slots and CSS parts. It's the web component equivalent of compodoc's JSON, and it's what the `@carbon/angular` generator reads.
2. **Web component source**: the CEM declares slots for only 63 of 305 tags, so the script also reads `<slot>` from each class, its superclasses and its mixins. Slots found this way have `"source": "source"`.
3. **compodoc** (`dist/docs/documentation.json`): the CCA API on the current branch. Inherited inputs are already merged in. Type aliases and enums are expanded so their values can be compared.
4. **`mapping.json`**: hints maintained by hand. Every hint is checked against sources 1 and 2, so a wrong one simply doesn't match.

## `mapping.json`

| Section | Purpose |
| --- | --- |
| `classToTag` | CCA class → tag(s), for classes whose selector isn't the tag name. Use `null` for no counterpart. A target can be conditional: `{ "tag": "cds-multi-select", "when": { "input": "type", "equals": "multi" }, "set": { "filterable": true } }`. `when` can also be `{ "parentInput": "TileGroup.multiple", "equals": false }` or `{ "hostElement": "ol" }`. |
| `unmappedReasons` | Why a class has no counterpart. Copied into `unmatched.json`. |
| `slotDirectives` | Content-marker directives (`[cdsToggletipButton]`) → parent tag and slot. Each is kept as a tiny directive that sets `slot` on its host, so v6 markup keeps working; `""` = default slot (no-op directive). |
| `renameCandidates` | Known renames, tried **only when there is no exact match** (same name, same attribute or case-insensitive). E.g. `label` → `labelText` / slot `label-text`. Same-name entries are pointless and don't belong here. |
| `variantInputs` | Inputs that switch to another tag instead of setting a prop: `skeleton` → `{tag}-skeleton`, `fluid` → `cds-fluid-{stem}`. |
| `structuralInputs` | Model-driven inputs (`Class.input`) and how each is carried over. `renderChildren`: the wrapper renders web component children from the array (`steps` → `<cds-progress-step>`) and still projects `<ng-content>`, so both styles work. It supports `itemMap` (child prop → expression), `text`, `child`, `variants` keyed by an item field, `recursive`, `wrapper`, `slots`, `events` and Breadcrumb's `overflow`. `adapter`: model fields map onto host props (`PaginationModel` → `page` / `pageSize` / `totalItems`). `rewrite`: no backwards compatibility. Every prop, event and slot named here is checked against the CEM; mismatches are printed as warnings. |
| `rewrites` | Components whose API is replaced rather than carried over (Table, Dropdown, ComboBox, Modal). They get no backwards-compatible aliases. |
| `angularOnlyFallback` | Classes that keep an Angular-only implementation when their `when` doesn't hold (flexbox grid: `useCssGrid=false`). |
| `router` | Router support for every tag with an `href` (from the CEM): one shared `[routerLink]` directive sets the host `href` and intercepts plain left clicks. Replaces the per-component `route` / `routeExtras` / `useRouter` inputs. |
| `generatorSkippedTags` | Copy of the generator's `SKIPPED_TAGS` (flatpickr date pickers, ADR 0021). |
| `angularOnlyInputs` / `structuralTypePatterns` | Inputs to keep on the wrapper, and types treated as model-driven. |

## `wc-angular-comparison.json`

One record per (CCA class, target tag):

```jsonc
{
  "ccaClass": "Dropdown", "ccaSelectors": ["cds-dropdown", "ibm-dropdown"],
  "wcTag": "cds-multi-select",
  "when": { "input": "type", "equals": "multi" },   // null = default target
  "set": null,                                       // props the wrapper sets on this tag
  "matchedVia": "mapping.json | selector",
  "rewrite": "reason" | null,
  "generatorSkipped": false,
  "selectorChange": "[cdsButton], [ibmButton] -> cds-button",
  "selectorMigration": "element | rename | none",       // element: directive on a native element -> the schematic swaps the element
  "routerLink": { "activeProp": "isActive" } | null,     // tag has href -> shared router directive applies
  "angularOnlyFallback": "…" | null,
  "readiness": { "level": "auto | overrides | manual | rewrite", "reasons": [] },

  "inputs": [{
    "name": "expanded",
    "cca":  { "type", "default", "inheritedFrom", "deprecated" },
    "wc":   { "prop": "open", "attribute", "type", "default", "reflects", "via": "exact | alias | attribute" },
    "slot": { "name": "title", "via" } | null,
    "typeCheck": { "status": "match | compatible | values-differ | mismatch | unresolved", "ccaOnlyValues"?, "wcOnlyValues"? },
    "selects"?: [{ "tag": "cds-fluid-dropdown", "when": { "input": "fluid", "equals": true } }],
    "childTags"?: ["cds-dropdown-item"],
    "status": "…", "action": "…",
    "suggestions"?: ["unclaimed web component props with a similar name (cca-only rows; never applied)"]
  }],
  "wcOnlyProps": [ … ],
  "outputs": [{ "name", "wc": { "event", "via", "generatorOutput" }, "twoWay"?: { "input", "wcProp", "strategy", "proposed" }, "status", "action", "suggestions"? }],
  "wcOnlyEvents": [ … ],
  "methods": [{ "name", "args", "returns", "status": "match | cca-only", "action" }],
  "forms": { "ccaControlValueAccessor", "wcFormAssociated", "referenceGeneratorCva", "status", "valueProperty", "valueEvents" },
  "content": { "ngContent": [{ "ngContent", "slot", "status" }], "wcSlots": [{ "name", "source", "mapped" }] },
  "referenceGenerator": { "inputs", "outputs", "cva", … }
}
```

### Input `status`

| Status | Meaning | Generator action |
| --- | --- | --- |
| `match` | Same name, compatible type | Pass through |
| `rename` | Web component uses another name (rename candidate or attribute match) | Deprecated alias forwarding to `[wcProp]`; `ng update` renames it |
| `prop+slot` | String goes to a prop, `TemplateRef` goes to a slot | `[prop]="isTemplate(x) ? '' : x"` plus `cdsSlot` |
| `slot` | Content-only input | `<ng-container cdsSlot="…" [cdsSlotTemplate]="x">` |
| `selects-tag` | The input picks another tag (`skeleton`, `fluid`, `type="multi"`); see `selects` | Deprecate; the schematic swaps the element where the value is static |
| `type-mismatch` | Kinds differ (e.g. `boolean` vs `'top' \| 'bottom'`) | Write a transform, or deprecate |
| `render-children` | Model-driven; the wrapper renders the children (see `strategy`, `childTags`) | Template with `@for` before `<ng-content>` |
| `adapter` | Model object whose fields map onto host props (see `strategy`) | Host bindings from the model fields, plus event handlers |
| `structural` | Model-driven with no strategy, or a rewrite (`childTags` lists the replacements) | Handwritten, or part of a rewrite |
| `angular-only` | Angular integration (`id`, `name`, `required`, …) | Keep on the wrapper |
| `cca-only` | No web component counterpart | Deprecate, or request it upstream |

### Output `status`

`match` · `rename` (host listener → CCA name) · `two-way` (see `twoWay.proposed`) · `two-way-unresolved` · `native` (`click`/`change` bubble from the host; drop the `@Output` to avoid double calls) · `cca-only`.

### Readiness

- `auto`: the generator can emit it as is.
- `overrides`: generated, plus per-component overrides (renames, slots, two-way, deprecations).
- `manual`: the generator skips the tag, a CVA the generator can't provide, unresolved two-way binding, model-driven inputs with no strategy, or several targets with no `when` to choose between them.
- `rewrite`: listed in `mapping.json → rewrites`. No backwards compatibility; the rows are the deprecation list.

## `unmatched.json`

Both sides with no counterpart:

- `wc.skeleton` / `wc.fluid` / `wc.subpart` / `wc.new`: web component tags no CCA class maps to. Each has `replaces`, the CCA inputs that point at it (`Dropdown.fluid` → `cds-fluid-dropdown`, `DropdownList.items` → `cds-dropdown-item`). An empty `replaces` on a skeleton, fluid or subpart tag means no legacy API leads there. `subpart` = in a web component folder CCA already maps to; `new` = a component CCA never had (Card, Tearsheet, Page header, …). These need no migration file: the generator wraps them straight from the CEM.
- `cca`: CCA classes with no tag, each with its reason.
