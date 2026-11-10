# Modal — Migration Guide

## What changed

The Angular Modal component, its header/footer subcomponents, and the
`ModalService` / `AlertModal` dynamic-creation APIs are replaced by a thin
directive on the `<cds-modal>` web component and its child elements.

```html
<!-- Before -->
<cds-modal [open]="open" (close)="open = false">
  <cds-modal-header (closeSelect)="open = false">
    <p cdsModalHeaderLabel>Label</p>
    <p cdsModalHeaderHeading>Heading</p>
  </cds-modal-header>
  <section cdsModalContent>...</section>
  <cds-modal-footer>...</cds-modal-footer>
</cds-modal>

<!-- After -->
<cds-modal [open]="open" (close)="open = false">
  <cds-modal-header>
    <cds-modal-close-button></cds-modal-close-button>
    <cds-modal-label>Label</cds-modal-label>
    <cds-modal-heading>Heading</cds-modal-heading>
  </cds-modal-header>
  <cds-modal-body>
    <cds-modal-body-content>...</cds-modal-body-content>
  </cds-modal-body>
  <cds-modal-footer>
    <cds-modal-footer-button kind="secondary" data-modal-close>Cancel</cds-modal-footer-button>
    <cds-modal-footer-button>Save</cds-modal-footer-button>
  </cds-modal-footer>
</cds-modal>
```

## Preserved API

- `[open]`, `[size]`, `(close)`, `(overlaySelected)`.
- `[theme]="'danger'"` maps to the web component's `alert` attribute.
- `[isFullWidth]` maps to `full-width`.

## ModalService (preserved)

`ModalService` still supports dynamic modal creation:

- `show(AlertModalData)` — builds the alert modal out of dynamically created
  web component elements (`document.createElement("cds-modal")` etc.). Same
  data shape as before: `label`, `title`, `content`, `size`, `type`,
  `buttons` (with `click` handlers), `close`.
- `create({component, inputs})` — dynamically instantiates your Angular
  component (whose template contains `<cds-modal [open]="true">`) via
  Angular's `createComponent()`, so DI, bindings and outputs keep working.
  The component is destroyed automatically when its modal fires
  `cds-modal-closed`.
- `destroy(ref?)` — closes a specific modal or the most recent one.

## Removed

- `AlertModal`, `Overlay`, `BaseModal` component classes — `show()` renders
  the alert modal with web components directly; extend nothing for custom
  modals, just write a component with `<cds-modal>` in its template.
