# Button — Migration Guide

## What changed

The Angular `Button` directive (which applied `cds--btn*` classes to a native
`<button>`) has been replaced with a thin directive on the `<cds-button>` web
component. `IconButton` and `ButtonSet` components are replaced with
directives on `<cds-icon-button>` and `<cds-button-set>`.

```html
<!-- Before -->
<button cdsButton="secondary" size="sm">A button</button>

<!-- After -->
<cds-button cdsButton="secondary" size="sm">A button</cds-button>
```

## Input mapping

| Old input        | New behaviour                                          |
|------------------|--------------------------------------------------------|
| `[cdsButton]`    | mapped to the `kind` attribute; `danger--tertiary` / `danger--ghost` are translated to `danger-tertiary` / `danger-ghost` |
| `[size]`         | unchanged                                              |
| `[isExpressive]` | unchanged                                              |
| `[disabled]`     | unchanged                                              |
| `[skeleton]`     | deprecated — use `<cds-button-skeleton>`               |
| `[iconOnly]`     | deprecated — use `<cds-icon-button>`                   |

## Icon buttons

`<cds-icon-button>` keeps `[kind]`, `[size]`, `[disabled]`, `[isExpressive]`
and `[description]` (string). The icon goes into the default slot with
`slot="icon"`; the description is portalled into the `tooltip-content` slot.

## Button sets

`<cds-button-set>` keeps `[fluid]` and `[stacked]`.
