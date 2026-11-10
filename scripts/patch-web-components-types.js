/**
 * Patches @carbon/web-components declaration files that use the ES2022
 * `accessor` keyword, which the TypeScript version pinned by Angular 14
 * (4.6.x) cannot parse (TS1434).
 *
 * The keyword only affects the *type* declarations — stripping it changes
 * nothing at runtime. Remove this script once the workspace is on
 * TypeScript >= 4.9.
 *
 * Wired into `postinstall` so fresh installs stay patched.
 */
const fs = require("fs");
const path = require("path");

const files = [
	"node_modules/@carbon/web-components/es/components/dropdown/dropdown.d.ts"
];

for (const file of files) {
	const fullPath = path.resolve(__dirname, "..", file);
	if (!fs.existsSync(fullPath)) {
		continue;
	}
	const content = fs.readFileSync(fullPath, "utf8");
	// `accessor value: string;` → `value: string;`
	const patched = content.replace(/^(\s*)accessor\s+/gm, "$1");
	if (patched !== content) {
		fs.writeFileSync(fullPath, patched);
		console.log(`[patch-web-components-types] patched ${file}`);
	}
}
