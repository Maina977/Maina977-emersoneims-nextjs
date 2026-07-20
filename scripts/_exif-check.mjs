// Check the church photos for GPS + full metadata — same exifr library
// and options the AquaScan engine itself uses (imageDetector.ts).
import exifr from 'exifr';
import { readFile } from 'node:fs/promises';

const files = process.argv.slice(2);
for (const f of files) {
  console.log(`\n════ ${f.split(/[\\/]/).pop()} ════`);
  try {
    const buf = await readFile(f);
    const meta = await exifr.parse(buf, { gps: true, tiff: true, exif: true, iptc: true, xmp: true });
    const gps = await exifr.gps(buf).catch(() => null);
    console.log('  Camera     :', [meta?.Make, meta?.Model].filter(Boolean).join(' ') || '(not recorded)');
    console.log('  Taken      :', meta?.DateTimeOriginal ?? meta?.CreateDate ?? '(not recorded)');
    console.log('  Size       :', meta?.ExifImageWidth ?? meta?.ImageWidth, 'x', meta?.ExifImageHeight ?? meta?.ImageHeight);
    console.log('  Orientation:', meta?.Orientation ?? '(none)');
    if (gps && Number.isFinite(gps.latitude) && Number.isFinite(gps.longitude)) {
      console.log('  GPS        : ***FOUND***  lat', gps.latitude.toFixed(6), ' lon', gps.longitude.toFixed(6));
      console.log('  Altitude   :', meta?.GPSAltitude != null ? `${meta.GPSAltitude} m` : '(not recorded)');
    } else {
      console.log('  GPS        : NOT PRESENT — no location in this file');
    }
  } catch (e) {
    console.log('  ERROR reading metadata:', String(e).slice(0, 120));
  }
}
