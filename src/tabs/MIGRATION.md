# Tabs — Migration Guide

## What changed

The Angular Tabs/Tab components (and the header-group/vertical variants) are
replaced by directives on the `<cds-tabs>` / `<cds-tab>` web components.

The biggest structural change: **tab panels no longer live inside the tab**.
The web component renders only the tab headers; each tab points at its panel
via `target` (the panel element's id), and the web component toggles the
panels' `hidden` attribute.

```html
<!-- Before -->
<cds-tabs (selected)="onSelected($event)">
  <cds-tab heading="Tab one">Content one</cds-tab>
  <cds-tab heading="Tab two">Content two</cds-tab>
</cds-tabs>

<!-- After -->
<cds-tabs value="one" (selected)="onSelected($event)">
  <cds-tab id="tab-one" value="one" target="panel-one">Tab one</cds-tab>
  <cds-tab id="tab-two" value="two" target="panel-two">Tab two</cds-tab>
</cds-tabs>
<div id="panel-one" role="tabpanel">Content one</div>
<div id="panel-two" role="tabpanel" hidden>Content two</div>
```

## Preserved API

- `(selected)` on `<cds-tabs>` — emits `{value, item}`.
- `[heading]` on `<cds-tab>` (string) — sets the tab label.
- `[disabled]` on `<cds-tab>`.

## Removed

- `TabsVertical`, `TabHeaderGroup`, `IconTab`, `TabSkeleton` and the other
  header-group components — use the web component equivalents
  (`<cds-tabs-skeleton>` for skeletons).
