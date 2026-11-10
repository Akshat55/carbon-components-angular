/**
 * Public API surface for the Angular dialog layer.
 *
 * The dialog-service infrastructure was removed — the web components manage
 * their own floating panes. Overflow-menu directives live here to preserve
 * the old `carbon-components-angular/dialog` import path.
 */
export { DialogModule } from "./dialog.module";
export { CdsOverflowMenuDirective, CdsOverflowMenuItemDirective } from "./overflow-menu.directive";
