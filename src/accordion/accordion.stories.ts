/**
 * Storybook stories for the Angular accordion directive layer.
 *
 * These stories demonstrate:
 *  1. Basic usage — identical template to the old carbon-components-angular stories.
 *  2. TemplateRef title — ng-template passed as [title] with context.
 *  3. Skeleton state.
 *  4. Disabled cascade from parent accordion.
 *  5. Standalone component usage (no NgModule).
 */

import { Meta, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { AccordionModule } from './index';

export default {
  title: 'Components/Accordion',
  decorators: [
    moduleMetadata({
      imports: [AccordionModule, CommonModule],
    }),
  ],
  argTypes: {
    align: { control: 'radio', options: ['start', 'end'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    isFlush: { control: 'boolean' },
    disabled: { control: 'boolean' },
    skeleton: { control: 'boolean' },
    // Templates bind (selected)="selected($event)" — wire it to a
    // Storybook action so the handler exists on the story props.
    selected: { action: 'selected' },
  },
} as Meta;

// ─────────────────────────────────────── 1. Basic (old template — zero changes)
export const Basic = (args) => ({
  props: args,
  template: `
    <cds-accordion
      [align]="align"
      [size]="size"
      [isFlush]="isFlush"
      [disabled]="disabled">
      <cds-accordion-item title="Section 1 title" (selected)="selected($event)">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </cds-accordion-item>
      <cds-accordion-item title="Section 2 title" (selected)="selected($event)">
        Ut enim ad minim veniam, quis nostrud exercitation ullamco.
      </cds-accordion-item>
      <cds-accordion-item title="Section 3 title" (selected)="selected($event)">
        Duis aute irure dolor in reprehenderit in voluptate velit.
      </cds-accordion-item>
    </cds-accordion>
  `,
});
Basic.args = { align: 'end', size: 'md', isFlush: false, disabled: false };

// ─────────────────────────────────────── 2. TemplateRef title with context
export const WithTemplateTitle = (args) => ({
  props: args,
  template: `
    <cds-accordion [align]="align" [size]="size">
      <cds-accordion-item [title]="titleTpl" [context]="{ index: 1 }" (selected)="selected($event)">
        Content for item one.
      </cds-accordion-item>
      <cds-accordion-item [title]="titleTpl" [context]="{ index: 2 }" (selected)="selected($event)">
        Content for item two.
      </cds-accordion-item>
    </cds-accordion>

    <ng-template #titleTpl let-index="index">
      <strong>Section {{ index }} title</strong>
    </ng-template>
  `,
});
WithTemplateTitle.args = { align: 'end', size: 'md' };
WithTemplateTitle.storyName = 'With TemplateRef Title';

// ─────────────────────────────────────── 3. Skeleton
export const Skeleton = () => ({
  template: `
    <div style="width: 500px">
      <cds-accordion [skeleton]="true">
        <cds-accordion-item [expanded]="true"></cds-accordion-item>
        <cds-accordion-item></cds-accordion-item>
        <cds-accordion-item></cds-accordion-item>
        <cds-accordion-item></cds-accordion-item>
      </cds-accordion>
    </div>
  `,
});
Skeleton.parameters = { controls: { disable: true } };

// ─────────────────────────────────────── 4. Disabled cascade
export const DisabledCascade = () => ({
  props: { accordionDisabled: true },
  template: `
    <cds-accordion [disabled]="accordionDisabled">
      <cds-accordion-item title="Cannot expand (parent disabled)">Hidden.</cds-accordion-item>
      <cds-accordion-item title="Also disabled by parent">Hidden.</cds-accordion-item>
    </cds-accordion>
  `,
});
DisabledCascade.storyName = 'Disabled Cascade from Parent';

// ─────────────────────────────────────── 5. Standalone usage note
export const StandaloneUsage = (args) => ({
  props: args,
  template: `
    <p style="font-size:0.8rem;margin-bottom:1rem;color:#666">
      Standalone: import CdsAccordionDirective + CdsAccordionItemDirective directly — no NgModule.
    </p>
    <cds-accordion [align]="align" [size]="size">
      <cds-accordion-item title="Standalone item 1" (selected)="selected($event)">
        Works without AccordionModule.
      </cds-accordion-item>
      <cds-accordion-item title="Standalone item 2" (selected)="selected($event)">
        Just import the directives.
      </cds-accordion-item>
    </cds-accordion>
  `,
});
StandaloneUsage.args = { align: 'end', size: 'md' };
StandaloneUsage.storyName = 'Standalone Component Usage';
