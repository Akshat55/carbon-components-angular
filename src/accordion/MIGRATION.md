# Accordion — Migration Guide

## What changed

The Angular `Accordion` and `AccordionItem` **components** have been replaced
with two thin **directives** that sit directly on the Carbon web component
elements (`<cds-accordion>` / `<cds-accordion-item>`).

No wrapper element is introduced. The DOM remains exactly:

```html
<cds-accordion>          <!-- web component, directive attached -->
  <cds-accordion-item>   <!-- web component, directive attached -->
    ...
  </cds-accordion-item>
</cds-accordion>
```

There is no Angular component shell around the web component — zero extra DOM
nodes, zero style conflicts with shadow DOM, zero view-encapsulation bleed.

---

## Module import — one line change

```ts
// Before
import { AccordionModule } from 'carbon-components-angular';

// After
import { AccordionModule } from '@carbon/angular'; // or your lib path
```

---

## Template — no changes required

All existing `@Input()` bindings and `@Output()` events are preserved:

| Old Angular component  | New directive           | Notes                        |
|------------------------|-------------------------|------------------------------|
| `[align]`              | `[align]`               | Unchanged                    |
| `[size]`               | `[size]`                | Unchanged                    |
| `[isFlush]`            | `[isFlush]`             | Unchanged                    |
| `[disabled]`           | `[disabled]`            | Cascades to items (same)     |
| `[skeleton]`           | `[skeleton]`            | Cascades to items (same)     |
| `[title]`              | `[title]`               | String or TemplateRef (same) |
| `[context]`            | `[context]`             | TemplateRef context (same)   |
| `[expanded]`           | `[expanded]`            | Unchanged                    |
| `(selected)`           | `(selected)`            | Same event shape             |

```html
<!-- This template works before AND after migration — zero changes -->
<cds-accordion [align]="align" [size]="size" [disabled]="accordionDisabled">
  <cds-accordion-item
    [title]="title"
    [disabled]="disabled"
    (selected)="onSelected($event)">
    Content here
  </cds-accordion-item>
</cds-accordion>
```

---

## Standalone components

For modern Angular standalone components, import the directives directly
instead of the module:

```ts
import { CdsAccordionDirective, CdsAccordionItemDirective } from '@carbon/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  imports: [CdsAccordionDirective, CdsAccordionItemDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <cds-accordion [size]="size">
      <cds-accordion-item title="Item" (selected)="onSelected($event)">
        Content
      </cds-accordion-item>
    </cds-accordion>
  `
})
export class MyComponent { ... }
```

---

## TemplateRef titles

Passing an `ng-template` as `[title]` works identically to before.
Under the hood the directive portals the template into the web component's
`title` named slot — no wrapping element, no style side-effects.

```html
<cds-accordion-item [title]="myTpl" [context]="{ index: 1 }">
  Content
</cds-accordion-item>

<ng-template #myTpl let-index="index">
  <strong>Section {{ index }}</strong>
</ng-template>
```

---

## What was removed

- The `Accordion` Angular **component class** — replaced by `CdsAccordionDirective`.
- The `AccordionItem` Angular **component class** — replaced by `CdsAccordionItemDirective`.
- The `ibm-accordion` / `ibm-accordion-item` selector aliases are preserved on the directives for backwards compatibility but are deprecated and will be removed in a future major version.
- `IconModule` dependency — icons are now rendered by the web component itself.

