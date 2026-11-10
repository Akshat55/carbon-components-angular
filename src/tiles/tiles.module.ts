/**
 * Copyright IBM Corp. 2024
 *
 * TilesModule
 *
 * Drop-in replacement for the old carbon-components-angular TilesModule.
 * Registers the tile web components and exports the thin Angular directives
 * that map the old @Input/@Output API onto them.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import CDSTile from "@carbon/web-components/es/components/tile/tile.js";
import CDSClickableTile from "@carbon/web-components/es/components/tile/clickable-tile.js";
import CDSExpandableTile from "@carbon/web-components/es/components/tile/expandable-tile.js";
import CDSSelectableTile from "@carbon/web-components/es/components/tile/selectable-tile.js";
import CDSRadioTile from "@carbon/web-components/es/components/tile/radio-tile.js";
import CDSTileGroup from "@carbon/web-components/es/components/tile/tile-group.js";

import {
	CdsTileDirective,
	CdsClickableTileDirective,
	CdsExpandableTileDirective,
	CdsExpandableTileAboveDirective,
	CdsSelectableTileDirective,
	CdsTileGroupDirective
} from "./tile.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-tile", CDSTile);
safeDefine("cds-clickable-tile", CDSClickableTile);
safeDefine("cds-expandable-tile", CDSExpandableTile);
safeDefine("cds-selectable-tile", CDSSelectableTile);
safeDefine("cds-radio-tile", CDSRadioTile);
safeDefine("cds-tile-group", CDSTileGroup);

@NgModule({
	imports: [
		CommonModule,
		CdsTileDirective,
		CdsClickableTileDirective,
		CdsExpandableTileDirective,
		CdsExpandableTileAboveDirective,
		CdsSelectableTileDirective,
		CdsTileGroupDirective
	],
	exports: [
		CdsTileDirective,
		CdsClickableTileDirective,
		CdsExpandableTileDirective,
		CdsExpandableTileAboveDirective,
		CdsSelectableTileDirective,
		CdsTileGroupDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TilesModule { }
