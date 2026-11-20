#!/usr/bin/env node
/**
 * One-time seed. Turns wc-angular-comparison.json into per-tag migration files
 * for the @carbon/angular generator (carbon/packages/angular/migration/components/<tag>.json).
 *
 * Existing files are never overwritten (they are curated by hand); pass --force to
 * overwrite anyway.
 *
 *   node migration/build-comparison.mjs
 *   node migration/seed-generator-files.mjs [--out <dir>] [--force]
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const outIndex = args.indexOf("--out");
const OUT = resolve(outIndex === -1 ? join(HERE, "..", "..", "carbon", "packages", "angular", "migration", "components") : args[outIndex + 1]);
const FORCE = args.includes("--force");

const comparison = JSON.parse(readFileSync(join(HERE, "wc-angular-comparison.json"), "utf8"));
const MAPPING = JSON.parse(readFileSync(join(HERE, "mapping.json"), "utf8"));

/** Angular-only inputs that are plain HTML attributes on the host. */
const NATIVE_ATTRIBUTES = { id: "id", name: "name", required: "required", ariaLabelledby: "aria-labelledby", ariaDescribedby: "aria-describedby" };
/** Angular-only inputs replaced by the shared router directive (DECISIONS.md 10). */
const ROUTER_INPUTS = new Set([...MAPPING.router.legacyInputs, "activeLinkClass"]);
/** Template-context inputs that stay on the wrapper. */
const CONTEXT_INPUTS = /Context$|^context$/;

const files = new Map();
const fileFor = (tag) => {
	if (!files.has(tag)) {
		files.set(tag, {
			$schema: "../schema.json",
			schemaVersion: 1,
			tag,
			status: "overrides",
			legacy: [],
			unchanged: { inputs: [], outputs: [] },
			inputs: {},
			outputs: {},
			methods: {},
			twoWay: [],
			forms: null,
			content: [],
			slotDirectives: [],
			mismatches: {}
		});
	}
	return files.get(tag);
};

const addMismatch = (file, id, entry) => {
	file.mismatches[id] = entry;
	return id;
};

/** Convert a mapping.json structural strategy into generator form: `host.x` reads the wrapper's own member. */
const toGenerator = (strategy) => JSON.parse(JSON.stringify(strategy).replace(/host\./g, ""));

for (const c of comparison.components) {
	if (c.rewrite) continue; // DECISIONS.md 8: no backwards compatibility
	const file = fileFor(c.wcTag);
	file.legacy.push({ class: c.ccaClass, selectors: c.ccaSelectors, file: c.ccaFile, when: c.when ?? null, set: c.set ?? null, selectorMigration: c.selectorMigration });
	if (c.readiness.level === "manual") file.status = "manual";
	if (c.readiness.level === "auto" && file.status !== "manual" && file.legacy.length === 1) file.status = "auto";

	for (const row of c.inputs) {
		if (row.name in file.inputs || file.unchanged.inputs.includes(row.name)) continue; // first class wins when classes share a tag
		const values = row.typeCheck && ["values-differ", "mismatch"].includes(row.typeCheck.status)
			? addMismatch(file, `${row.name}-${row.typeCheck.status === "mismatch" ? "type" : "values"}`, {
				member: `inputs.${row.name}`,
				kind: row.typeCheck.status === "mismatch" ? "type" : "values",
				cca: row.cca.type,
				wc: row.wc?.type ?? null,
				resolution: "manual",
				notes: row.typeCheck.status === "values-differ" ? `CCA only: ${JSON.stringify(row.typeCheck.ccaOnlyValues)}; web component only: ${JSON.stringify(row.typeCheck.wcOnlyValues)}` : ""
			})
			: null;
		const withMismatch = (entry) => (values ? { ...entry, mismatch: values } : entry);

		switch (row.status) {
			case "match":
				if (values) file.inputs[row.name] = withMismatch({ kind: "native", notes: "Same name on the web component; values differ." });
				else file.unchanged.inputs.push(row.name);
				break;
			case "rename":
			case "type-mismatch":
				if (row.wc && row.wc.prop !== row.name) {
					file.inputs[row.name] = withMismatch({ kind: "alias", prop: row.wc.prop, deprecated: `Use \`${row.wc.prop}\`.`, schematic: { rename: row.wc.prop } });
				} else {
					file.inputs[row.name] = withMismatch({ kind: "native", notes: "Same name on the web component; the type differs." });
				}
				break;
			case "prop+slot":
				file.inputs[row.name] = { kind: "templateSlot", prop: row.wc.prop, slot: row.slot.name, ...(row.wc.prop !== row.name ? { deprecated: `Use \`${row.wc.prop}\`, or slot="${row.slot.name}".` } : {}) };
				break;
			case "slot":
				file.inputs[row.name] = { kind: "slot", slot: row.slot.name };
				break;
			case "selects-tag":
				file.inputs[row.name] = {
					kind: "removed",
					replacement: { tags: row.selects.map((s) => ({ tag: s.tag, when: s.when, set: s.set ?? null })) },
					schematic: { todo: `\`${row.name}\` selects another element now: ${row.selects.map((s) => `<${s.tag}>`).join(" / ")}.` }
				};
				break;
			case "render-children":
			case "adapter":
				file.inputs[row.name] = toGenerator(row.strategy);
				break;
			case "angular-only":
				if (CONTEXT_INPUTS.test(row.name)) file.inputs[row.name] = { kind: "keep", notes: "Template context for a TemplateRef input." };
				else if (ROUTER_INPUTS.has(row.name)) file.inputs[row.name] = { kind: "removed", schematic: { todo: `\`${row.name}\` is replaced by [routerLink] on the element.` } };
				else file.inputs[row.name] = { kind: "native", attribute: NATIVE_ATTRIBUTES[row.name] ?? null };
				break;
			default: // cca-only, structural
				file.inputs[row.name] = {
					kind: "removed",
					...(row.suggestions ? { suggestions: row.suggestions } : {}),
					schematic: { todo: `\`${row.name}\` has no web component counterpart.` }
				};
		}
	}

	for (const row of c.outputs) {
		if (row.name in file.outputs || file.unchanged.outputs.includes(row.name)) continue;
		switch (row.status) {
			case "match":
				file.unchanged.outputs.push(row.name);
				break;
			case "two-way": {
				const s = row.twoWay.strategy;
				const output = `${row.twoWay.wcProp}Change`;
				if (!file.twoWay.some((t) => t.prop === row.twoWay.wcProp)) {
					file.twoWay.push({
						prop: row.twoWay.wcProp,
						source: s.kind === "hostListener" ? { event: s.event } : { observe: s.attributes }
					});
				}
				if (row.name !== output) file.outputs[row.name] = { kind: "alias", of: output, deprecated: `Use \`(${output})\`.`, schematic: { rename: output } };
				else file.unchanged.outputs.push(row.name);
				break;
			}
			case "rename":
				file.outputs[row.name] = { kind: "alias", of: row.wc.generatorOutput, deprecated: `Use \`(${row.wc.generatorOutput})\`.`, schematic: { rename: row.wc.generatorOutput } };
				break;
			case "native":
				file.outputs[row.name] = { kind: "native" };
				break;
			default:
				file.outputs[row.name] = { kind: "removed", ...(row.suggestions ? { suggestions: row.suggestions } : {}), schematic: { todo: `\`(${row.name})\` has no web component counterpart.` } };
		}
	}

	for (const m of c.methods) {
		if (m.name in file.methods || m.status === "match") continue;
		file.methods[m.name] = { kind: "removed", schematic: { todo: `\`${m.name}()\` has no web component counterpart.` } };
	}

	if (c.forms.status.startsWith("cca-only")) {
		addMismatch(file, "forms", { member: "forms", kind: "missing-in-wc", cca: "ControlValueAccessor", wc: "not form-associated, or no value/checked prop", resolution: "manual", notes: "Add a `forms` override if a value property can drive ngModel." });
	}

	for (const n of c.content.ngContent) {
		if (n.ngContent === "(default)" || ["slot-directive", "match"].includes(n.status)) continue;
		if (!file.content.some((x) => x.legacySelect === n.ngContent)) {
			file.content.push({ legacySelect: n.ngContent, slot: n.slot, status: n.status, notes: n.action ?? null });
		}
	}
}

for (const sd of comparison.slotDirectives) {
	if (sd.slot === null) continue;
	fileFor(sd.parent).slotDirectives.push({ class: sd.ccaClass, selectors: sd.selectors, slot: sd.slot });
}

mkdirSync(OUT, { recursive: true });
let written = 0;
let skipped = 0;
for (const [tag, file] of [...files].sort()) {
	const path = join(OUT, `${tag}.json`);
	if (existsSync(path) && !FORCE) {
		skipped++;
		continue;
	}
	writeFileSync(path, `${JSON.stringify(file, null, 2)}\n`);
	written++;
}
console.log(`Wrote ${written} file(s) to ${OUT}; skipped ${skipped} existing (curated) file(s).`);
