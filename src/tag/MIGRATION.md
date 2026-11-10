# Tag — Migration Guide

## What changed

The Angular tag components have been replaced with thin directives sitting
directly on the Carbon tag web components:

| Old Angular selector    | New web component element |
|-------------------------|---------------------------|
| `<cds-tag>`             | `<cds-tag>` (unchanged)   |
| `<cds-tag-filter>`      | `<cds-dismissible-tag>`   |
| `<cds-tag-selectable>`  | `<cds-selectable-tag>`    |
| `<cds-tag-operational>` | `<cds-operational-tag>`   |

The old attribute selectors (`cdsTagFilter`, `cdsTagSelectable`,
`cdsTagOperational`) are preserved on the directives, but the element names
for the filter/selectable/operational variants must be updated to the web
component tag names above.

## Input/Output mapping

All @Input/@Output names are preserved:

- `[type]`, `[size]`, `[disabled]` — unchanged.
- TagFilter `[title]` → mapped to the `tag-title` attribute internally.
- TagFilter `[closeButtonLabel]` → mapped to `dismiss-tooltip-label`.
- TagFilter `(close)` — unchanged (bridged from `cds-dismissible-tag-closed`).
- TagSelectable `[selected]` / `(selectedChange)` — unchanged.

## Skeleton

`[skeleton]` on `<cds-tag>` is deprecated — use the dedicated
`<cds-tag-skeleton>` element instead (registered by `TagModule`).

## Custom icons

`cdsTagIcon` is preserved — it now assigns the element to the tag's `icon`
slot and sets `has-custom-icon` on the parent tag.
