/**
 * Copyright IBM Corp. 2024
 *
 * SlottedTemplateComponent
 *
 * A minimal, renderless helper component used by CdsAccordionItemDirective
 * (and any other future directives) to portal Angular TemplateRefs into a
 * web component's named slot.
 *
 * It renders nothing of its own — just an `ng-container` that outlets the
 * provided template. The host element is given `slot="<name>"` by the calling
 * directive so the browser's slot assignment routes it into the shadow DOM
 * without any wrapping element interfering with styles.
 *
 * Usage (internal — called by directives, not by consumers):
 *
 *   const ref = vcr.createComponent(SlottedTemplateComponent);
 *   ref.instance.template = myTemplateRef;
 *   ref.instance.context  = { index: 2 };
 *   (ref.hostView as EmbeddedViewRef<any>).rootNodes[0].setAttribute('slot', 'title');
 *   el.nativeElement.appendChild(...rootNodes[0]);
 */
import {
	ChangeDetectionStrategy,
	Component,
	Input,
	TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
	standalone: true,
	imports: [NgTemplateOutlet],
	// The host element is a plain span — invisible, zero styling impact.
	// The calling directive sets slot="title" on it so the web component
	// routes the light-DOM content into the correct shadow slot.
	template: `
    <ng-container
      *ngTemplateOutlet="template; context: context">
    </ng-container>
  `,
	// No encapsulation so the portalled template inherits the consumer's styles.
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlottedTemplateComponent {
	@Input() template!: TemplateRef<any>;
	@Input() context: object = {};
}
