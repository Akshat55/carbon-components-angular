# Two ways to put Angular on Carbon web components

This compares our `v7` branch of `carbon-components-angular` (CCA) with the new
`@carbon/angular` package in the Carbon monorepo (`carbon/packages/angular`).
Both put Angular on top of `@carbon/web-components`. They want different
things, and most of the differences follow from that.

Written 2026-11-17 against:

| Repo | Ref | Sources read |
| --- | --- | --- |
| `carbon-components-angular` | `v7` @ `1a16337f5` | `src/utils/web-components.ts`, Checkbox, Accordion, Dropdown, Modal, package manifests, `compare.md`, our working notes |
| `carbon` | `6dd4c7c80` (v12.0.0-alpha.10), `@carbon/angular` 1.0.0-alpha.4 | ADRs 0011–0015 and 0018–0021 in `docs/decisions/`; `packages/angular/docs/` (`plan.md`, `developer-experience.md`, `migration-support.md`, `status-and-open-questions.md`) |

This is a review of source code and documents. I built nothing and ran no
tests in either repo. Numbers about `@carbon/angular` are the ones its own
documents report.

---

## Short answer

**For moving existing CCA users onto web components, `v7` is the better
design.** It keeps the package name, the NgModules, the services, the
`TemplateRef` inputs, the data-driven inputs (`[items]`, `[tree]`, `[steps]`)
and typed two-way bindings. Most apps should upgrade with a version bump and a
schematic, not a rewrite. `@carbon/angular` itself says the move from CCA to
its package is costly. It dropped its compatibility layer, and nearly all of
its migration tooling is still a plan.

**For covering every component and keeping up with Carbon over time,
`@carbon/angular` is the better design.** It generates 296 wrappers from the
web components' manifest. It bundles a renamed copy of the web components, so
it can run on the same page as CCA. It reruns the full web component test suite
against that copy. Our `v7` has about 190 hand-written classes, covers only
what v6 had, and every web component upgrade means manual review.

The two designs agree on the core pattern: the Angular component *is* the web
component's element, not a wrapper around it. `@carbon/angular` reached that
conclusion through measurements we never made (ADR 0015). That supports what
`v7` already does.

The best result for `v7` is to keep its hand-written Angular API and copy
three things from `@carbon/angular`: its manifest-driven checks, its
child-registration test, and its native-event rule (see "What `v7` should
take", below).

---

## Shared design: the host is the web component

Both projects ended up with the same component shape:

- The Angular selector is the web component's tag. The template is
  `<ng-content />`, plus slot content where needed.
- Importing the Angular class registers the web component.
- `ControlValueAccessor` lives on the Angular class, not in the web component
  (ADR 0013; our `WebComponentValueAccessor`).
- Components are standalone, so consumers don't need `CUSTOM_ELEMENTS_SCHEMA`.
- Changed inputs are written to the element as properties. Inputs the consumer
  never set keep the web component's defaults.

`@carbon/angular` tried other shapes first and measured why they fail (ADR 0015,
in Chromium):

| Shape they tried | What broke |
| --- | --- |
| Angular `cds-button` rendering an inner, renamed `cds-ng-button` | 113 of 126 component stylesheets use `:host(cds-…)`. An Accordion item header measured 20px instead of 48px. |
| Wrapper element around the real `cds-button` | Parents find children by tag. `cds-modal-footer` reported `hasThreeButtons: false` because the slotted node wasn't a `cds-button`. |
| Host is the web component | Same layout as a bare web component; compound components work. |

Our rule in `src/utils/web-components.ts` ("never wrap a web component in
another element") was a judgment call. Their measurements back it up.

---

## Where the two differ

| | `v7` (CCA) | `@carbon/angular` |
| --- | --- | --- |
| **Goal** | The next major of CCA. Existing apps upgrade in place. | A new package with a one-to-one web component API. No CCA compatibility (`/legacy` removed 2026-10-26). |
| **How wrappers are made** | Hand-written, about 190 classes on `cds-*` tags | Generated from the Custom Elements Manifest: 296 wrappers, 2,186 inputs |
| **Scope** | Only what v6 had (no card, tearsheet, fluid, preview, and so on) | Every web component, including IBM Products, AI and fluid components |
| **Tags** | Real `cds-*` tags | Everything renamed to `cds-ng-*` (ADR 0020) |
| **Web components dependency** | `@carbon/web-components` `2.67.0`, an exact pin in `dependencies` | A `cds-ng` copy built and bundled into the package; not a dependency |
| **Platform** | Angular 20–22, WC 2.x, `@carbon/styles` 1.x | Angular ≥19, WC v3, `@carbon/styles` 2.x (Carbon v12) |
| **NgModules** | Kept (59 `*.module.ts`) next to standalone exports | None (ADR 0012) |
| **Events** | Hand-typed (`EventEmitter<{ id, expanded }>`, `RadioChange`, …) | All 225 outputs are `EventEmitter<any>`; payload types are missing from the manifest |
| **Two-way binding** | `[(checked)]`, `[(expanded)]`, `[(value)]`, `[(isOpen)]`; state mirrored with `observeAttributes` | None. Signals and `model()` are listed as future work. |
| **`TemplateRef` inputs** | `TemplateContent` and `TemplateSlot` take `string \| TemplateRef` for labels, helper text and decorators | Consumers write `slot="…"` themselves |
| **Data-driven inputs** | Kept: Dropdown/ComboBox `[items]`, TreeView `[tree]`, ProgressIndicator `[steps]`, Breadcrumb `[items]`, navigation arrays | Removed; consumers project child elements |
| **Services** | `ModalService`, `PlaceholderService` and others kept | Dropped. Use `<cds-ng-modal [open]>`; maybe add a helper after v1. |
| **Table** | v1 stays an Angular implementation with `TableModel`; v2 is separate | Projected children only; no `TableModel` and no `[rows]` |
| **Native-element directives** | `[cdsButton]`, `cdsText` and the CSS utility directives kept | Not generated; whether to port, replace or drop them is undecided |
| **Router** | Existing v6 support | `cdsRouterLink` directives planned (Milestone 4.5), not built |
| **Tests** | 84 Karma specs in a real browser. v6 specs were rewritten to check behaviour against `master`. | Jest (308 tests) mounts every wrapper. The rewritten WC suite (2,268 tests) runs on the vendored copy. Playwright renders 61 stories. |
| **Migration tooling** | Schematics planned; `migrations/` is empty | Codemods and agent skills planned; none built, and the guide doesn't exist yet |

---

## What `@carbon/angular` does better

### 1. Coverage and keeping up with Carbon

Generating wrappers removes the lag that ADR 0011 blames on CCA ("roughly 35
components vs. the React library's full set"). When the web components add a
property, regenerating picks it up. In `v7`, someone has to notice the new
property and wire it by hand. With a hand-written layer and an exact pin at
`2.67.0`, a WC upgrade becomes an audit of every family. The `v7` per-family
audit has shown how slow that is.

`v7` also covers only what v6 had, on purpose. Teams that want the AI, fluid
or IBM Products components get no Angular API for them from us.

### 2. Coexistence and repeatable migration (the `cds-ng-*` prefix)

ADR 0020 tested one thing we haven't. With the real `cds-*` tag registered,
**a CCA v6 modal stops painting, and a v6 dropdown is replaced by a different
control** with no selectable items. This was checked for Modal and Dropdown
only. Registering a custom element upgrades every element with that tag on the
page, including CCA's own Angular-rendered hosts. With the `cds-ng-*` prefix,
both versions render side by side.

Two consequences matter for us:

- **Micro-frontends and incremental adoption.** Our users can't run v6 and v7
  on one page. Usually that's fine, because they replace one major with the
  next. It breaks for module-federation shells and for any team that installs
  two CCA versions under different names to migrate gradually.
- **Repeatable codemods.** A tool can tell `<cds-modal>` (old) from
  `<cds-ng-modal>` (new), so it can run file by file and safely rerun. Our
  schematics will have to work out whether a `<cds-modal>` has been migrated
  from its inputs, not its tag.

The prefix costs a lot, though. Every template changes, users who also load
`@carbon/web-components` ship two copies, and WC bug fixes wait for an Angular
release. Given what we're aiming for, using the real tags is still the right
call for us.

### 3. Verification that scales

- `child-registration.spec.ts` fails when a wrapper's import leaves elements it
  renders unregistered. Their generator imported `modal.js`, which left
  `cds-dialog`, `cds-modal-header`, `cds-modal-footer` and `cds-modal-body`
  undefined. We hit the same class of bug by hand: `breadcrumb-overflow-menu.js`
  has to be imported directly because the barrel doesn't register it. We have
  no test that catches the next one.
- Running the web components' own test suite against the shipped copy shows
  the shipped copy still behaves correctly.
- Each Playwright run renders every story and fails on page errors. We check
  stories in headless Chrome by hand.

### 4. A measured rule for event names

ADR 0015 measured that an `@Output` with the same name as a DOM event the host
dispatches makes a consumer's handler run **twice**. In one setup it looped
580 times and overflowed the stack. Their rule: never give an `@Output` the
name of a native event.

`v7` has several outputs like that: `click` on Checkbox, TagFilter and
PaginationItem, `change` on Radio, RadioGroup and PaginationOverflow,
`submit` on ComboBox, and `toggle` on TreeView. Checkbox avoids the host
listener with `addEventListener`, and those outputs are there to keep the v6
API. Their test was on a different component, so this isn't confirmed here.
But `click` is composed and does cross the shadow boundary. **A consumer's
`(click)` on `<cds-checkbox>` may run twice. This needs a test.** I tried to
check it during this review, but the local `@angular/cli` install has no `bin`
directory, so the test runner wouldn't start.

### 5. Platform

They target Carbon v12: WC v3, `@carbon/styles` 2.x, `defineCustomElement` and
`create-prefixed-build`. `v7` is on WC 2.67 and styles 1.x, so it will need
another WC major upgrade.

---

## What `v7` does better

### 1. Migration cost, the main reason this package exists

`@carbon/angular`'s own `migration-support.md` lists the costs for a CCA app:
model-shaped inputs in about 20 components, 17 services to rewrite, output
names changing on every component with outputs, different CVA value shapes, 53
attribute directives, and every tag renamed (63 by prefix, 32 by lookup
table). Of the work that can't be automated (its tiers C and D), it says they
"hold most of the real effort". It also says nothing has been run on a real
application, and that it has no per-component usage data to size any of it.
Its maintainers dropped the compatibility layer because "adapters create a
two-step migration".

`v7` takes on that cost itself instead of passing it to consumers. It keeps
`[items]`, `[tree]`, `[steps]`, `ModalService`, `TableModel` (v1), NgModules,
`TemplateRef` inputs and `master`'s default values. Most of the breaks left
are tag changes that a schematic can make.

### 2. Developer experience in Angular

`developer-experience.md` lists gaps that `v7` already fills:

| Gap they list | `v7` |
| --- | --- |
| Outputs are `EventEmitter<any>`, and `$event` gets no IDE help | Hand-typed payloads |
| No two-way binding on non-form inputs | `[(expanded)]`, `[(checked)]`, `[(isOpen)]` and others, mirrored from reflected attributes |
| 145 inputs still typed `any` | Hand-written types |
| Slots are raw `slot="…"` | `string \| TemplateRef` inputs rendered into slots and properties |
| No programmatic modals | `ModalService` |
| Router integration not built | v6 support kept |

Their own document says the package "has no reason to exist" if it's only a
thin re-export of the web components. Today their generated output is close to
that. Our hand-written layer is where the Angular value comes from.

### 3. Behaviour checked against the previous release

Our per-family audit checks every public input, output, default value and
event order against `master`. Their checks prove that inputs reach the
element. They never compare against CCA, because they decided not to be
compatible with it.

### 4. A smaller install

`v7` uses the real `@carbon/web-components` package, so an app that also uses
it directly gets one copy (if the versions match). `@carbon/angular` bundles a
second, prefixed copy, 0.9 MB gzipped for the whole library before
tree-shaking, and that copy can only be updated by releasing `@carbon/angular`.

---

## Problems both have

These are listed in `@carbon/angular`'s docs and apply to `v7` just as much:

1. **Shadow DOM is the biggest unlisted break.** `migration-support.md` ranks
   it first: application CSS that overrides `.cds--btn`, `.cds--modal` and
   similar, and unit or e2e tests that query Carbon's inner DOM, stop matching.
   The fix is CSS custom properties and `::part`. Nobody has checked whether
   the web components expose enough parts. **`v7` needs a migration note about
   this before release.**
2. **Registering on import vs. tree-shaking.** Both register elements as a side
   effect of importing a module. Neither project has tested how a consumer's
   bundler treats that.
3. **Typing `$event` for native-named events.** Both projects use `(change)` or
   `(click)` on a custom element. Neither has checked how that appears under
   `strictTemplates`.
4. **Attribute directives.** Both have to decide what happens to `[cdsButton]`
   and similar. `v7` keeps them as v6 Angular code, so we haven't had to decide
   yet.

---

## What `v7` should take from `@carbon/angular`

In priority order:

1. **Test child registration.** For each class, import only its module, render
   it, and assert that every `cds-*` tag in its shadow root and template is
   defined. This would catch the next `breadcrumb-overflow-menu` case.
2. **Check our inputs against the manifest.** Don't generate the wrappers. Add
   a CI script that reads `@carbon/web-components/custom-elements.json` and
   reports public properties and custom events that no `v7` class binds, and
   bindings to properties that don't exist (the invented `hasForm` on modal
   body was one of those). This gives us generation's ability to keep up
   without losing the hand-written API, and makes WC upgrades a diff to work
   through.
3. **Test native-named outputs.** Add one spec per output listed in section 4
   above. Each counts how often a consumer's handler runs for a single user
   action. If any runs twice, rename the output, deprecate the old name, and
   let a schematic rewrite templates.
4. **Write the shadow DOM migration note now**, with before/after examples for
   the most common overrides and test selectors.
5. **Loosen the WC pin.** A `2.67.0` exact pin in `dependencies` gives a second
   copy of the web components to any app that uses a different 2.x version.
   Both copies try to register `cds-*`, and the first one wins. Consider a
   `^2.67.0` peer dependency (or at least a caret range) and a runtime warning
   when the registered class isn't ours.
6. **Plan for WC v3 and styles 2.x.** Compare against the generated
   `@carbon/angular` inputs for the same components to find property renames.
7. **Ask the coexistence question explicitly.** If micro-frontend users need v6
   and v7 on one page, the only proven fix is a wholesale prefix
   (`create-prefixed-build`, WC v3). That would change our tags and our
   migration story, so decide early.

## What `v7` should not take

- **Generating the public API.** Generated output is the reason for `any`
  outputs, missing two-way binding and dropped compatibility. Use the manifest
  to check our code, not to write it.
- **The `cds-ng-*` prefix by default.** It solves coexistence by changing every
  consumer template, which works against the main reason for `v7`. Adopt it
  only if item 7 above shows real demand.
- **Dropping NgModules, services and data inputs.** `@carbon/angular` is a new
  package and can start clean. CCA users are already using these.

---

## Bottom line

`@carbon/angular` is the better platform: complete, generated, able to run
next to CCA, and tested against the full web component suite. `v7` is the
better product for the people who use CCA today: the same package, the same
API and typed Angular ergonomics, with the web components underneath.

They don't have to compete. If Carbon makes `@carbon/angular` the long-term
Angular package, `v7` is a reasonable intermediate step: its users are already
on web components, on the same host-is-the-element pattern and the same
ControlValueAccessor approach, so the later move is mostly tags and inputs.
Until that's decided, `v7` should copy `@carbon/angular`'s verification tools
(registration test, manifest check, native-event rule) but not its API
decisions.
