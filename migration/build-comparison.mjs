#!/usr/bin/env node
/**
 * One-time script. Builds migration/wc-angular-comparison.json: a per-component
 * comparison of the Carbon web components (CEM + source) and
 * carbon-components-angular (compodoc on the current branch). It seeds the
 * per-tag migration files the wrapper generator reads.
 *
 * Sources, in order of trust:
 *   1. Custom Elements Manifest (CEM): @carbon/web-components custom-elements.json
 *   2. Web component source: fills in <slot>s the CEM does not declare
 *   3. compodoc documentation.json: the CCA API on the current branch
 *   4. migration/mapping.json: hand-maintained hints, each checked against 1 and 2
 *
 * Usage:
 *   npm run docs:json   # regenerate dist/docs/documentation.json first
 *   node migration/build-comparison.mjs [--wc <path to packages/web-components>] [--out <file>]
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");

const args = process.argv.slice(2);
const arg = (name, fallback) => {
	const i = args.indexOf(`--${name}`);
	return i === -1 ? fallback : args[i + 1];
};

const WC_ROOT = resolve(arg("wc", join(ROOT, "..", "carbon", "packages", "web-components")));
const OUT = resolve(arg("out", join(HERE, "wc-angular-comparison.json")));
const COMPODOC = join(ROOT, "dist", "docs", "documentation.json");
const CEM = join(WC_ROOT, "custom-elements.json");
const MAPPING = JSON.parse(readFileSync(join(HERE, "mapping.json"), "utf8"));

for (const [label, path] of [["CEM", CEM], ["compodoc", COMPODOC]]) {
	if (!existsSync(path)) {
		console.error(`Missing ${label}: ${path}`);
		console.error(label === "CEM"
			? "Run `yarn workspace @carbon/web-components cem` in the carbon repo, or pass --wc."
			: "Run `npm run docs:json` first.");
		process.exit(1);
	}
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const camel = (kebabStr) => kebabStr.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const kebab = (camelStr) => camelStr.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const stripHtml = (s) => (s || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const uniq = (list) => [...new Set(list)];
const git = (cmd) => execSync(`git ${cmd}`, { cwd: ROOT, encoding: "utf8" }).trim();

/** Same names the @carbon/angular generator skips (ADR 0015 §4). */
const NATIVE_DOM_EVENTS = new Set([
	"change", "input", "invalid", "focus", "blur", "focusin", "focusout", "click", "dblclick",
	"mousedown", "mouseup", "mouseover", "mouseout", "mousemove", "keydown", "keyup", "keypress",
	"submit", "reset", "scroll", "resize", "error", "load", "unload"
]);
/** Same as the @carbon/angular generator. */
const GENERATOR_IGNORED_PROPERTIES = new Set(["hasMainContent", "cardContext"]);
const VALUE_CHANGE_EVENT = /-(changed|selected|input)$/;
/** Same as the @carbon/angular generator's MANIFEST_TYPE_OVERRIDES: types the CEM gets wrong. */
const MANIFEST_TYPE_OVERRIDES = {
	"cds-checkbox.warnText": "string"
};

/** Split a TS type on top-level `|` (ignores `|` inside <>, (), {}). */
function splitUnion(type) {
	const parts = [];
	let depth = 0;
	let current = "";
	for (const ch of type || "") {
		if ("<({[".includes(ch)) depth++;
		if (">)}]".includes(ch)) depth--;
		if (ch === "|" && depth === 0) {
			parts.push(current.trim());
			current = "";
		} else {
			current += ch;
		}
	}
	if (current.trim()) parts.push(current.trim());
	return parts.filter(Boolean);
}

/** Named CCA types (type aliases and enums) -> their union, filled from compodoc below. */
const typeAliases = new Map();

/** Expand named aliases (`ButtonSize` -> `"sm" | "md" | …`), a few levels deep. */
function expandAliases(type, depth = 0) {
	if (!type || depth > 4) return type;
	return splitUnion(type).map((m) => (typeAliases.has(m) ? `(${expandAliases(typeAliases.get(m), depth + 1)})` : m)).join(" | ")
		.replace(/\(([^()]*)\)/g, "$1");
}

/** Describe a type so CCA and web component types can be compared. */
function describeType(type) {
	const members = splitUnion(expandAliases(type)).filter((m) => m !== "undefined" && m !== "null");
	const literals = members.filter((m) => /^(['"]).*\1$/.test(m)).map((m) => m.slice(1, -1));
	const named = members.filter((m) => !/^(['"]).*\1$/.test(m));
	const kinds = new Set();
	if (literals.length) kinds.add("string");
	for (const m of named) {
		if (/^string$/.test(m)) kinds.add("string");
		else if (/^boolean$/.test(m)) kinds.add("boolean");
		else if (/^number$/.test(m) || /^-?\d+(\.\d+)?$/.test(m)) kinds.add("number");
		else if (/TemplateRef/.test(m)) kinds.add("template");
		else if (/^[A-Z0-9_]+$/.test(m)) kinds.add("string"); // unresolved enum, string-valued
		else if (/^(any|unknown)$/.test(m)) kinds.add("any");
		else kinds.add("other");
	}
	return {
		raw: type || null,
		expanded: expandAliases(type) !== type ? expandAliases(type) : undefined,
		kinds: [...kinds].sort(),
		literals: literals.length ? literals.sort() : null,
		acceptsAnyString: named.includes("string")
	};
}

function compareTypes(cca, wc) {
	if (!cca.raw || !wc.raw) return { status: "unknown" };
	if (cca.kinds.includes("any") || wc.kinds.includes("any")) return { status: "compatible", note: "one side is any" };
	const ccaKinds = cca.kinds.filter((k) => k !== "template");
	const shared = ccaKinds.filter((k) => wc.kinds.includes(k));
	if (!shared.length) {
		// A named type compodoc could not expand (e.g. an imported Placement) is not proof of a mismatch.
		if (ccaKinds.includes("other") || wc.kinds.includes("other")) return { status: "unresolved" };
		return { status: "mismatch" };
	}
	if (cca.literals || wc.literals) {
		const ccaValues = cca.literals || [];
		const wcValues = wc.literals || [];
		const ccaOnly = cca.acceptsAnyString ? [] : ccaValues.filter((v) => !wcValues.includes(v) && !wc.acceptsAnyString);
		const wcOnly = wc.acceptsAnyString ? [] : wcValues.filter((v) => !ccaValues.includes(v) && !cca.acceptsAnyString);
		if (ccaOnly.length || wcOnly.length) {
			return { status: "values-differ", ccaOnlyValues: ccaOnly, wcOnlyValues: wcOnly };
		}
	}
	return { status: ccaKinds.length === wc.kinds.length ? "match" : "compatible" };
}

/** Edit distance, for rename suggestions. */
function levenshtein(a, b) {
	const row = Array.from({ length: b.length + 1 }, (_, i) => i);
	for (let i = 1; i <= a.length; i++) {
		let prev = row[0];
		row[0] = i;
		for (let j = 1; j <= b.length; j++) {
			const tmp = row[j];
			row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
			prev = tmp;
		}
	}
	return row[b.length];
}

const words = (name) => kebab(name.replace(/^cds-/, "")).split(/[-_]/).filter((w) => w.length > 2 && !["is", "has", "the"].includes(w));

/**
 * Unclaimed web component names that look like a CCA name: one contains the
 * other, a small edit distance, or a shared word. Suggestions only: never applied.
 */
function suggest(name, candidates) {
	const n = name.toLowerCase();
	const nWords = words(name);
	return candidates
		.map((c) => {
			const cLower = c.replace(/^cds-/, "").replace(/-/g, "").toLowerCase();
			let score = 0;
			if (cLower.includes(n) || n.includes(cLower)) score += 3;
			if (levenshtein(n, cLower) <= 2) score += 2;
			score += words(c).filter((w) => nWords.includes(w)).length;
			return { name: c, score };
		})
		.filter((c) => c.score > 0)
		.sort((a, b) => b.score - a.score)
		.slice(0, 3)
		.map((c) => c.name);
}

// ---------------------------------------------------------------------------
// 1 + 2. Web components: CEM, plus slots from source
// ---------------------------------------------------------------------------

const cem = JSON.parse(readFileSync(CEM, "utf8"));
const wcSourceCache = new Map();

function wcSource(modulePath) {
	if (!modulePath) return "";
	if (wcSourceCache.has(modulePath)) return wcSourceCache.get(modulePath);
	const file = join(WC_ROOT, modulePath.replace(/^es\//, "src/").replace(/\.js$/, ".ts"));
	const text = existsSync(file) ? readFileSync(file, "utf8") : "";
	wcSourceCache.set(modulePath, text);
	return text;
}

/** Slot names rendered in a source file: `<slot name="x">` and the default `<slot>`. */
function slotsInSource(text) {
	const names = new Set();
	for (const m of text.matchAll(/<slot\b([^>]*)>/g)) {
		const named = m[1].match(/\bname="([^"]*)"/);
		if (!named) names.add("");
		else if (!named[1].includes("$")) names.add(named[1]);
	}
	return names;
}

const declarationsByName = new Map();
for (const mod of cem.modules || []) {
	for (const d of mod.declarations || []) {
		if (d.name) declarationsByName.set(`${mod.path}#${d.name}`, d);
	}
}

const wcTags = new Map();
for (const mod of cem.modules || []) {
	for (const d of mod.declarations || []) {
		if (!d.tagName) continue;
		const members = new Map();
		for (const m of d.members || []) {
			if (m.kind !== "field" || members.has(m.name)) continue;
			members.set(m.name, m);
		}
		const props = [...members.values()]
			.filter((m) => !m.static && (m.privacy ?? "public") === "public" && !m.name.startsWith("_"))
			.map((m) => {
				const attr = (d.attributes || []).find((a) => a.fieldName === m.name);
				return {
					name: m.name,
					attribute: attr?.name ?? m.attribute ?? null,
					reflects: !!m.reflects,
					readonly: !!m.readonly,
					type: describeType(MANIFEST_TYPE_OVERRIDES[`${d.tagName}.${m.name}`] ?? m.type?.text),
					default: m.default ?? null,
					description: m.description || "",
					inheritedFrom: m.inheritedFrom?.name ?? null
				};
			});

		// Slots: CEM first, then the source of the class, its superclasses and mixins.
		const slots = new Map();
		for (const s of d.slots || []) {
			slots.set(s.name || "", { name: s.name || "", description: s.description || "", source: "cem" });
		}
		const sourceModules = new Set([mod.path]);
		let superRef = d.superclass;
		for (let guard = 0; superRef?.module && guard < 10; guard++) {
			sourceModules.add(superRef.module);
			superRef = declarationsByName.get(`${superRef.module}#${superRef.name}`)?.superclass;
		}
		for (const m of d.members || []) if (m.inheritedFrom?.module) sourceModules.add(m.inheritedFrom.module);
		for (const modulePath of sourceModules) {
			for (const name of slotsInSource(wcSource(modulePath))) {
				if (!slots.has(name)) slots.set(name, { name, description: "", source: "source" });
			}
		}

		wcTags.set(d.tagName, {
			tag: d.tagName,
			className: d.name,
			module: mod.path,
			description: d.description || d.summary || "",
			formAssociated: [...members.values()].some((m) => m.name === "formAssociated" && m.static),
			props,
			events: uniq((d.events || []).map((e) => e.name)).map((name) => {
				const e = d.events.find((x) => x.name === name);
				return { name, type: e.type?.text ?? null, description: e.description || "", inheritedFrom: e.inheritedFrom?.name ?? null };
			}),
			slots: [...slots.values()],
			cssParts: (d.cssParts || []).map((p) => p.name)
		});
	}
}

/** What the @carbon/angular generator (carbon/packages/angular/tasks/generate-wrappers) emits for a tag. */
function referenceGenerator(wc) {
	const inputs = wc.props
		.filter((p) => !p.readonly && !GENERATOR_IGNORED_PROPERTIES.has(p.name))
		.map((p) => p.name);
	const outputs = [];
	for (const e of wc.events) {
		if (NATIVE_DOM_EVENTS.has(e.name)) continue;
		let name = camel(e.name.replace(/^cds-/, ""));
		if (inputs.includes(name)) name = `${name}Change`;
		outputs.push({ event: e.name, output: name });
	}
	const cvaProp = !wc.formAssociated ? null : inputs.includes("checked") ? "checked" : inputs.includes("value") ? "value" : null;
	return {
		inputs,
		outputs,
		cva: cvaProp
			? { valueProperty: cvaProp, valueEvents: ["input", "change", ...outputs.map((o) => o.event).filter((e) => VALUE_CHANGE_EVENT.test(e))], touchedEvent: "focusout" }
			: null,
		slots: "none (template is <ng-content />; consumers set slot=\"…\" themselves)",
		twoWayBinding: "none (no xChange outputs are emitted)"
	};
}

// ---------------------------------------------------------------------------
// 3. CCA (current branch) from compodoc
// ---------------------------------------------------------------------------

const compodoc = JSON.parse(readFileSync(COMPODOC, "utf8"));
for (const t of compodoc.miscellaneous?.typealiases || []) if (t.rawtype) typeAliases.set(t.name, t.rawtype);
for (const e of compodoc.miscellaneous?.enumerations || []) {
	const values = (e.childs || []).map((c) => c.value).filter((v) => v !== undefined);
	if (values.length) typeAliases.set(e.name, values.map((v) => (typeof v === "number" ? "number" : `"${v}"`)).join(" | "));
}
const ccaClasses = [
	...compodoc.components.map((c) => ({ ...c, kind: "component" })),
	...compodoc.directives.map((c) => ({ ...c, kind: "directive" }))
];

function ccaInfo(c) {
	const template = c.template || "";
	const ngContent = [...template.matchAll(/<ng-content\b([^>]*)>/g)].map((m) => {
		const select = m[1].match(/select="([^"]*)"/);
		return select ? select[1] : "";
	});
	const providers = (c.providers || []).map((p) => p.name || "").join(" ");
	return {
		className: c.name,
		kind: c.kind,
		file: c.file,
		selectors: (c.selector || "").split(",").map((s) => s.trim()).filter(Boolean),
		extends: c.extends || [],
		inputs: (c.inputsClass || []).map((i) => ({
			name: i.name,
			type: describeType(i.type),
			default: i.defaultValue ?? null,
			required: !!i.required,
			deprecated: !!i.deprecated,
			description: stripHtml(i.description),
			inheritedFrom: i.inheritance?.file ?? null
		})),
		outputs: (c.outputsClass || []).map((o) => ({
			name: o.name,
			payload: (o.defaultValue || "").match(/EventEmitter<(.*)>\(/)?.[1] ?? null,
			deprecated: !!o.deprecated,
			description: stripHtml(o.description),
			inheritedFrom: o.inheritance?.file ?? null
		})),
		methods: (c.methodsClass || [])
			.filter((m) => !(m.modifierKind || []).some((k) => k === 123 || k === 124) && !/^ng[A-Z]/.test(m.name))
			.map((m) => ({
				name: m.name,
				args: (m.args || []).map((a) => `${a.name}${a.optional ? "?" : ""}: ${a.type ?? "any"}`).join(", "),
				returns: m.returnType ?? null,
				description: stripHtml(m.description),
				inheritedFrom: m.inheritance?.file ?? null
			})),
		cva: /NG_VALUE_ACCESSOR/.test(providers),
		validator: /NG_VALIDATORS/.test(providers),
		ngContent
	};
}

// ---------------------------------------------------------------------------
// Class -> tag resolution
// ---------------------------------------------------------------------------

const overrides = MAPPING.classToTag;
const slotDirectives = MAPPING.slotDirectives;

/**
 * Targets for a class: `[{ tag, when, set }]`. `when` is the legacy input value
 * that selects the tag (null = the default target); `set` are props the
 * wrapper must set on that tag (e.g. ComboBox multi -> filterable).
 */
function resolveTags(cca) {
	let targets = [];
	let via = null;
	if (cca.className in overrides) {
		via = overrides[cca.className] ? "mapping.json" : "mapping.json (no counterpart)";
		targets = (overrides[cca.className] || []).map((t) => (typeof t === "string" ? { tag: t } : t));
	} else {
		const direct = cca.selectors.find((s) => wcTags.has(s));
		if (direct) {
			targets = [{ tag: direct }];
			via = "selector";
		}
	}
	targets = targets
		.filter((t) => wcTags.has(t.tag))
		.map((t) => ({ tag: t.tag, when: t.when ?? null, set: t.set ?? null }));
	return { targets, tags: targets.map((t) => t.tag), via };
}

const generatorSkipped = new Set(MAPPING.generatorSkippedTags.tags);
const rewrites = MAPPING.rewrites;

// ---------------------------------------------------------------------------
// Comparison per (CCA class, tag)
// ---------------------------------------------------------------------------

const structuralPatterns = MAPPING.structuralTypePatterns.map((p) => new RegExp(p));
const angularOnly = new Set(MAPPING.angularOnlyInputs.names);
const aliases = MAPPING.renameCandidates;
const variantInputs = MAPPING.variantInputs;
const structuralInputs = MAPPING.structuralInputs;

/** The tag a variant input (skeleton / fluid) switches to, if it exists. */
function variantTag(inputName, tag) {
	const v = variantInputs[inputName];
	if (!v || typeof v !== "object" || !v.tag) return null;
	const candidate = v.tag.replace("{tag}", tag).replace("{stem}", tag.replace(/^cds-/, ""));
	return wcTags.has(candidate) ? { tag: candidate, when: { input: inputName, ...v.when } } : null;
}

/** The structural strategy for `Class.input`, with `sameAs` resolved. */
function structuralStrategy(key) {
	const s = structuralInputs.inputs[key];
	if (!s) return null;
	return s.sameAs ? { ...structuralInputs.inputs[s.sameAs], ...s, sameAs: undefined } : s;
}

/** Every element a renderChildren strategy renders: itself, its variants, and their children. */
function strategyParts(s) {
	const parts = [];
	const walk = (p) => {
		if (!p) return;
		if (p.tag) parts.push(p);
		walk(p.child);
		for (const v of Object.values(p.variants ?? {})) walk(v);
	};
	walk(s);
	return parts;
}

/** Every web component tag a strategy renders or targets. */
function strategyTags(s) {
	return uniq([...(s.tags ?? []), s.wrapper, ...strategyParts(s).map((p) => p.tag), ...(s.overflow?.tags ?? [])].filter(Boolean));
}

/** Variant tags referenced by CCA inputs: tag -> [{ class, input }], for unmatched.json. */
const variantRefs = new Map();
const structuralRefs = new Map();
const addRef = (map, tag, ref) => {
	const list = map.get(tag) ?? [];
	if (!list.some((r) => r.class === ref.class && r.input === ref.input)) list.push(ref);
	map.set(tag, list);
};

function compareInputs(cca, wc, targets) {
	const props = new Map(wc.props.map((p) => [p.name, p]));
	const slotNames = new Set(wc.slots.map((s) => s.name));

	const usedProps = new Set();
	const usedSlots = new Set();
	const rows = cca.inputs.map((input) => {
		const row = { name: input.name, cca: { type: input.type.raw, default: input.default, inheritedFrom: input.inheritedFrom, deprecated: input.deprecated }, wc: null, slot: null };
		const alias = aliases[input.name] || {};
		const acceptsTemplate = input.type.kinds.includes("template");

		// Property mapping: exact, alias, attribute / case-insensitive.
		let prop = null;
		let via = null;
		if (props.has(input.name)) {
			prop = props.get(input.name);
			via = "exact";
		} else {
			const candidate = (alias.props || []).find((p) => props.has(p));
			if (candidate) {
				prop = props.get(candidate);
				via = "alias";
			} else {
				prop = wc.props.find((p) => p.attribute === kebab(input.name) || p.name.toLowerCase() === input.name.toLowerCase()) || null;
				if (prop) via = "attribute";
			}
		}

		// Slot mapping, for inputs that accept a TemplateRef (or have a slot alias and no prop).
		let slot = null;
		let slotVia = null;
		if (acceptsTemplate || (!prop && alias.slots)) {
			slot = [kebab(input.name), ...(alias.slots || [])].find((s) => slotNames.has(s)) ?? null;
			if (slot) slotVia = slot === kebab(input.name) ? "exact" : "alias";
		}

		if (prop) {
			usedProps.add(prop.name);
			row.wc = { prop: prop.name, attribute: prop.attribute, type: prop.type.raw, default: prop.default, reflects: prop.reflects, via };
			row.typeCheck = compareTypes(input.type, prop.type);
		}
		if (slot !== null) {
			usedSlots.add(slot);
			row.slot = { name: slot, via: slotVia };
		}

		// Inputs that select another tag: skeleton / fluid variants, or a class target's `when` (Dropdown type="multi").
		const selects = [];
		const variant = variantTag(input.name, wc.tag);
		if (variant) selects.push(variant);
		for (const t of targets) if (t.when?.input === input.name) selects.push({ tag: t.tag, when: t.when, set: t.set });

		// Model-driven inputs: their strategy (renderChildren / adapter / rewrite) and the tags involved.
		const strategy = structuralStrategy(`${cca.className}.${input.name}`);
		const childTags = strategy ? strategyTags(strategy) : null;
		const structural = strategy || (!angularOnly.has(input.name) && (structuralInputs.names[input.name] || structuralPatterns.some((re) => re.test(input.type.raw || ""))))
			? (structuralInputs.names[input.name] ?? `Type ${input.type.raw} is model-driven. Web components use child elements.`)
			: null;

		// A class target's `when` always wins; a skeleton/fluid variant yields to a same-named prop.
		const selectsWins = selects.some((s) => s !== variant) || (variant && via !== "exact");
		if (selectsWins) {
			if (prop) row.note = `<${wc.tag}> also has [${prop.name}] (${prop.type.raw}); the legacy values select a tag instead`;
			row.status = "selects-tag";
			row.selects = selects;
			row.action = selects.map((s) => `${input.name}${s.when.equals === true ? "" : `="${s.when.equals}"`} -> <${s.tag}>${s.set ? ` with ${JSON.stringify(s.set)}` : ""}`).join("; ");
			if (variant) addRef(variantRefs, variant.tag, { class: cca.className, input: input.name });
		} else if (prop && slot !== null) {
			row.status = "prop+slot";
			row.action = `string -> [${prop.name}]; TemplateRef -> slot="${slot}" via cdsSlot`;
		} else if (slot !== null) {
			row.status = "slot";
			row.action = `TemplateRef/content -> slot="${slot}" via cdsSlot`;
		} else if (prop) {
			row.status = prop.name === input.name ? "match" : "rename";
			row.action = prop.name === input.name ? "passthrough" : `bind host [${prop.name}] from input ${input.name}; deprecate ${input.name} in favour of ${prop.name}`;
			if (row.typeCheck?.status === "mismatch") row.status = "type-mismatch";
			if (acceptsTemplate) row.action += `; TemplateRef has no slot on ${wc.tag}`;
		} else if (structural) {
			row.status = strategy?.kind === "renderChildren" ? "render-children" : strategy?.kind === "adapter" ? "adapter" : "structural";
			row.action = strategy?.kind === "renderChildren"
				? `render <${strategyParts(strategy).map((p) => p.tag).join("> / <")}> children from ${input.name}${strategy.recursive ? ` (recursive: ${strategy.recursive})` : ""}; <ng-content> still projected`
				: strategy?.kind === "adapter"
					? `map ${input.name} fields onto ${Object.keys(strategy.props).map((p) => `[${p}]`).join(", ")}`
					: structural;
			if (strategy) row.strategy = strategy;
			if (childTags) row.childTags = childTags.filter((t) => wcTags.has(t));
		} else if (angularOnly.has(input.name)) {
			row.status = "angular-only";
			row.action = "keep on the wrapper (Angular integration)";
		} else {
			row.status = "cca-only";
			row.action = `no web component counterpart: deprecate ${input.name}, or request it in @carbon/web-components`;
		}
		return row;
	});

	const wcOnly = wc.props
		.filter((p) => !usedProps.has(p.name) && !p.readonly && !GENERATOR_IGNORED_PROPERTIES.has(p.name))
		.map((p) => ({ prop: p.name, attribute: p.attribute, type: p.type.raw, default: p.default, inheritedFrom: p.inheritedFrom }));

	// Rename candidates for unmatched inputs, from props nothing claimed.
	const freeProps = wcOnly.map((p) => p.prop);
	for (const row of rows) {
		if (row.status !== "cca-only") continue;
		const s = suggest(row.name, freeProps);
		if (s.length) row.suggestions = s;
	}
	return { rows, wcOnly, usedSlots };
}

function compareOutputs(cca, wc, inputRows) {
	const generated = referenceGenerator(wc).outputs;
	const events = new Set(wc.events.map((e) => e.name));
	const inputByName = new Map(inputRows.map((r) => [r.name, r]));
	const usedEvents = new Set();
	const tagStem = wc.tag.replace(/^cds-/, "");

	const rows = cca.outputs.map((output) => {
		const row = { name: output.name, cca: { payload: output.payload, inheritedFrom: output.inheritedFrom, deprecated: output.deprecated } };
		const twoWayInput = output.name.endsWith("Change") ? inputByName.get(output.name.slice(0, -"Change".length)) : null;

		let event = null;
		let via = null;
		if (NATIVE_DOM_EVENTS.has(output.name)) {
			event = output.name;
			via = "native";
		} else {
			// cds-<tag>-<name>, cds-<tag>-<name>ed, or the generator's camelCase output name.
			const stem = kebab(output.name.replace(/Change$/, ""));
			const candidates = [`cds-${tagStem}-${stem}`, `cds-${tagStem}-${stem}ed`, `cds-${tagStem}-${stem}d`, `cds-${stem}`];
			event = candidates.find((c) => events.has(c)) ?? generated.find((g) => g.output === output.name)?.event ?? null;
			if (event) via = "name";
		}
		if (event) usedEvents.add(event);

		row.wc = event ? { event, via, generatorOutput: generated.find((g) => g.event === event)?.output ?? (NATIVE_DOM_EVENTS.has(event) ? "(native, no @Output)" : null) } : null;

		if (twoWayInput) {
			const wcProp = twoWayInput.wc?.prop ?? null;
			const propInfo = wcProp ? wc.props.find((p) => p.name === wcProp) : null;
			// A matched event first, then the tag's only value event, then the reflected attribute.
			const valueEvents = wc.events.map((e) => e.name).filter((e) => /-(changed|selected|toggled|input)$/.test(e) || e === "change" || e === "input");
			const sourceEvent = event ?? (valueEvents.length === 1 ? valueEvents[0] : null);
			let strategy = null;
			if (sourceEvent) strategy = { kind: "hostListener", event: sourceEvent, via: event ? via : "single value event" };
			else if (propInfo?.reflects) strategy = { kind: "observeAttributes", attributes: [propInfo.attribute], via: "reflected attribute" };
			if (strategy?.kind === "hostListener") usedEvents.add(strategy.event);

			row.twoWay = {
				input: twoWayInput.name,
				wcProp,
				wcReflects: propInfo?.reflects ?? null,
				eventCandidates: valueEvents,
				strategy,
				// The input wins while set; unset, the web component keeps its own state.
				proposed: wcProp && strategy ? {
					host: {
						[`[${wcProp}]`]: `${twoWayInput.name} ?? element.${wcProp}`,
						...(strategy.kind === "hostListener" ? { [`(${strategy.event})`]: `${twoWayInput.name} = element.${wcProp}; ${output.name}.emit(element.${wcProp})` } : {})
					},
					...(strategy.kind === "observeAttributes" ? { constructor: `observeAttributes(this.element, ${JSON.stringify(strategy.attributes)}, () => { if (this.element.${wcProp} !== this.${twoWayInput.name}) { this.${twoWayInput.name} = this.element.${wcProp}; this.${output.name}.emit(this.element.${wcProp}); } })` } : {})
				} : null,
				referenceGenerator: generated.some((g) => g.output === output.name) ? "emits it" : "missing: generator emits no xChange output"
			};
			row.status = row.twoWay.proposed ? "two-way" : "two-way-unresolved";
			row.action = row.twoWay.proposed ? `[(${twoWayInput.name})]: see twoWay.proposed` : `[(${twoWayInput.name})] has no web component prop or event to drive it`;
		} else if (event && via === "native") {
			row.status = "native";
			row.action = `native ${event} bubbles from the host; drop the @Output (ADR 0015 §4 double-call), consumers keep (${event})`;
		} else if (event) {
			const generatorName = row.wc.generatorOutput;
			row.status = generatorName === output.name ? "match" : "rename";
			row.action = generatorName === output.name ? "passthrough" : `host listener (${event}) -> ${output.name}.emit(...); generator would name it ${generatorName}`;
		} else {
			row.status = "cca-only";
			row.action = `no web component event: deprecate ${output.name}, or emit it from the wrapper`;
		}
		return row;
	});

	const wcOnly = wc.events
		.filter((e) => !usedEvents.has(e.name))
		.map((e) => ({ event: e.name, generatorOutput: generated.find((g) => g.event === e.name)?.output ?? "(native, no @Output)", description: e.description }));

	// Candidate events for unmatched outputs, from events nothing claimed.
	const freeEvents = wcOnly.map((e) => e.event).filter((e) => !NATIVE_DOM_EVENTS.has(e));
	for (const row of rows) {
		if (row.status !== "cca-only" && row.status !== "two-way-unresolved") continue;
		const s = suggest(row.name.replace(/Change$/, ""), freeEvents.map((e) => e.replace(`cds-${tagStem}-`, "cds-")))
			.map((short) => freeEvents.find((e) => e.replace(`cds-${tagStem}-`, "cds-") === short));
		if (s.length) row.suggestions = s;
	}
	return { rows, wcOnly };
}

function compareForms(cca, wc, outputRows) {
	const gen = referenceGenerator(wc).cva;
	const twoWay = outputRows.find((r) => r.twoWay && ["value", "checked", "selected"].includes(r.twoWay.input));
	return {
		ccaControlValueAccessor: cca.cva,
		ccaValidator: cca.validator,
		wcFormAssociated: wc.formAssociated,
		referenceGeneratorCva: gen,
		status: cca.cva && gen ? "match" : cca.cva && !gen ? "cca-only: wrapper must implement CVA by hand" : !cca.cva && gen ? "wc-only: generator adds CVA" : "none",
		valueProperty: gen?.valueProperty ?? twoWay?.twoWay.wcProp ?? null,
		valueEvents: gen?.valueEvents ?? (twoWay?.twoWay.strategy?.event ? [twoWay.twoWay.strategy.event] : [])
	};
}

function compareContent(cca, wc, usedSlots) {
	const rows = [];
	const slotNames = new Set(wc.slots.map((s) => s.name));
	for (const select of cca.ngContent) {
		if (!select) {
			rows.push({ ngContent: "(default)", slot: slotNames.has("") ? "(default)" : null, status: slotNames.has("") ? "match" : "no-default-slot" });
			usedSlots.add("");
			continue;
		}
		const parts = select.split(",").map((p) => p.trim()).filter(Boolean);

		// 1. A content-marker directive we know (mapping.json slotDirectives).
		const directive = parts.map((p) => selectorOwner.get(p)).find((owner) => slotDirectives[owner]?.parent === wc.tag);
		if (directive) {
			const sd = slotDirectives[directive];
			if (sd.slot !== null) usedSlots.add(sd.slot);
			rows.push({ ngContent: select, slot: sd.slot === "" ? "(default)" : sd.slot, status: sd.slot !== null ? "slot-directive" : "manual", action: sd.slot !== null ? `${directive} -> ${sd.slot === "" ? "default slot" : `slot="${sd.slot}"`}` : sd.note });
			continue;
		}
		// 2. Child elements that are (or map to) web components: they go in the default slot.
		const childTags = uniq(parts.flatMap((p) => (wcTags.has(p) ? [p] : selectorTags.get(p) ?? [])));
		if (childTags.length && !childTags.includes(wc.tag)) {
			usedSlots.add("");
			rows.push({ ngContent: select, slot: "(default)", status: "child-element", childTags, action: `children become <${childTags.join("> / <")}> in the default slot` });
			continue;
		}
		// 3. Native controls / directives the web component now renders itself.
		if (childTags.includes(wc.tag) || parts.some((p) => /^(input|textarea|select)\b/.test(p))) {
			rows.push({ ngContent: select, slot: null, status: "rendered-by-wc", action: `<${wc.tag}> renders this itself; drop the projected element` });
			continue;
		}
		// 4. A slot named like the selector's tail, e.g. [cdsTagIcon] -> icon.
		const tails = parts.map((p) => kebab(p.replace(/[[\].]/g, "").replace(/^(cds|ibm)/, "")).replace(/^-/, ""));
		const guess = [...slotNames].find((s) => s && tails.some((t) => t === s || t.endsWith(`-${s}`))) ?? null;
		if (guess !== null) usedSlots.add(guess);
		rows.push({ ngContent: select, slot: guess, status: guess !== null ? "guess" : "manual", action: guess !== null ? `consumer content -> slot="${guess}"` : "no matching slot; map by hand" });
	}
	return {
		ngContent: rows,
		wcSlots: wc.slots.map((s) => ({ ...s, name: s.name || "(default)", mapped: usedSlots.has(s.name) }))
	};
}

/** Public CCA methods have no web component counterpart unless a same-named public method exists. */
function compareMethods(cca, wc) {
	const wcDecl = [...declarationsByName.values()].find((d) => d.tagName === wc.tag);
	const wcMethods = new Set((wcDecl?.members || []).filter((m) => m.kind === "method" && (m.privacy ?? "public") === "public" && !m.static).map((m) => m.name));
	return cca.methods.map((m) => ({
		...m,
		status: wcMethods.has(m.name) ? "match" : "cca-only",
		action: wcMethods.has(m.name) ? "passthrough: call el." + m.name : `no web component method: derive it on the wrapper, or deprecate ${m.name}()`
	}));
}

function readiness(inputs, outputs, forms, targets, cca) {
	const reasons = [];
	const count = (rows, status) => rows.filter((r) => r.status === status).length;
	if (rewrites[cca.className]) return { level: "rewrite", reasons: [rewrites[cca.className]] };
	if (targets.some((t) => generatorSkipped.has(t.tag))) reasons.push("the @carbon/angular generator skips this tag (ADR 0021)");
	if (targets.filter((t) => !t.when).length > 1) reasons.push("one CCA class spans several tags with no input to choose between them");
	if (count(inputs, "structural")) reasons.push(`${count(inputs, "structural")} model-driven input(s)`);
	if (count(outputs, "two-way-unresolved")) reasons.push("two-way binding with no web component source");
	if (forms.status.startsWith("cca-only")) reasons.push("CVA not provided by the generator");
	if (reasons.length) return { level: "manual", reasons };
	const needs = [];
	for (const status of ["rename", "type-mismatch", "slot", "prop+slot", "render-children", "adapter", "cca-only", "selects-tag"]) {
		const n = count(inputs, status);
		if (n) needs.push(`${n} input(s) ${status}`);
	}
	for (const status of ["two-way", "rename", "cca-only", "native"]) {
		const n = count(outputs, status);
		if (n) needs.push(`${n} output(s) ${status}`);
	}
	return needs.length ? { level: "overrides", reasons: needs } : { level: "auto", reasons: [] };
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

// Structural strategies from mapping.json: validate them against the CEM and record which
// web component tags each legacy input leads to (compared or not, e.g. DropdownList).
const warn = (msg) => console.warn(`mapping.json structuralInputs: ${msg}`);
const propsOf = (tag) => new Set(wcTags.get(tag)?.props.map((p) => p.name) ?? []);
const eventsOf = (tag) => new Set(wcTags.get(tag)?.events.map((e) => e.name) ?? []);
for (const [key, raw] of Object.entries(structuralInputs.inputs)) {
	const [className, inputName] = key.split(".");
	const c = ccaClasses.find((x) => x.name === className);
	if (!c || !(c.inputsClass || []).some((i) => i.name === inputName)) {
		warn(`${key} is not an input on the current branch`);
		continue;
	}
	const s = structuralStrategy(key);
	for (const t of strategyTags(s)) {
		if (wcTags.has(t)) addRef(structuralRefs, t, { class: className, input: inputName, kind: s.kind });
		else warn(`${key}: <${t}> is not a web component tag`);
	}
	if (s.kind === "renderChildren" || s.kind === "adapter") {
		for (const part of strategyParts(s)) {
			for (const p of Object.keys(part.itemMap ?? {})) if (!propsOf(part.tag).has(p)) warn(`${key}: <${part.tag}> has no prop ${p}`);
			for (const e of Object.keys(part.events ?? {})) if (!NATIVE_DOM_EVENTS.has(e) && !eventsOf(part.tag).has(e)) warn(`${key}: <${part.tag}> has no event ${e}`);
			for (const slot of Object.keys(part.slots ?? {})) if (!wcTags.get(part.tag)?.slots.some((x) => x.name === slot)) warn(`${key}: <${part.tag}> has no slot ${slot}`);
		}
	}
	if (s.kind === "adapter") {
		const hostTags = resolveTags(ccaInfo(c)).tags;
		for (const tag of hostTags) {
			for (const p of Object.keys(s.props)) if (!propsOf(tag).has(p)) warn(`${key}: <${tag}> has no prop ${p}`);
			for (const e of Object.keys(s.events ?? {})) if (!eventsOf(tag).has(e)) warn(`${key}: <${tag}> has no event ${e}`);
		}
	}
}

/** Every CCA selector part -> its class, and -> the web component tags that class maps to. */
const selectorOwner = new Map();
const selectorTags = new Map();
for (const c of ccaClasses) {
	const info = ccaInfo(c);
	const tags = slotDirectives[info.className] ? [] : resolveTags(info).tags;
	for (const s of info.selectors) {
		selectorOwner.set(s, info.className);
		if (tags.length) selectorTags.set(s, tags);
	}
}

const components = [];
const ccaUnmatched = [];
const slotDirectiveRows = [];
const matchedTags = new Set();

for (const c of ccaClasses) {
	const cca = ccaInfo(c);

	if (slotDirectives[cca.className]) {
		const sd = slotDirectives[cca.className];
		const parent = wcTags.get(sd.parent);
		const exists = sd.slot === null ? null : !!parent?.slots.some((s) => s.name === sd.slot);
		const action = sd.slot === null
			? sd.note
			: sd.slot === ""
				? `keep ${cca.selectors[0]} as a no-op directive: its content goes in the default slot of <${sd.parent}>`
				: `keep ${cca.selectors[0]} as a directive with host: { slot: "${sd.slot}" } inside <${sd.parent}>`;
		slotDirectiveRows.push({ ccaClass: cca.className, selectors: cca.selectors, file: cca.file, parent: sd.parent, slot: sd.slot, slotVerified: exists, note: sd.note ?? null, action });
		continue;
	}

	if (!cca.selectors.length) {
		ccaUnmatched.push({ ccaClass: cca.className, file: cca.file, reason: "base class (no selector); its inputs are folded into subclasses" });
		continue;
	}

	const { targets, via } = resolveTags(cca);
	if (!targets.length) {
		ccaUnmatched.push({ ccaClass: cca.className, selectors: cca.selectors, file: cca.file, reason: MAPPING.unmappedReasons[cca.className] ?? "no web component tag found; add it to mapping.json", keep: MAPPING.angularOnlyFallback[cca.className] ?? null });
		continue;
	}

	for (const target of targets) {
		const tag = target.tag;
		matchedTags.add(tag);
		const wc = wcTags.get(tag);
		const { rows: inputRows, wcOnly: wcOnlyProps, usedSlots } = compareInputs(cca, wc, targets);
		const { rows: outputRows, wcOnly: wcOnlyEvents } = compareOutputs(cca, wc, inputRows);
		const forms = compareForms(cca, wc, outputRows);
		const content = compareContent(cca, wc, usedSlots);
		components.push({
			ccaClass: cca.className,
			ccaKind: cca.kind,
			ccaSelectors: cca.selectors,
			ccaFile: cca.file,
			wcTag: tag,
			when: target.when,
			set: target.set,
			wcClass: wc.className,
			wcModule: wc.module,
			matchedVia: via,
			rewrite: rewrites[cca.className] ?? null,
			generatorSkipped: generatorSkipped.has(tag),
			selectorChange: cca.kind === "directive" || !cca.selectors.includes(tag) ? `${cca.selectors.join(", ")} -> ${tag}` : null,
			// element: the schematic swaps the element (directive on a native element, or a renamed tag); none: same tag.
			selectorMigration: cca.kind === "directive" ? "element" : cca.selectors.includes(tag) ? "none" : "rename",
			routerLink: wc.props.some((p) => p.name === "href") ? { activeProp: MAPPING.router.activeProps.find((p) => wc.props.some((x) => x.name === p)) ?? null } : null,
			angularOnlyFallback: MAPPING.angularOnlyFallback[cca.className] ?? null,
			readiness: readiness(inputRows, outputRows, forms, targets, cca),
			inputs: inputRows,
			wcOnlyProps,
			outputs: outputRows,
			wcOnlyEvents,
			methods: compareMethods(cca, wc),
			forms,
			content,
			referenceGenerator: referenceGenerator(wc)
		});
	}
}

for (const r of slotDirectiveRows) matchedTags.add(r.parent);

/** es/components/<dir>/… -> <dir>; tags in a folder CCA already maps to are subparts of that component. */
const folderOf = (modulePath) => modulePath.replace(/^es\/components\//, "").split("/")[0];
const matchedFolders = new Set([...matchedTags].map((t) => folderOf(wcTags.get(t).module)));

function categorize(w) {
	if (/-skeleton$/.test(w.tag)) return "skeleton";
	if (/^cds-fluid-/.test(w.tag)) return "fluid";
	if (structuralRefs.has(w.tag) || matchedFolders.has(folderOf(w.module))) return "subpart";
	return "new";
}

const wcUnmatched = [...wcTags.values()]
	.filter((w) => !matchedTags.has(w.tag))
	.map((w) => ({
		wcTag: w.tag,
		category: categorize(w),
		module: w.module,
		replaces: [...(variantRefs.get(w.tag) ?? []), ...(structuralRefs.get(w.tag) ?? [])],
		generatorSkipped: generatorSkipped.has(w.tag),
		props: w.props.length,
		events: w.events.length,
		slots: w.slots.map((s) => s.name || "(default)")
	}));

const tally = (list, key) => list.reduce((acc, x) => ({ ...acc, [key(x)]: (acc[key(x)] ?? 0) + 1 }), {});
const allInputs = components.flatMap((c) => c.inputs);
const allOutputs = components.flatMap((c) => c.outputs);

const result = {
	$schema: "./README.md#output-schema",
	generatedAt: new Date().toISOString(),
	sources: {
		cem: CEM,
		compodoc: COMPODOC,
		ccaBranch: git("rev-parse --abbrev-ref HEAD"),
		ccaCommit: git("rev-parse --short HEAD"),
		referenceGenerator: "carbon/packages/angular/tasks/generate-wrappers/index.js (simulated)"
	},
	summary: {
		wcTags: wcTags.size,
		ccaClasses: ccaClasses.length,
		comparedPairs: components.length,
		ccaUnmatched: ccaUnmatched.length,
		wcUnmatched: wcUnmatched.length,
		slotDirectives: slotDirectiveRows.length,
		readiness: tally(components, (c) => c.readiness.level),
		inputStatus: tally(allInputs, (r) => r.status),
		outputStatus: tally(allOutputs, (r) => r.status),
		methods: tally(components.flatMap((c) => c.methods), (m) => m.status),
		matchedVia: tally(components, (c) => c.matchedVia),
		routerLinkTags: [...wcTags.values()].filter((w) => w.props.some((p) => p.name === "href")).map((w) => w.tag),
		selectorMigration: tally(components, (c) => c.selectorMigration),
		slotsFromSourceOnly: [...wcTags.values()].reduce((n, w) => n + w.slots.filter((s) => s.source === "source").length, 0)
	},
	components,
	slotDirectives: slotDirectiveRows,
	unmatched: { cca: ccaUnmatched, wc: wcUnmatched }
};

writeFileSync(OUT, `${JSON.stringify(result, null, "\t")}\n`);
console.log(`Wrote ${OUT}`);

// unmatched.json: both sides, keyed by name, for curation.
const byCategory = (cat) => wcUnmatched.filter((w) => w.category === cat);
const unmatched = {
	generatedAt: result.generatedAt,
	summary: {
		wc: tally(wcUnmatched, (w) => w.category),
		wcReferencedByLegacyInputs: wcUnmatched.filter((w) => w.replaces.length).length,
		cca: ccaUnmatched.length,
		ccaRewrites: Object.keys(rewrites).filter((k) => k !== "$comment").length
	},
	wc: Object.fromEntries(["skeleton", "fluid", "subpart", "new"].map((cat) => [
		cat,
		Object.fromEntries(byCategory(cat).map(({ wcTag, category, ...rest }) => [wcTag, rest]))
	])),
	cca: Object.fromEntries(ccaUnmatched.map(({ ccaClass, ...rest }) => [ccaClass, rest]))
};
const UNMATCHED_OUT = join(dirname(OUT), "unmatched.json");
writeFileSync(UNMATCHED_OUT, `${JSON.stringify(unmatched, null, "\t")}\n`);
console.log(`Wrote ${UNMATCHED_OUT}`);
console.log(JSON.stringify({ ...result.summary, unmatched: unmatched.summary }, null, 2));
