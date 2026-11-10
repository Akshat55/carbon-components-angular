# Structured List — Migration Guide

## What changed

The Angular structured-list components are replaced by directives on the
structured-list web components. The markup structure changes to match the
web components' head/body split:

```html
<!-- Before -->
<cds-structured-list [selection]="selection" (selected)="onSelected($event)">
  <cds-list-header>
    <cds-list-column>Column A</cds-list-column>
  </cds-list-header>
  <cds-list-row value="row-1">
    <cds-list-column>Row 1</cds-list-column>
  </cds-list-row>
</cds-structured-list>

<!-- After -->
<cds-structured-list [selection]="selection" (selected)="onSelected($event)">
  <cds-structured-list-head>
    <cds-structured-list-header-row>
      <cds-structured-list-header-cell>Column A</cds-structured-list-header-cell>
    </cds-structured-list-header-row>
  </cds-structured-list-head>
  <cds-structured-list-body>
    <cds-structured-list-row value="row-1">
      <cds-structured-list-cell>Row 1</cds-structured-list-cell>
    </cds-structured-list-row>
  </cds-structured-list-body>
</cds-structured-list>
```

## Preserved API

- `[selection]`, `[condensed]`, `[flushed]`, `[name]` on the list.
- `(selected)` emits the same `{value, selected, name}` shape.
- `[value]` on rows (mapped to the web component's `selection-value`).
