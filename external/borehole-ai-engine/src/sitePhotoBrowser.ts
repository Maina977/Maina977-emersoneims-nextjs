/**
 * Browser side of the site-photo checks: decode a chosen file into RGBA pixels (canvas, in
 * this browser only), read its EXIF, keep a compact JPEG copy for the report. Nothing leaves
 * the device. The decoder is injectable so the workflow can be tested without a canvas.
 */
import { ACCEPTED_TYPES, SITE_PHOTO_THRESHOLDS, measurePixels, readExif, type PhotoFacts, type RgbaImage } from './sitePhotoChecks';

export interface Decoded { width: number; height: number; pixels: RgbaImage; dataUrl: string | null }
export type Decoder = (file: File) => Promise<Decoded>;

/** Canvas decoder: pixels at ≤ 512 px (for the measurements), report copy at ≤ 1024 px JPEG. */
export const canvasDecoder: Decoder = async (file) => {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => { const el = new Image(); el.onload = () => res(el); el.onerror = () => rej(new Error('The file could not be read as an image.')); el.src = url; });
    const draw = (max: number) => {
      const s = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(img.naturalWidth * s)); c.height = Math.max(1, Math.round(img.naturalHeight * s));
      const ctx = c.getContext('2d');
      if (!ctx) throw new Error('This browser cannot read images (no canvas).');
      ctx.drawImage(img, 0, 0, c.width, c.height);
      return { c, ctx };
    };
    const small = draw(512);
    const pixels = { width: small.c.width, height: small.c.height, data: small.ctx.getImageData(0, 0, small.c.width, small.c.height).data };
    const big = draw(1024);
    return { width: img.naturalWidth, height: img.naturalHeight, pixels, dataUrl: big.c.toDataURL('image/jpeg', 0.75) };
  } finally { URL.revokeObjectURL(url); }
};

function readBytes(file: File): Promise<ArrayBuffer> {
  if (typeof file.arrayBuffer === 'function') return file.arrayBuffer();
  return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result as ArrayBuffer); r.onerror = () => rej(r.error); r.readAsArrayBuffer(file); });
}

export type Processed = { ok: true; facts: PhotoFacts; dataUrl: string | null } | { ok: false; reason: string };

export async function processPhotoFile(file: File, decode: Decoder = canvasDecoder): Promise<Processed> {
  if (!(ACCEPTED_TYPES as readonly string[]).includes(file.type)) return { ok: false, reason: `${file.name}: ${file.type || 'unknown type'} is not accepted (JPEG, PNG or WebP photos only).` };
  if (file.size > SITE_PHOTO_THRESHOLDS.maxFileBytes) return { ok: false, reason: `${file.name}: larger than ${SITE_PHOTO_THRESHOLDS.maxFileBytes / 1024 / 1024} MB.` };
  let bytes: Uint8Array;
  try { bytes = new Uint8Array(await readBytes(file)); } catch { return { ok: false, reason: `${file.name}: the file could not be read.` }; }
  let d: Decoded;
  try { d = await decode(file); } catch (e) { return { ok: false, reason: `${file.name}: ${(e as Error).message}` }; }
  return { ok: true, dataUrl: d.dataUrl, facts: { fileName: file.name, type: file.type, bytes: file.size, width: d.width, height: d.height, metrics: measurePixels(d.pixels), exif: readExif(bytes) } };
}
