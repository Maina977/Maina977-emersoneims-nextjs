
/**
 * Media Resolution Audit
 * - Scans local images in /public and reports true pixel dimensions.
 * - Helps identify which assets are truly 4K (>= 3840x2160) vs below.
 */

const fs = require('fs');
const path = require('path');

let sharp;
try {
	sharp = require('sharp');
} catch {
	console.error('Missing dependency: sharp. Install it or run `npm i -D sharp`.');
	process.exit(1);
}

const workspaceRoot = process.cwd();
const publicDir = path.join(workspaceRoot, 'public');

const imageExts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg', '.ico']);
const videoExts = new Set(['.mp4', '.webm', '.mov', '.avi', '.mkv', '.m4v', '.ogg']);

function walk(dir) {
	const out = [];
	if (!fs.existsSync(dir)) return out;

	const entries = fs.readdirSync(dir, { withFileTypes: true });
	for (const entry of entries) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git') continue;
			out.push(...walk(full));
		} else if (entry.isFile()) {
			out.push(full);
		}
	}
	return out;
}

function toPublicUrl(absPath) {
	const rel = path.relative(publicDir, absPath).split(path.sep).join('/');
	return '/' + rel;
}

function is4k(width, height) {
	// Accept either orientation
	return (width >= 3840 && height >= 2160) || (width >= 2160 && height >= 3840);
}

function fmtBytes(bytes) {
	if (bytes < 1024) return `${bytes} B`;
	const kb = bytes / 1024;
	if (kb < 1024) return `${kb.toFixed(1)} KB`;
	const mb = kb / 1024;
	if (mb < 1024) return `${mb.toFixed(2)} MB`;
	const gb = mb / 1024;
	return `${gb.toFixed(2)} GB`;
}

async function main() {
	if (!fs.existsSync(publicDir)) {
		console.error('No public/ directory found.');
		process.exit(1);
	}

	const files = walk(publicDir);

	const images = [];
	const videos = [];

	for (const abs of files) {
		const ext = path.extname(abs).toLowerCase();
		if (imageExts.has(ext)) {
			const stat = fs.statSync(abs);
			const url = toPublicUrl(abs);

			if (ext === '.svg' || ext === '.ico') {
				images.push({
					url,
					file: abs,
					ext,
					bytes: stat.size,
					width: null,
					height: null,
					megapixels: null,
					is4k: null,
					note: ext === '.svg' ? 'vector' : 'icon',
				});
				continue;
			}

			try {
				const meta = await sharp(abs).metadata();
				const width = meta.width ?? null;
				const height = meta.height ?? null;
				const megapixels =
					width && height ? Number(((width * height) / 1_000_000).toFixed(2)) : null;

				images.push({
					url,
					file: abs,
					ext,
					bytes: stat.size,
					width,
					height,
					megapixels,
					is4k: width && height ? is4k(width, height) : null,
					note: null,
				});
			} catch (e) {
				images.push({
					url,
					file: abs,
					ext,
					bytes: stat.size,
					width: null,
					height: null,
					megapixels: null,
					is4k: null,
					note: `sharp-error: ${e?.message || String(e)}`,
				});
			}
		} else if (videoExts.has(ext)) {
			const stat = fs.statSync(abs);
			videos.push({
				url: toPublicUrl(abs),
				file: abs,
				ext,
				bytes: stat.size,
			});
		}
	}

	images.sort((a, b) => (b.megapixels ?? 0) - (a.megapixels ?? 0));
	videos.sort((a, b) => b.bytes - a.bytes);

	const report = {
		generatedAt: new Date().toISOString(),
		counts: {
			images: images.length,
			videos: videos.length,
			images4k: images.filter((i) => i.is4k === true).length,
			imagesBelow4k: images.filter((i) => i.is4k === false).length,
			imagesUnknown: images.filter((i) => i.is4k === null).length,
		},
		images,
		videos,
	};

	const outJson = path.join(workspaceRoot, 'MEDIA_RESOLUTION_REPORT.json');
	fs.writeFileSync(outJson, JSON.stringify(report, null, 2), 'utf8');

	const top = images.slice(0, 30);
	const fourK = images.filter((i) => i.is4k === true);

	const mdLines = [];
	mdLines.push('# Media Resolution Report');
	mdLines.push('');
	mdLines.push(`Generated: ${report.generatedAt}`);
	mdLines.push('');
	mdLines.push('## Summary');
	mdLines.push(`- Images scanned: ${report.counts.images}`);
	mdLines.push(`- Videos scanned: ${report.counts.videos}`);
	mdLines.push(`- True 4K images (>=3840x2160): ${report.counts.images4k}`);
	mdLines.push(`- Below 4K images: ${report.counts.imagesBelow4k}`);
	mdLines.push(`- Unknown (svg/ico/errors): ${report.counts.imagesUnknown}`);
	mdLines.push('');

	mdLines.push('## Top images by pixel count');
	mdLines.push('| URL | Dimensions | MP | Size | 4K |');
	mdLines.push('|---|---:|---:|---:|---:|');
	for (const img of top) {
		const dims =
			img.width && img.height ? `${img.width}x${img.height}` : img.note || 'unknown';
		const mp = img.megapixels != null ? img.megapixels : '';
		const ok = img.is4k === true ? 'yes' : img.is4k === false ? 'no' : '';
		mdLines.push(`| ${img.url} | ${dims} | ${mp} | ${fmtBytes(img.bytes)} | ${ok} |`);
	}
	mdLines.push('');

	mdLines.push('## 4K-capable images');
	if (fourK.length === 0) {
		mdLines.push('- None detected in public/ (based on image pixel dimensions).');
	} else {
		mdLines.push('| URL | Dimensions | MP | Size |');
		mdLines.push('|---|---:|---:|---:|');
		for (const img of fourK) {
			mdLines.push(
				`| ${img.url} | ${img.width}x${img.height} | ${img.megapixels ?? ''} | ${fmtBytes(img.bytes)} |`
			);
		}
	}
	mdLines.push('');

	mdLines.push('## Largest videos by size');
	mdLines.push('| URL | Size |');
	mdLines.push('|---|---:|');
	for (const v of videos.slice(0, 20)) {
		mdLines.push(`| ${v.url} | ${fmtBytes(v.bytes)} |`);
	}
	mdLines.push('');

	const outMd = path.join(workspaceRoot, 'MEDIA_RESOLUTION_REPORT.md');
	fs.writeFileSync(outMd, mdLines.join('\n'), 'utf8');

	console.log(`Wrote ${path.relative(workspaceRoot, outJson)}`);
	console.log(`Wrote ${path.relative(workspaceRoot, outMd)}`);
	console.log(`4K images: ${report.counts.images4k}`);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});

