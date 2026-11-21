// Rewrites the .ts extensions of relative imports in the generated declaration files to .js.
// TypeScript rewrites them in the JavaScript files (rewriteRelativeImportExtensions), but keeps them in the
// declaration files, which TypeScript versions before 5.0 cannot resolve.
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const distDir = fileURLToPath(new URL('../dist', import.meta.url))
const relativeTsImport =
	/((?:from|import\()\s*['"])(\.{1,2}\/[^'"]+)\.ts(['"])/g

for (const entry of await readdir(distDir, { recursive: true })) {
	if (!entry.endsWith('.d.ts')) continue

	const file = join(distDir, entry)
	const content = await readFile(file, 'utf8')
	const fixedContent = content.replace(relativeTsImport, '$1$2.js$3')

	if (fixedContent !== content) {
		await writeFile(file, fixedContent)
	}
}
