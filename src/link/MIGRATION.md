# Link — Migration Guide

## What changed

The Angular `Link` / `LinkIcon` directives (which applied `cds--link*` CSS
classes onto a native `<a>` element) have been replaced with thin directives
that sit directly on the `<cds-link>` Carbon web component.

```html
<!-- Before -->
<a href="#" cdsLink [disabled]="disabled">A link</a>

<!-- After -->
<cds-link href="#" [disabled]="disabled">A link</cds-link>
```

No wrapper element is introduced — the directive only maps @Inputs to
web component attributes.

## Input mapping

| Old Angular input | New directive input | Web component attribute |
|-------------------|---------------------|--------------------------|
| `[inline]`        | `[inline]`          | `inline`                 |
| `[size]`          | `[size]`            | `size`                   |
| `[visited]`       | `[visited]`         | `visited`                |
| `[disabled]`      | `[disabled]`        | `disabled`               |
| n/a               | `[href]` `[target]` `[rel]` | native anchor attrs |

## Icons

`cdsLinkIcon` is preserved — it now assigns the element to the web
component's `icon` slot instead of applying the `cds--link__icon` class.
