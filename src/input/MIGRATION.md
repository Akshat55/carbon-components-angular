# Input — Migration Guide

## What changed

The class-based directives (`[cdsText]`, `[cdsTextArea]`, `[cdsPassword]`)
and the `cds-label` / `cds-text-label` / `cds-textarea-label` /
`cds-password-label` wrapper components have been replaced by thin directives
on the input web components, which render their own labels:

```html
<!-- Before -->
<cds-label helperText="Helper text">
  Text input label
  <input cdsText placeholder="Placeholder" [invalid]="invalid" />
</cds-label>

<!-- After -->
<cds-text-input
  label="Text input label"
  helperText="Helper text"
  placeholder="Placeholder"
  [invalid]="invalid">
</cds-text-input>
```

| Old pattern                       | New element            |
|-----------------------------------|------------------------|
| `<input cdsText>` + `cds-label`   | `<cds-text-input>`     |
| `<textarea cdsTextArea>` + label  | `<cds-textarea>`       |
| `<input cdsPassword>` + label     | `<cds-password-input>` |

All directives implement `ControlValueAccessor`, so `[(ngModel)]` and
reactive forms keep working. Label/helper/validation texts moved from the
label wrapper to inputs on the input element itself: `[label]`,
`[helperText]`, `[invalidText]`, `[warnText]`, `[invalid]`, `[warn]`,
`[disabled]`, `[readonly]`, `[hideLabel]`, `[placeholder]`, `[size]`.

`[theme]` and `[skeleton]` were removed — use the layer component and Carbon
skeleton elements instead.
