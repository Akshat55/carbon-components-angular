# Radio — Migration Guide

## What changed

| Old Angular selector | New web component element  |
|----------------------|----------------------------|
| `<cds-radio-group>`  | `<cds-radio-button-group>` |
| `<cds-radio>`        | `<cds-radio-button>`       |

The Angular components are replaced with thin directives on the web component
elements. All @Input/@Output names are preserved:

- Group: `[value]`, `[name]`, `[disabled]`, `[orientation]`, `[labelPlacement]`,
  `[legend]`, `[helperText]`, `[invalid]`, `[invalidText]`, `[warn]`, `[warnText]`,
  `(change)` — emits the same `RadioChange` class.
- Radio: `[checked]`, `[value]`, `[disabled]`, `[labelPlacement]`, `(change)`.

`[(ngModel)]` and reactive forms continue to work — the group directive
implements `ControlValueAccessor`.

## Notes

- `[legend]` / `[helperText]` / `[invalidText]` / `[warnText]` accept strings;
  TemplateRef values are no longer rendered (the web component owns rendering).
- `[skeleton]` was removed — use the Carbon skeleton elements instead.
