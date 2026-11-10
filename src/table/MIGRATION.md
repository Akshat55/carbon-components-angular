# Table — Migration Guide

## What changed

The Angular Table component tree (Table, TableToolbar, TableContainer,
TableHead*, TableBody*, cell components, expand/checkbox/radio helpers) is
replaced by a thin directive on the `<cds-table>` web component and the
data-table child elements.

## Model-driven usage (preserved)

`[model]` still accepts the same `TableModel` / `TableHeaderItem` /
`TableItem` classes — the directive renders the web component's head/body
from the model:

```html
<cds-table [model]="model" (sort)="onSort($event)" (rowClick)="onRowClick($event)"></cds-table>
```

Limitations vs the old component:
- `TableItem.template` (TemplateRef cells) is not rendered — cell data is
  stringified. Use markup-driven tables for custom cell content.
- Multi-row headers collapse to the first header row.
- Expandable rows, per-column filters and the data-grid keyboard model are
  not mapped — use the web component's own features instead.

## Markup-driven usage (recommended)

```html
<cds-table>
  <cds-table-head>
    <cds-table-header-row>
      <cds-table-header-cell>Name</cds-table-header-cell>
    </cds-table-header-row>
  </cds-table-head>
  <cds-table-body>
    <cds-table-row>
      <cds-table-cell>Load Balancer 1</cds-table-cell>
    </cds-table-row>
  </cds-table-body>
</cds-table>
```

Toolbars use `<cds-table-toolbar>` / `<cds-table-toolbar-content>` /
`<cds-table-toolbar-search>` (all registered by `TableModule`).
