import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import type { AstroIntegration } from 'astro';

/** After each build, list the content files still marked `placeholder: true`. */
export default function placeholderReport(): AstroIntegration {
  return {
    name: 'placeholder-report',
    hooks: {
      'astro:build:done': async ({ logger }) => {
        const root = join(process.cwd(), 'src/content');
        const files = (await readdir(root, { recursive: true }))
          .filter((f) => /\.(md|ya?ml)$/.test(f))
          .sort();
        const drafts: string[] = [];
        for (const f of files) {
          const text = await readFile(join(root, f), 'utf8');
          if (/^placeholder:\s*true\s*$/m.test(text))
            drafts.push(relative(process.cwd(), join(root, f)));
        }
        if (drafts.length === 0) return logger.info('No placeholder content left.');
        logger.warn(`${drafts.length} content files are still placeholders (awaiting approval):`);
        for (const d of drafts) logger.warn(`  ${d}`);
      },
    },
  };
}
