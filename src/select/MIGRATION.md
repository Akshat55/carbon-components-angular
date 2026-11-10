# Select — Migration Guide

## What changed

The Angular `Select` component is replaced by a thin directive on the
`<cds-select>` web component. Native `<option>` / `<optgroup>` elements are
replaced by `<cds-select-item>` / `<cds-select-item-group>`.

```html
<!-- Before -->
<cds-select label="Select label" [(ngModel)]="model">
  <option value="one">One</option>
  <optgroup label="Group">
    <option value="two">Two</option>
  </optgroup>
</cds-select>

<!-- After -->
<cds-select label="Select label" [(ngModel)]="model">
  <cds-select-item value="one">One</cds-select-item>
  <cds-select-item-group label="Group">
    <cds-select-item value="two">Two</cds-select-item>
  </cds-select-item-group>
</cds-select>
```

All `<cds-select>` @Input/@Output names are preserved (`label`, `helperText`,
`invalid`, `invalidText`, `warn`, `warnText`, `size`, `disabled`, `readonly`,
`hideLabel`, `display`, `(valueChange)`), and ngModel / reactive forms keep
working via ControlValueAccessor.

## Notes

- `[theme]`, `[skeleton]`, `[fluid]` and TemplateRef label/helper values are
  no longer supported — the web component owns rendering.
