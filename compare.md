# Angular web component migration: `v7` vs `web-components-thin`

Reviewed on November 9, 2026, against these local branch tips:

| Branch | Commit |
| --- | --- |
| `v7` | `2ab24a37ae8f454a1682f40101ab75069a0e3970` |
| `web-components-thin` | `508b86ef78a066c2451138d7f3348ddb144d5ce4` |

## Recommendation

**Use the `v7` approach as the foundation for a migration that must preserve the Angular API.** It is more Angular-friendly for existing consumers and generally feels more like the existing Angular library: component imports, typed inputs and outputs, Angular templates, form value models, and public component methods remain part of the interface.

`web-components-thin` is a better fit when consumers can adopt web component markup and semantics as a new API. Its directives provide useful Angular integration, but the implementation does not preserve enough behavior to qualify as a drop-in replacement. Several differences affect exactly the inputs, outputs, and two-way bindings this migration needs to retain.

There are two important qualifications:

- `v7` is **not fully backward compatible**. Some old inputs are retained but deprecated and effectively unused, some selectors have changed, and multi-select combo boxes require a different component.
- `v7` is **not a completed web component migration**. Its table and tabs retain substantial Angular implementations. Those preserve functionality today but need a separate migration plan if all rendering must eventually move to web components.

The recommended architecture is an Angular compatibility layer over web components, with as little adaptation as necessary to preserve the promised contract. That is closer to `v7` than the current thin branch. The choice is about who owns the public API, not whether `@Component` is inherently better than `@Directive`.

## Scope and evidence

This is a source review of both branch tips, their public exports, representative implementations, migration notes, dependency manifests, and tests. It covers checkbox, accordion, combo box/list selection, table, tabs, modal, legacy button/input support, and shared wrapper utilities. It is not an exhaustive certification of every component or every previous release's API.

No builds, browser tests, performance benchmarks, or package-install experiments were run for this comparison. Existing tests are evidence of intended coverage, not a claim that either branch currently passes them. The branches also use different toolchains, so comparing build results or bundle sizes without normalizing dependencies would be misleading.

Source paths below are relative to the repository and explicitly associated with a branch. To inspect the other branch without checking it out, use:

```powershell
git show web-components-thin:src/checkbox/checkbox.directive.ts
git show v7:src/checkbox/checkbox.component.ts
```

## What the implementations actually do

### `v7`: Angular components on the custom element host

For migrated controls such as checkbox, the Angular component selector is the web component tag itself. `Checkbox` selects `cds-checkbox`, projects content, binds inputs to host properties, and translates custom DOM events into Angular outputs. Importing the component also imports the web component registration module.

Conceptually:

```text
<cds-checkbox>                 One host element
  Angular Checkbox instance  Inputs, outputs, CVA, template adaptation
  Carbon custom element     Shadow DOM and native interaction
```

**This does not introduce an outer Angular element around an inner web component.** A component with the same host tag and `<ng-content />` is already a lightweight wrapper. Template adapters can add slot content or spans, and some composite components retain larger Angular templates, but an extra outer wrapper is not an inherent cost of this approach.

Shared infrastructure in `v7:src/utils/web-components.ts` supplies:

- `WebComponentValueAccessor` and `provideValueAccessor` for Angular forms.
- `TemplateContent` for rendering Angular templates as nodes consumed by web component properties.
- `TemplateSlot` for rendering Angular templates into named slots.
- Helpers for observing children and reflected attributes, finding associated Angular wrappers, and cleaning up floating menu elements.

This centralizes recurring integration work. It also makes that infrastructure an important maintenance and testing responsibility.

### `web-components-thin`: directives on custom elements

The thin branch attaches directives such as `CdsCheckboxDirective` to the custom element. Inputs are commonly copied into attributes in `ngOnChanges`; `@HostListener` translates web component events; individual controls implement their own CVA methods.

There is no component template for the basic directive. For complex content, the branch either expects consumers to write web component children, manually creates DOM nodes, or adds special template handling. Accordion title templates use a dynamically created `SlottedTemplateComponent`; combo box options and model-driven table cells are created through DOM APIs.

That is a valid Angular architecture. A directive can support templates, forms, and a compatible API. However, achieving full compatibility would require adding much of the adaptation that this implementation currently omits.

## Comparison at a glance

| Concern | `v7` | `web-components-thin` |
| --- | --- | --- |
| Public API direction | Preserve an Angular-facing contract while adapting web components | Expose web component structure with selected Angular conveniences |
| Extra outer element for basic migrated controls | No | No |
| Input synchronization | Primarily declarative host property bindings | Primarily imperative attribute/property writes |
| Two-way binding | Explicit input/output pairs in reviewed controls | Some pairs exist; others are missing |
| Forms | Shared CVA base plus component-specific value mapping | CVA implemented separately in individual directives |
| Template inputs | Shared template/slot adapters and Angular template rendering | Selective support; several accepted `TemplateRef` inputs are ignored |
| Selection values | Adapts back to Angular `ListItem` objects or keyed values | Reviewed combo box uses web component value strings |
| Public class imports | Retains names such as `Checkbox` | Exports names such as `CdsCheckboxDirective` instead |
| Consumer markup | More existing composition retained | More explicit web component children, slots, and panel targets |
| Migration coverage | Hybrid; table/tabs remain substantially Angular | Moves table/tabs toward web components, with feature/API reductions |
| Tests inspected | Forms, wrappers, overlays, and individual component suites | Much smaller remaining suite; many component tests removed |
| Main cost | More compatibility code and unfinished migration areas | More application changes and compatibility work pushed to consumers |

## Inputs, outputs, and two-way binding

### Checkbox: both bridge the basics, but the contracts differ

Both branches declare `checked`/`checkedChange` and `indeterminate`/`indeterminateChange`, and both register a value accessor. Therefore, both have the plumbing for `[(checked)]` and `[(ngModel)]`.

`v7` additionally preserves template helper/error/warning text, a decorator template, group-derived state, and the special Angular `click` output behavior. When that output is observed, its handler prevents the native default action so the consumer can control selection. It also retains public methods such as `toggle()`.

The thin checkbox declares `helperText`, `invalidText`, and `warnText` as `string | TemplateRef<any>`, but only handles strings. A consumer can therefore pass a value accepted by the TypeScript API and get no corresponding template rendering. Its `value` input also changes to `string` instead of `v7`'s `CheckboxValue` (`boolean | "on" | "off"`), excluding previously accepted boolean values.

The thin implementation conditionally writes attributes such as `name` and `title`, without removing them when values become empty. It writes helper text only when it is a string. Consequently, clearing or changing an input to an unsupported value can leave a previously written attribute in place. Declarative bindings make the corresponding update path more explicit in `v7`.

Sources: `v7:src/checkbox/checkbox.component.ts`, `v7:src/checkbox/checkbox-group.component.ts`, `web-components-thin:src/checkbox/checkbox.directive.ts`.

### Accordion: a concrete missing two-way-binding output

`v7` declares both `expanded` and `expandedChange`. Its `setExpanded()` updates state and emits both `expandedChange` and the structured `selected` output.

The thin accordion item declares `expanded` and emits `selected` and `beforeToggle`, but **does not declare or emit `expandedChange`**, despite a comment suggesting two-way support. That means this contract is not implemented:

```html
<cds-accordion-item [(expanded)]="expanded" title="Details">
  Content
</cds-accordion-item>
```

For the traditional input/output API used here, `[(expanded)]` needs an `expanded` input and an `expandedChange` output. The presence of `(selected)` is not a substitute. Likewise, CVA support enables Angular forms; it does not automatically create arbitrary `[(property)]` bindings. Angular documents the input/output convention in its [two-way binding guide](https://angular.dev/guide/templates/two-way-binding).

The thin branch does have a useful addition: `beforeToggle` forwards the cancelable web component event. That could be added to the compatibility layer if desired without sacrificing the existing outputs.

Sources: `v7:src/accordion/accordion-item.component.ts`, `web-components-thin:src/accordion/accordion-item.directive.ts`.

### Combo box: the same output name does not mean the same value

In `v7`, `ComboBox` extends `ListSelection`. Web component item indexes are mapped back to the original `ListItem` objects. The combo box's `selected` output emits the selected `ListItem`; the form receives the item or `item[itemValueKey]`. Its clear path deliberately preserves an empty-array form value. Projected dropdown lists and item templates remain meaningful.

In the thin implementation, `selected` emits `{ item, value }`, where `item` comes from the custom event, and the CVA forwards the web component value. Options are created with string values and `textContent`. This changes both event payloads and form value semantics. Keeping the name `(selected)` does not protect existing handlers that expect a `ListItem`.

There is also a reset gap: thin `writeValue()` only updates the element when the value is non-null. A form reset to `null` updates the directive field but does not explicitly clear the element's previous selection. This is a source-level finding requiring a browser regression test.

Sources: `v7:src/combobox/combobox.component.ts`, `v7:src/dropdown/list-selection.class.ts`, `web-components-thin:src/combobox/combobox.directive.ts`.

## Angular forms and change detection

The `v7` base value accessor handles callback registration, disabled state, and `focusout`-based touched notification. Individual controls implement value conversion and call `onChange` for user changes. Its use of `markForCheck()` also acknowledges that form writes and subscriptions can change state outside ordinary input bindings.

The thin checkbox and combo box call `_onTouched()` from their change/selection handlers rather than a blur handler. Focusing and leaving without changing a value will not mark those controls touched through these handlers, while changing a value marks them touched before focus leaves. That matters for validation display and `updateOn: 'blur'`. Angular's [CVA contract](https://angular.dev/api/forms/ControlValueAccessor) distinguishes model writes, change callbacks, touched callbacks, and disabled-state updates.

`v7` is a better starting point here, but its shared `focusout` behavior still needs tests for composite controls: moving between internal focus targets should not necessarily mean the whole control has been left. Neither branch should be declared zoneless-ready or hydration-safe from these implementations alone.

Many `v7` wrappers use `OnPush`; directives in the thin branch have no independent component change-detection strategy. Direct DOM writes can update a custom element immediately, but they do not by themselves prove that all Angular consumer state, templates, and asynchronous callbacks update correctly.

Sources: `v7:src/utils/web-components.ts`, both checkbox implementations, both combo box implementations, `v7:src/test-helpers/change-detection.ts`.

## Templates, imports, and the Angular developer experience

`v7` handles more translation inside the library. Consumers can keep passing `TemplateRef` values, use projected Angular list templates, and import recognizable component types. Its standalone `Checkbox` imports its own registration dependency; `CheckboxModule` imports and exports the same component.

In the thin branch, the checkbox directive file itself does not import the checkbox registration. Registration is performed in `CheckboxModule`. A direct standalone import of the directive therefore needs another registration path; importing just the directive file is insufficient by itself. Public exports also change: the checkbox entry point exports `CdsCheckboxDirective`, not `Checkbox` or `CheckboxState`. Existing imports and type-based queries need attention.

There is a schema distinction too. Angular components identify their own host elements to the compiler. Bare custom elements with directives still need custom-element schema handling in the consumer's template scope. Putting `CUSTOM_ELEMENTS_SCHEMA` on a library NgModule does not export that schema to consuming templates. The thin module's schema declaration is therefore not a complete consumer setup strategy. This follows Angular's [schema API](https://angular.dev/api/core/CUSTOM_ELEMENTS_SCHEMA) and [component metadata rules](https://angular.dev/api/core/Component).

For `v7`, consumers using the imported Angular wrappers generally do not need to add a schema for those wrappers. Consumers writing additional raw web component tags may still need one. A schema permits custom-element syntax; it does not supply missing Angular outputs, value accessors, or template rendering.

Template references also deserve migration tests: an unqualified `#checkbox` on an Angular component refers to its component instance, whereas on an element with only a directive it normally refers to the element unless a directive `exportAs` is used. That can change access to public methods even when the markup looks identical. See Angular's [template variables guide](https://angular.dev/guide/templates/variables).

Sources: both branches' `src/checkbox/index.ts` and `src/checkbox/checkbox.module.ts`; the corresponding checkbox component/directive files.

## Complex components reveal the largest tradeoffs

### Table

`v7` retains the Angular table implementation: a native table, `TableModel` subscriptions, Angular cell templates, selection/expansion integration, and the surrounding component hierarchy. This is strong compatibility evidence, **not evidence that the table has been migrated to Carbon's table web component**.

The thin branch renders a `TableModel` by creating web component head/body/cell elements and stringifying cell data. It takes only the first header row when headers are nested. Its migration guide explicitly excludes template cells, expandable rows, per-column filters, and the existing data-grid keyboard model.

It also rerenders the generated structure only when `ngOnChanges` sees a new `model` input. Unlike `v7`, the reviewed directive has no subscriptions to model change events. Updating `model.data` on the same instance is therefore a compatibility concern, even though `[model]` still exists.

Sources: `v7:src/table/table.component.ts`, `v7:src/table/cell/table-data.component.ts`, `web-components-thin:src/table/table.directive.ts`, `web-components-thin:src/table/MIGRATION.md`.

### Tabs

`v7` retains Angular tab composition, templates, caching options, and header/vertical variants. As with table, this is retained Angular functionality rather than a completed web component wrapper.

The thin migration changes the structure: web component tab headers target separate panel elements by ID. The migration guide removes multiple existing Angular variants. Existing nested tab content therefore needs restructuring; retaining a few similarly named inputs does not make the whole component compatible.

Sources: `v7:src/tabs/tabs.component.ts`, `v7:src/tabs/tab.component.ts`, `web-components-thin:src/tabs/tabs.directive.ts`, `web-components-thin:src/tabs/MIGRATION.md`.

### Modal

`v7` keeps the Angular modal composition and service/base-class ecosystem while translating web component events into outputs such as `overlaySelected` and header `closeSelect`. It explicitly intercepts the web component's close path to preserve Angular-controlled behavior.

The thin branch changes the child markup and removes classes such as `BaseModal` and `AlertModal`. However, it does **retain a rewritten `ModalService`** with `show`, `create`, and `destroy`; it would be inaccurate to say all dynamic modal support is gone. Its `create` method creates Angular components, while `show` builds web component elements directly. Method names alone do not establish compatibility of return handles, inheritance, close behavior, or content handling.

Sources: `v7:src/modal/modal.component.ts`, `v7:src/modal/base-modal.class.ts`, `web-components-thin:src/modal/modal.service.ts`, `web-components-thin:src/modal/MIGRATION.md`.

## Advantages and costs of each approach

### Why choose `v7`

- More application-facing compatibility is implemented inside the library, reducing repeated migration work across applications.
- Shared forms and template adapters make behavior more consistent and fixes reusable.
- Angular retains ownership of Angular templates and model conversion, while migrated web components own their shadow rendering and interaction.
- It preserves legacy paths where replacing them immediately would be disruptive. For example, the native `Button` styling directive remains alongside the `CdsButton` wrapper, and the native `TextInput` directive still exists.
- Its tests cover real integration boundaries: shadow DOM rendering, forms writes and changes, disabled state, event translation, template content, and overlay behavior.

The costs are a larger Angular maintenance surface, explicit coordination between Angular and Lit updates, and more infrastructure for slots, views, observers, and event translation. Retaining old components also postpones some organizational migration benefits. Shared helpers need careful lifecycle tests, particularly where nodes move between Angular-managed content and web component slots or floating containers.

### Why choose `web-components-thin`

- Basic directives are straightforward bridges with little Angular rendering logic.
- Consumers who already know the web component API can work directly with its structure and events.
- Markup-driven composition makes upstream web component capabilities easier to expose without recreating a complete Angular component API.
- It advances migration of components that `v7` still implements in Angular.
- It includes useful targeted adaptations, such as cancelable accordion events and dynamic Angular modal creation; it is not merely raw custom elements with no Angular integration.

The costs are substantial consumer migration and incomplete compatibility in the reviewed implementation. Repeated attribute synchronization and CVA code create opportunities for inconsistent resets, cleanup, and event semantics. Manual DOM rendering also means Angular templates are not automatically instantiated. Adding full compatibility would make the directives less thin, especially for tables, lists, and composite content.

Neither branch has demonstrated a performance or bundle-size advantage in this review. The absence of a component view can save some overhead, but both approaches use the same basic custom-element host pattern, and the total cost depends on imports, generated content, views, subscriptions, and interaction behavior.

## Remaining issues before choosing `v7` for release

The recommendation is architectural, not release approval. Address these points explicitly:

1. **Define the compatibility baseline.** Compare against the actual released version used by applications, including selectors, exported types, methods, defaults, event payloads, and form values. This report compares two branches, not the complete historical API.
2. **Resolve accepted-but-unused inputs.** Checkbox `skeleton` is deprecated in favor of a separate skeleton element. Combo box `type="multi"` is retained as an input but its `multiple` getter returns `false`; consumers are directed to `cds-multi-select`. Deprecated inputs that no longer work are behavioral breaks.
3. **Audit selector aliases.** Reviewed migrated wrappers such as checkbox and accordion use only the `cds-*` element selector. Do not assume all historical `ibm-*` templates continue to work. Attribute aliases in the thin branch are also not equivalent to old element selectors.
4. **Plan the table/tabs migration separately.** Preserve their Angular APIs while changing the renderer, or explicitly retain them as compatibility implementations until parity is possible. Deleting features is not a backward-compatible migration strategy.
5. **Validate packaging and supported Angular versions.** `v7` declares Angular 20/21/22 peers in `src/package.json` and pins web components to `2.67.0`. The thin root manifest uses Angular 14 tooling and a `^2.56.0` web component range; its library manifest omits web components and Angular peers. Inspect the actual packed artifact before claiming supported install/runtime combinations.
6. **Validate browser and server boundaries.** Both approaches use browser APIs and custom-element registration. SSR/hydration support needs explicit testing if required; neither the decorator choice nor the existence of a CVA establishes it.

## Suggested acceptance criteria

Use a shared compatibility suite that runs existing consumer examples against the released baseline and the proposed replacement:

- Each supported `[(x)]` binding updates in both directions with the same value type and event timing, without duplicate emissions.
- Each output preserves its payload, cancellation behavior, and interaction meaning.
- Forms preserve object/key values, null/reset behavior, disabled state, touched/dirty state, validation, and `updateOn: 'blur'`. Programmatic model writes must not echo back as user changes.
- Template inputs render Angular bindings and events, update context, and clean up on replacement/destruction.
- Public imports, template references, `ViewChild` queries, methods, and legacy selectors compile and behave as promised.
- Standalone and NgModule consumers both work, including custom-element registration and strict template checking.
- Model-driven table updates, tab content lifecycle, dynamic modals, and overlay cleanup preserve existing behavior.
- Interaction tests exercise actual shadow DOM controls and wait for Lit rendering; dispatching synthetic custom events alone is insufficient.

Relevant existing `v7` suites include `src/forms/web-component-forms.spec.ts`, `src/web-components.spec.ts`, `src/web-components-overlays.spec.ts`, `src/checkbox/checkbox.component.spec.ts`, and `src/combobox/combobox.component.spec.ts`. The thin branch retains an accordion directive suite but removes many of the corresponding component suites. Reuse compatibility assertions where possible rather than treating a smaller test suite as evidence of a simpler problem.

**Decision:** for the stated requirement, choose `v7`'s Angular-facing compatibility approach and finish its gaps deliberately. Use the thin branch as a reference for direct web component composition and selected implementation ideas, or as a separately documented API for consumers willing to migrate their contracts.
