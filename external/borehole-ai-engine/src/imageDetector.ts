import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import exifr from 'exifr';
import { estimateGeographicLocation } from './geoEstimator';

/**
 * ImageDetector — Real image analysis pipeline.
 *
 * Layer 1: EXIF GPS extraction (±10m when available)
 * Layer 2: Browser Geolocation API (±50m if user allows)
 * Layer 3: MobileNet scene classification (terrain type, vegetation, water)
 * Layer 4: Pixel-level color/texture analysis (soil color, vegetation density,
 *           rock exposure, water bodies — does NOT depend on MobileNet labels)
 * Layer 5: Geological proxy from dominant colors (laterite=red, alluvial=grey,
 *           sandstone=tan, basalt=dark, limestone=white)
 * Layer 6: IPTC/XMP location text (city, country, sub-location)
 * Layer 7: Filename location hint parsing
 * Layer 8: IP-based geolocation fallback (~25km accuracy)
 * Layer 9: Perceptual image fingerprint (unique ID for every image)
 *
 * Confidence scoring is transparent: each layer adds evidence, and the
 * final confidence reflects HOW MUCH real data was available.
 */
export class ImageDetector {
  private model: any = null;
  private isInitialized = false;

  async loadModel() {
    if (!this.model) {
      try {
        await Promise.race([
          (async () => {
            await tf.ready();
            // mobilenet.load() defaults to tfhub.dev, whose Kaggle redirect
            // chain drops CORS headers for browser requests from our origin --
            // the classifier silently failed on live and photo scene analysis
            // degraded (console audit 2026-07-10). The model is now SELF-HOSTED
            // (public/models/mobilenet, byte-verified against the manifest):
            // same-origin, so immune to Google's redirects, CORS and CSP
            // forever. Package default kept as a fallback.
            try {
              this.model = await mobilenet.load({
                version: 1,
                alpha: 1.0,
                modelUrl: '/models/mobilenet/model.json',
              } as any);
            } catch (selfHostErr) {
              console.warn('[ImageDetector] Self-hosted model load failed, trying tfhub default:', (selfHostErr as any)?.message ?? selfHostErr);
              this.model = await mobilenet.load();
            }
            this.isInitialized = true;
          })(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('TF.js model load timeout (20s)')), 20000))
        ]);
      } catch (e) {
        console.warn('[ImageDetector] Model load failed/timed out:', (e as any)?.message ?? e);
        this.model = null;
        this.isInitialized = false;
      }
    }
    return this.model;
  }

  async extractMetadata(file: File) {
    try {
      const metadata = await exifr.parse(file, {
        gps: true, tiff: true, exif: true, iptc: true, xmp: true,
        translateKeys: true, translateValues: true, reviveValues: true, mergeOutput: true
      });
      return {
        gps: metadata?.latitude ? {
          latitude: metadata.latitude,
          longitude: metadata.longitude
        } : undefined,
        datetime: metadata?.DateTimeOriginal || metadata?.CreateDate,
        cameraMake: metadata?.Make,
        cameraModel: metadata?.Model,
        altitude: metadata?.GPSAltitude,
        imageWidth: metadata?.ImageWidth || metadata?.ExifImageWidth,
        imageHeight: metadata?.ImageHeight || metadata?.ExifImageHeight,
        // IPTC/XMP location text
        city: metadata?.City || metadata?.['City'],
        state: metadata?.['Province-State'] || metadata?.State,
        country: metadata?.['Country-PrimaryLocationName'] || metadata?.Country,
        sublocation: metadata?.['Sub-location'] || metadata?.Location,
        objectName: metadata?.ObjectName,
        software: metadata?.Software,
        orientation: metadata?.Orientation,
        // Forensic identifiers
        cameraSerial: metadata?.SerialNumber || metadata?.BodySerialNumber || metadata?.CameraSerialNumber || metadata?.InternalSerialNumber,
        lensModel: metadata?.LensModel || metadata?.Lens || metadata?.LensInfo,
        exifUniqueId: metadata?.ImageUniqueID || metadata?.imageUniqueID,
        documentId: metadata?.DocumentID || metadata?.['xmp:DocumentID'] || metadata?.InstanceID,
        originalDocumentId: metadata?.OriginalDocumentID || metadata?.['xmp:OriginalDocumentID'] || metadata?.DerivedFromDocumentID,
      };
    } catch {
      return {};
    }
  }

  /**
   * Dedicated GPS extraction using exifr.gps() — handles more EXIF GPS
   * formats than the generic parse (DMS, decimal degrees, different tag orders).
   */
  async extractGPSFromEXIF(file: File): Promise<{ latitude: number; longitude: number } | null> {
    // Strategy 1: Dedicated GPS extractor (handles DMS, DD, mixed formats)
    try {
      const gps = await exifr.gps(file);
      if (gps && typeof gps.latitude === 'number' && typeof gps.longitude === 'number'
          && isFinite(gps.latitude) && isFinite(gps.longitude)
          && (gps.latitude !== 0 || gps.longitude !== 0)) {
        return { latitude: gps.latitude, longitude: gps.longitude };
      }
    } catch { /* silent — try next strategy */ }

    // Strategy 2: Full parse with all GPS-related tags enabled
    try {
      const full = await exifr.parse(file, {
        gps: true, tiff: true, exif: true, xmp: true, iptc: true,
        translateKeys: true, translateValues: true, reviveValues: true, mergeOutput: true
      });
      if (full?.latitude && full?.longitude
          && isFinite(full.latitude) && isFinite(full.longitude)) {
        return { latitude: full.latitude, longitude: full.longitude };
      }
      // Some cameras store as GPSLatitude/GPSLongitude arrays [degrees, minutes, seconds]
      if (full?.GPSLatitude && full?.GPSLongitude) {
        const lat = Array.isArray(full.GPSLatitude) ? this.dmsToDecimal(full.GPSLatitude, full.GPSLatitudeRef) : full.GPSLatitude;
        const lon = Array.isArray(full.GPSLongitude) ? this.dmsToDecimal(full.GPSLongitude, full.GPSLongitudeRef) : full.GPSLongitude;
        if (isFinite(lat) && isFinite(lon) && (lat !== 0 || lon !== 0)) {
          return { latitude: lat, longitude: lon };
        }
      }
    } catch { /* silent */ }

    // Strategy 3: Try parsing only the thumbnail EXIF (some cameras embed GPS there)
    try {
      const thumb = await exifr.parse(file, { ifd1: true, gps: true, mergeOutput: true });
      if (thumb?.latitude && thumb?.longitude
          && isFinite(thumb.latitude) && isFinite(thumb.longitude)) {
        return { latitude: thumb.latitude, longitude: thumb.longitude };
      }
    } catch { /* silent */ }

    return null;
  }

  /**
   * Convert DMS (degrees, minutes, seconds) array to decimal degrees.
   * E.g., [1, 17, 12.34] with ref 'S' → -1.28676
   */
  private dmsToDecimal(dms: number[], ref?: string): number {
    if (!Array.isArray(dms) || dms.length < 2) return 0;
    const d = dms[0] || 0;
    const m = dms[1] || 0;
    const s = dms[2] || 0;
    let decimal = d + m / 60 + s / 3600;
    if (ref === 'S' || ref === 'W') decimal = -decimal;
    return decimal;
  }

  /**
   * Extract IPTC/XMP location text metadata (city, country, sub-location).
   * Many photo editors and phone cameras embed this even without GPS coords.
   */
  async extractLocationText(file: File): Promise<{
    city?: string; state?: string; country?: string; locationName?: string;
  } | null> {
    try {
      const data = await exifr.parse(file, { iptc: true, xmp: true, mergeOutput: true });
      if (!data) return null;
      const city = data.City || data['photoshop:City'];
      const state = data['Province-State'] || data.State || data['photoshop:State'];
      const country = data['Country-PrimaryLocationName'] || data.Country || data['photoshop:Country'];
      const locationName = data['Sub-location'] || data.Location || data.ObjectName;
      if (city || state || country || locationName) {
        return { city, state, country, locationName };
      }
    } catch {}
    return null;
  }

  /**
   * Parse filename for location hints.
   * Extracts meaningful words, preserving compound place names.
   *   palo_alto_jacaranda-dia_HQ_mod-scaled.webp → "palo alto jacaranda"
   */
  extractLocationFromFilename(filename: string): string | null {
    // Stop words to remove (non-location file naming patterns)
    const stopWords = new Set([
      'img', 'dsc', 'dcim', 'photo', 'image', 'pic', 'screenshot',
      'screen', 'shot', 'whatsapp', 'capture', 'snap',
      'hq', 'lq', 'mq', 'mod', 'scaled', 'dia', 'final', 'edit',
      'copy', 'original', 'high', 'low', 'med', 'quality', 'res',
      'resolution', 'small', 'large', 'big', 'thumbnail', 'thumb',
      'preview', 'version', 'draft', 'raw', 'processed', 'cropped',
      'resized', 'compressed', 'optimized', 'enhanced', 'retouched',
      'site', 'survey', 'borehole', 'sample', 'test', 'scan',
      'new', 'old', 'temp', 'tmp', 'backup', 'bak',
    ]);

    const clean = filename
      .replace(/\.[^.]+$/, '')   // remove extension
      .replace(/\d{4}[-_]?\d{2}[-_]?\d{2}[-_]?\d{2}[-_]?\d{2}[-_]?\d{2}/g, '')  // timestamps
      .replace(/\d{8,}/g, '')   // long number sequences
      .trim();
    const parts = clean
      .split(/[-_\s,]+/)
      .map(p => p.toLowerCase())
      .filter(p => p.length > 2 && !stopWords.has(p) && !/^\d+$/.test(p));
    return parts.length > 0 ? parts.join(' ') : null;
  }

  /**
   * IP-based geolocation — final fallback when EXIF and browser geo both fail.
   * Uses free IP geolocation API. Accuracy ~25km (city-level).
   * Returns null on timeout or error. Times out after 5 seconds.
   */
  async getIPGeolocation(): Promise<{
    latitude: number; longitude: number; accuracy: number;
    city?: string; country?: string; region?: string;
  } | null> {
    const apis = [
      { url: 'https://ipapi.co/json/', parse: (d: any) => ({ latitude: d.latitude, longitude: d.longitude, city: d.city, country: d.country_name, region: d.region }) },
      { url: 'https://ip-api.com/json/?fields=lat,lon,city,country,regionName', parse: (d: any) => ({ latitude: d.lat, longitude: d.lon, city: d.city, country: d.country, region: d.regionName }) },
    ];
    for (const api of apis) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(api.url, { signal: controller.signal });
        clearTimeout(timeout);
        if (!res.ok) continue;
        const data = await res.json();
        const parsed = api.parse(data);
        if (parsed.latitude && parsed.longitude && isFinite(parsed.latitude) && isFinite(parsed.longitude)) {
          return { ...parsed, accuracy: 25000 }; // ~25km city-level accuracy
        }
      } catch { continue; }
    }
    return null;
  }

  /**
   * FORWARD GEOCODING — Search for a place by name and return its coordinates.
   * Uses OpenStreetMap Nominatim search API (free, no key).
   * Strategy: tries the most specific query first, then progressively broader.
   * Returns the FIRST geographic match found. Accepts cities, towns, roads,
   * landmarks — any real place on the map.
   */
  async forwardGeocode(query: string): Promise<{
    latitude: number;
    longitude: number;
    displayName: string;
    country?: string;
    countryCode?: string;
    state?: string;
    county?: string;
    city?: string;
    suburb?: string;
    village?: string;
    road?: string;
    neighbourhood?: string;
    postcode?: string;
    placeType?: string;
    importance: number;
    source: 'nominatim' | 'bigdatacloud' | 'none';
  } | null> {
    if (!query || query.trim().length < 2) return null;

    const words = query.toLowerCase().split(/[\s]+/).filter(w => w.length > 1);
    if (words.length === 0) return null;

    console.log('[ForwardGeocode] Input words:', words);

    // Build search queries — MOST SPECIFIC first, then progressively broader
    const queries: string[] = [];

    // 1. Full phrase (most specific — "palo alto jacaranda")
    if (words.length >= 2) queries.push(words.join(' '));

    // 2. Consecutive pairs — catches compound names ("palo alto", "new york")
    for (let i = 0; i < words.length - 1; i++) {
      queries.push(words[i] + ' ' + words[i + 1]);
    }

    // 3. Consecutive triples (for 4+ word queries)
    for (let i = 0; i < words.length - 2; i++) {
      const triple = words[i] + ' ' + words[i + 1] + ' ' + words[i + 2];
      if (!queries.includes(triple)) queries.push(triple);
    }

    // 4. Individual words (>3 chars, broadest)
    for (const w of words) {
      if (w.length > 3 && !queries.includes(w)) queries.push(w);
    }

    // Deduplicate
    const seen = new Set<string>();
    const uniqueQueries = queries.filter(q => {
      if (seen.has(q)) return false;
      seen.add(q);
      return true;
    });

    console.log('[ForwardGeocode] Query plan:', uniqueQueries);

    // Rejected result classes (restaurants, shops, amenities — NOT locations)
    const rejectedClasses = new Set([
      'amenity', 'shop', 'tourism', 'leisure', 'office',
      'craft', 'club', 'healthcare', 'man_made',
    ]);
    // Rejected types within otherwise-ok classes
    const rejectedTypes = new Set([
      'restaurant', 'cafe', 'bar', 'pub', 'fast_food',
      'hotel', 'motel', 'hostel', 'guest_house',
      'supermarket', 'convenience', 'pharmacy', 'bank',
      'school', 'university', 'hospital', 'clinic',
      'fuel', 'parking', 'bus_stop', 'station',
    ]);

    // Try each query — return FIRST valid geographic match
    for (const q of uniqueQueries) {
      try {
        const encoded = encodeURIComponent(q);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=5&addressdetails=1&accept-language=en`;
        const res = await fetch(url, {
          headers: { 'User-Agent': 'EIMS-AquaScanPro/3.0 (borehole-analysis)' },
          signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) {
          console.log(`[ForwardGeocode] HTTP ${res.status} for "${q}"`);
          // Nominatim 429 = rate limited, wait and retry
          if (res.status === 429) await new Promise(r => setTimeout(r, 2000));
          continue;
        }
        const results = await res.json();
        console.log(`[ForwardGeocode] "${q}" → ${results.length} results`);

        for (const r of results) {
          const cls = r.class || '';
          const typ = r.type || '';
          const imp = parseFloat(r.importance || '0');

          // Skip non-geographic results (shops, restaurants, etc.)
          if (rejectedClasses.has(cls) || rejectedTypes.has(typ)) {
            console.log(`[ForwardGeocode] Skipping ${cls}/${typ}: ${r.display_name?.slice(0, 60)}`);
            continue;
          }

          // Accept ANY result with valid coordinates if it's not rejected
          if (r.lat && r.lon) {
            const addr = r.address || {};
            console.log(`[ForwardGeocode] ACCEPTED: ${cls}/${typ} imp=${imp.toFixed(3)} → ${r.display_name?.slice(0, 80)}`);
            return {
              latitude: parseFloat(r.lat),
              longitude: parseFloat(r.lon),
              displayName: r.display_name,
              country: addr.country,
              countryCode: addr.country_code?.toUpperCase(),
              state: addr.state || addr.province || addr.region,
              county: addr.county || addr.state_district || addr.district,
              city: addr.city || addr.town || addr.municipality,
              suburb: addr.suburb || addr.city_district,
              village: addr.village || addr.hamlet || addr.locality,
              road: addr.road || addr.street,
              neighbourhood: addr.neighbourhood,
              postcode: addr.postcode,
              placeType: r.type,
              importance: imp,
              source: 'nominatim',
            };
          }
        }
      } catch (err) {
        console.log(`[ForwardGeocode] Error for "${q}":`, err);
        continue;
      }

      // Rate limit: Nominatim requests 1/sec — use 1.05s to be safe
      await new Promise(r => setTimeout(r, 1050));
    }

    console.log('[ForwardGeocode] No results for any query');
    return null;
  }

  /**
   * Forward geocode with country code bias from visual estimation.
   * Identical to forwardGeocode but appends &countrycodes= to Nominatim queries,
   * strongly biasing results toward the visually estimated region.
   */
  async forwardGeocodeWithBias(query: string, countryCodes: string): ReturnType<typeof this.forwardGeocode> {
    if (!query || query.trim().length < 2) return null;

    const words = query.toLowerCase().split(/[\s]+/).filter(w => w.length > 1);
    if (words.length === 0) return null;

    console.log(`[ForwardGeocode+Bias] Input: "${query}" countrycodes=${countryCodes}`);

    // Build same search queries as forwardGeocode
    const queries: string[] = [];
    if (words.length >= 2) queries.push(words.join(' '));
    for (let i = 0; i < words.length - 1; i++) {
      queries.push(words[i] + ' ' + words[i + 1]);
    }
    for (let i = 0; i < words.length - 2; i++) {
      const triple = words[i] + ' ' + words[i + 1] + ' ' + words[i + 2];
      if (!queries.includes(triple)) queries.push(triple);
    }
    for (const w of words) {
      if (w.length > 3 && !queries.includes(w)) queries.push(w);
    }

    const seen = new Set<string>();
    const uniqueQueries = queries.filter(q => { if (seen.has(q)) return false; seen.add(q); return true; });

    const rejectedClasses = new Set(['amenity', 'shop', 'tourism', 'leisure', 'office', 'craft', 'club', 'healthcare', 'man_made']);
    const rejectedTypes = new Set([
      'restaurant', 'cafe', 'bar', 'pub', 'fast_food', 'hotel', 'motel', 'hostel', 'guest_house',
      'supermarket', 'convenience', 'pharmacy', 'bank', 'school', 'university', 'hospital', 'clinic',
      'fuel', 'parking', 'bus_stop', 'station',
    ]);

    for (const q of uniqueQueries) {
      try {
        const encoded = encodeURIComponent(q);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=5&addressdetails=1&accept-language=en&countrycodes=${countryCodes}`;
        const res = await fetch(url, {
          headers: { 'User-Agent': 'EIMS-AquaScanPro/3.0 (borehole-analysis)' },
          signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) {
          if (res.status === 429) await new Promise(r => setTimeout(r, 2000));
          continue;
        }
        const results = await res.json();
        console.log(`[ForwardGeocode+Bias] "${q}" (${countryCodes}) → ${results.length} results`);

        for (const r of results) {
          const cls = r.class || '';
          const typ = r.type || '';
          const imp = parseFloat(r.importance || '0');
          if (rejectedClasses.has(cls) || rejectedTypes.has(typ)) continue;

          if (r.lat && r.lon) {
            const addr = r.address || {};
            console.log(`[ForwardGeocode+Bias] ACCEPTED: ${cls}/${typ} → ${r.display_name?.slice(0, 80)}`);
            return {
              latitude: parseFloat(r.lat),
              longitude: parseFloat(r.lon),
              displayName: r.display_name,
              country: addr.country,
              countryCode: addr.country_code?.toUpperCase(),
              state: addr.state || addr.province || addr.region,
              county: addr.county || addr.state_district || addr.district,
              city: addr.city || addr.town || addr.municipality,
              suburb: addr.suburb || addr.city_district,
              village: addr.village || addr.hamlet || addr.locality,
              road: addr.road || addr.street,
              neighbourhood: addr.neighbourhood,
              postcode: addr.postcode,
              placeType: r.type,
              importance: imp,
              source: 'nominatim' as const,
            };
          }
        }
      } catch (err) {
        console.log(`[ForwardGeocode+Bias] Error for "${q}":`, err);
        continue;
      }
      await new Promise(r => setTimeout(r, 1050));
    }

    console.log('[ForwardGeocode+Bias] No biased results found');
    return null;
  }

  /**
   * REVERSE GEOCODING — Convert GPS coordinates to REAL place names.
   * Uses OpenStreetMap Nominatim (free, no API key) + BigDataCloud as fallback.
   * Returns ONLY real verified data from the map database. NO fabrication.
   *
   * Returns: country, state/county, city/town, village/suburb, road/estate,
   *          display name (full address), and place type.
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<{
    country?: string;
    countryCode?: string;
    state?: string;
    county?: string;
    constituency?: string;
    ward?: string;
    city?: string;
    suburb?: string;
    village?: string;
    road?: string;
    neighbourhood?: string;
    postcode?: string;
    displayName?: string;
    placeType?: string;
    source: 'nominatim' | 'bigdatacloud' | 'none';
  }> {
    type RGResult = Awaited<ReturnType<ImageDetector['reverseGeocode']>>;
    let base: RGResult = { source: 'none' };

    // Strategy 1: OpenStreetMap Nominatim (most detailed street/village names)
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=en`;
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'EIMS-AquaScanPro/3.0 (borehole-analysis)' }
      });
      clearTimeout(timeout);
      if (res.ok) {
        const data = await res.json();
        if (data && data.address) {
          const addr = data.address;
          base = {
            country: addr.country,
            countryCode: addr.country_code?.toUpperCase(),
            state: addr.state || addr.province || addr.region,
            county: addr.county || addr.state_district || addr.district,
            // Kenya OSM: constituencies/sub-counties are usually tagged as
            // subcounty / municipality / city_district at admin level 6
            constituency: addr.subcounty || addr.municipality || addr.city_district,
            ward: addr.ward || addr.quarter,
            city: addr.city || addr.town || addr.municipality,
            suburb: addr.suburb || addr.city_district || addr.borough,
            village: addr.village || addr.hamlet || addr.locality || addr.croft,
            road: addr.road || addr.street || addr.pedestrian,
            neighbourhood: addr.neighbourhood || addr.quarter || addr.residential,
            postcode: addr.postcode,
            displayName: data.display_name,
            placeType: data.type || data.category,
            source: 'nominatim',
          };
        }
      }
    } catch { /* silent — enrich/fallback below */ }

    // Strategy 2: BigDataCloud — ALWAYS queried (not just as fallback) because
    // its localityInfo.administrative array carries explicit OSM admin levels,
    // which is the reliable way to name the full hierarchy the business needs:
    // level 2 = country, 4 = county (Kenya), 6 = constituency/sub-county,
    // 8–10 = ward/location/village. Nominatim's flat address object often
    // omits the constituency level entirely.
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          const admin: any[] = data.localityInfo?.administrative ?? [];
          const byLevel = (...levels: number[]): string | undefined => {
            for (const lvl of levels) {
              const hit = admin.find((a: any) => a.adminLevel === lvl && a.name);
              if (hit) return hit.name;
            }
            return undefined;
          };
          const bdcCounty = byLevel(4, 3);
          const bdcConstituency = byLevel(6, 5);
          const bdcWard = byLevel(8, 9, 10);
          if (base.source === 'none') {
            base = {
              country: data.countryName,
              countryCode: data.countryCode,
              state: data.principalSubdivision,
              county: bdcCounty ?? data.principalSubdivision,
              constituency: bdcConstituency,
              ward: bdcWard,
              city: data.city || data.locality,
              suburb: undefined,
              village: bdcWard ?? data.locality,
              road: undefined,
              neighbourhood: data.neighbourhood,
              postcode: data.postcode,
              displayName: [bdcWard, bdcConstituency, bdcCounty, data.countryName].filter(Boolean).join(', '),
              placeType: admin[0]?.description,
              source: 'bigdatacloud',
            };
          } else {
            // Enrich the Nominatim result with the explicit admin ladder.
            // Nominatim's flat `county` field in Kenya frequently holds the
            // SUB-county (verified live: returns "Murang`a South" where the
            // county is Murang'a) — so the level-4 name wins for `county`,
            // and Nominatim's value slides down to the constituency slot.
            base.constituency = base.constituency
              ?? bdcConstituency
              ?? (base.county && bdcCounty && base.county !== bdcCounty ? base.county : undefined);
            base.county = bdcCounty ?? base.county;
            base.ward = base.ward ?? bdcWard;
            base.country = base.country ?? data.countryName;
            base.countryCode = base.countryCode ?? data.countryCode;
          }
        }
      }
    } catch { /* silent */ }

    return base;
  }

  /**
   * Generate a perceptual image fingerprint (average hash — pHash).
   * Produces a unique 16-char hex ID for ANY image.
   * Same image = same hash. Even resized/compressed images produce similar hashes.
   */
  generateImageFingerprint(imageElement: HTMLImageElement): string {
    const canvas = document.createElement('canvas');
    canvas.width = 8;
    canvas.height = 8;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(imageElement, 0, 0, 8, 8);
    const data = ctx.getImageData(0, 0, 8, 8).data;

    // Compute grayscale values and mean
    let total = 0;
    const grays: number[] = [];
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      grays.push(gray);
      total += gray;
    }
    const mean = total / grays.length;

    // Build 64-bit hash as 16-char hex string
    let hash = '';
    for (let i = 0; i < grays.length; i += 4) {
      let nibble = 0;
      for (let j = 0; j < 4 && (i + j) < grays.length; j++) {
        if (grays[i + j] >= mean) nibble |= (1 << (3 - j));
      }
      hash += nibble.toString(16);
    }
    return hash.toUpperCase();
  }

  /**
   * Build comprehensive forensic identity for an image.
   * Combines: perceptual hash + EXIF unique ID + camera serial + document ID
   * + camera make/model + lens + creation date + image dimensions.
   * Every image gets a composite identifier even if some fields are missing.
   */
  buildForensicIdentity(pHash: string, metadata: any): {
    pHash: string;
    cameraSerial?: string;
    cameraMake?: string;
    cameraModel?: string;
    lensModel?: string;
    software?: string;
    exifUniqueId?: string;
    documentId?: string;
    originalDocumentId?: string;
    dateOriginal?: string;
    imageSize?: string;
    orientation?: number;
    compositeId: string;
  } {
    const parts: string[] = [pHash];
    const serial = metadata?.cameraSerial;
    const make = metadata?.cameraMake;
    const model = metadata?.cameraModel;
    const lens = typeof metadata?.lensModel === 'string' ? metadata.lensModel : undefined;
    const software = metadata?.software;
    const exifId = metadata?.exifUniqueId;
    const docId = metadata?.documentId;
    const origDocId = metadata?.originalDocumentId;
    const dt = metadata?.datetime;
    const w = metadata?.imageWidth;
    const h = metadata?.imageHeight;
    const orient = metadata?.orientation;
    const dateStr = dt ? (dt instanceof Date ? dt.toISOString() : String(dt)) : undefined;
    const sizeStr = (w && h) ? `${w}x${h}` : undefined;

    // Build composite: most specific identifiers first
    if (exifId) parts.push(`EXID:${exifId}`);
    if (docId) parts.push(`DOC:${docId.slice(-12)}`);
    if (serial) parts.push(`SN:${serial}`);
    if (make && model) parts.push(`CAM:${make}/${model}`);
    if (dateStr) parts.push(`DT:${dateStr.replace(/[^0-9TZ]/g, '').slice(0, 15)}`);
    if (sizeStr) parts.push(sizeStr);

    // Generate a short composite hash from all available identifiers
    const raw = parts.join('|');
    let compositeHash = 0;
    for (let i = 0; i < raw.length; i++) {
      compositeHash = ((compositeHash << 5) - compositeHash + raw.charCodeAt(i)) | 0;
    }
    const compositeId = `IMG-${pHash}-${(compositeHash >>> 0).toString(16).toUpperCase().padStart(8, '0')}`;

    return {
      pHash,
      cameraSerial: serial,
      cameraMake: make,
      cameraModel: model,
      lensModel: lens,
      software,
      exifUniqueId: exifId,
      documentId: docId,
      originalDocumentId: origDocId,
      dateOriginal: dateStr,
      imageSize: sizeStr,
      orientation: orient,
      compositeId,
    };
  }

  /**
   * Request browser geolocation as fallback when EXIF has no GPS.
   * Only works if user grants permission. Returns null otherwise.
   */
  async requestBrowserGeolocation(): Promise<{ latitude: number; longitude: number; accuracy: number } | null> {
    if (!navigator?.geolocation) return null;
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
      );
    });
  }

  /**
   * Pixel-level image analysis using TensorFlow.js tensor operations.
   * Extracts REAL features from the image pixels — not from MobileNet labels.
   *
   * - Dominant color channels → soil/rock classification proxy
   * - Green channel ratio → vegetation density (NDVI-proxy from RGB)
   * - Blue channel ratio → water body detection
   * - Texture variance → terrain roughness (rocky vs smooth)
   * - Brightness distribution → exposure type (open field vs forest canopy)
   */
  analyzePixels(imageElement: HTMLImageElement): {
    greenRatio: number;
    blueRatio: number;
    redRatio: number;
    brightness: number;
    textureVariance: number;
    dominantColorClass: string;
    vegetationIndex: number;
    waterIndex: number;
    soilExposureIndex: number;
    rockExposureIndex: number;
    isOutdoorScene: boolean;
    sceneConfidence: number;
    colorHistogram: { shadows: number; midtones: number; highlights: number };
    edgeDensity: number;
  } {
    // Create canvas to read pixel data
    const canvas = document.createElement('canvas');
    const size = 256; // Resize to standard for consistent analysis
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(imageElement, 0, 0, size, size);
    const imageData = ctx.getImageData(0, 0, size, size);
    const pixels = imageData.data; // RGBA flat array

    let totalR = 0, totalG = 0, totalB = 0;
    let totalBrightness = 0;
    const pixelCount = size * size;
    // Histogram bins for shadows/midtones/highlights
    let shadows = 0, midtones = 0, highlights = 0;

    // Pass 1: Compute mean channels + histogram
    for (let i = 0; i < pixels.length; i += 4) {
      totalR += pixels[i];
      totalG += pixels[i + 1];
      totalB += pixels[i + 2];
      const lum = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
      totalBrightness += lum;
      if (lum < 64) shadows++;
      else if (lum < 192) midtones++;
      else highlights++;
    }
    const meanR = totalR / pixelCount;
    const meanG = totalG / pixelCount;
    const meanB = totalB / pixelCount;
    const meanBrightness = totalBrightness / pixelCount;
    const totalRGB = meanR + meanG + meanB || 1;

    const redRatio = meanR / totalRGB;
    const greenRatio = meanG / totalRGB;
    const blueRatio = meanB / totalRGB;

    // Pass 2: Texture variance + edge density (Sobel-like horizontal gradient)
    let varianceSum = 0;
    let edgeSum = 0;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        const gray = (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3;
        varianceSum += (gray - meanBrightness) * (gray - meanBrightness);
        // Horizontal edge detection
        if (x < size - 1) {
          const idxRight = (y * size + x + 1) * 4;
          const grayRight = (pixels[idxRight] + pixels[idxRight + 1] + pixels[idxRight + 2]) / 3;
          edgeSum += Math.abs(gray - grayRight);
        }
      }
    }
    const textureVariance = Math.sqrt(varianceSum / pixelCount) / 128; // Normalize 0-1
    const edgeDensity = edgeSum / (pixelCount * 128); // Normalize ~0-1

    // ── OUTDOOR SCENE DETECTION ──
    // Outdoor terrain photos have: green/brown tones, moderate texture, natural color distribution
    // Indoor/document/selfie photos have: skin tones (high R, moderate G, low B), uniform backgrounds,
    // very low texture (documents), or high saturation + artificial colors
    const colorSpread = Math.abs(redRatio - greenRatio) + Math.abs(greenRatio - blueRatio) + Math.abs(redRatio - blueRatio);
    const shadowRatio = shadows / pixelCount;
    const highlightRatio = highlights / pixelCount;
    const midtoneRatio = midtones / pixelCount;

    // Score outdoor likelihood (0-1)
    let outdoorScore = 0.5; // Start neutral
    // Natural scenes have green presence
    if (greenRatio > 0.31) outdoorScore += 0.15;
    // Natural scenes tend to have moderate texture
    if (textureVariance > 0.08 && textureVariance < 0.6) outdoorScore += 0.1;
    // Natural scenes have distributed histogram (not dominated by one range)
    if (shadowRatio < 0.6 && highlightRatio < 0.6 && midtoneRatio > 0.3) outdoorScore += 0.1;
    // Edge density typical of natural scenes (not too uniform, not too busy)
    if (edgeDensity > 0.04 && edgeDensity < 0.35) outdoorScore += 0.1;
    // Very low variance = likely document/screenshot/solid background
    if (textureVariance < 0.03) outdoorScore -= 0.3;
    // Very high highlights + low texture = likely screen/document
    if (highlightRatio > 0.5 && textureVariance < 0.1) outdoorScore -= 0.25;
    // Skin tone detection (selfie): high red, moderate green, low blue, specific brightness
    if (redRatio > 0.38 && greenRatio > 0.28 && greenRatio < 0.36 && blueRatio < 0.3 && meanBrightness > 100 && meanBrightness < 200) {
      outdoorScore -= 0.15; // May be a selfie, but could also be red soil
    }
    const isOutdoorScene = outdoorScore >= 0.45;
    const sceneConfidence = Math.max(0, Math.min(1, outdoorScore));

    // Vegetation index: excess-green index (ExG) — standard remote sensing proxy
    // ExG = 2G - R - B (normalized)
    const vegetationIndex = Math.max(0, Math.min(1, (2 * greenRatio - redRatio - blueRatio + 0.5)));

    // Water index: blue dominance + low variance (water is smooth and blue/dark)
    const waterIndex = Math.max(0, Math.min(1,
      (blueRatio - redRatio + 0.3) * (1 - textureVariance)
    ));

    // Soil exposure: high red/warm tones + low green (exposed earth)
    const soilExposureIndex = Math.max(0, Math.min(1,
      (redRatio - greenRatio + 0.2) * (1 - vegetationIndex)
    ));

    // Rock exposure: high texture variance + low vegetation + medium brightness
    const rockExposureIndex = Math.max(0, Math.min(1,
      textureVariance * (1 - vegetationIndex) * (meanBrightness > 60 ? 1.0 : 0.5)
    ));

    // Dominant color classification (geological proxy) — only meaningful for outdoor scenes
    let dominantColorClass = 'unknown';
    if (isOutdoorScene) {
      if (redRatio > 0.42 && greenRatio < 0.34) dominantColorClass = 'laterite/ferralitic';
      else if (redRatio > 0.38 && greenRatio > 0.30 && greenRatio < 0.35) dominantColorClass = 'sandstone/alluvial';
      else if (greenRatio > 0.40) dominantColorClass = 'vegetated';
      else if (blueRatio > 0.38) dominantColorClass = 'water/wetland';
      else if (meanBrightness < 80) dominantColorClass = 'basalt/volcanic';
      else if (meanBrightness > 200) dominantColorClass = 'limestone/chalk';
      else if (textureVariance > 0.4) dominantColorClass = 'fractured/rocky';
      else dominantColorClass = 'mixed-terrain';
    } else {
      dominantColorClass = 'non-terrain-image';
    }

    return {
      greenRatio: Math.round(greenRatio * 1000) / 1000,
      blueRatio: Math.round(blueRatio * 1000) / 1000,
      redRatio: Math.round(redRatio * 1000) / 1000,
      brightness: Math.round(meanBrightness),
      textureVariance: Math.round(textureVariance * 1000) / 1000,
      dominantColorClass,
      vegetationIndex: Math.round(vegetationIndex * 100) / 100,
      waterIndex: Math.round(waterIndex * 100) / 100,
      soilExposureIndex: Math.round(soilExposureIndex * 100) / 100,
      rockExposureIndex: Math.round(rockExposureIndex * 100) / 100,
      isOutdoorScene,
      sceneConfidence: Math.round(sceneConfidence * 100) / 100,
      colorHistogram: {
        shadows: Math.round(shadowRatio * 100) / 100,
        midtones: Math.round(midtoneRatio * 100) / 100,
        highlights: Math.round(highlightRatio * 100) / 100,
      },
      edgeDensity: Math.round(edgeDensity * 1000) / 1000,
    };
  }

  async detectTerrainFeatures(imageElement: HTMLImageElement) {
    const model = await this.loadModel();
    const predictions = model ? await model.classify(imageElement) : [];
    
    // Layer 4: Real pixel analysis (does not depend on MobileNet labels)
    const pixelAnalysis = this.analyzePixels(imageElement);

    // Check if MobileNet detected outdoor/nature/terrain scene
    const mnOutdoor = this.detectOutdoorScene(predictions);

    // Fuse MobileNet scene labels with pixel analysis
    const mnVeg = this.calculateVegetationScore(predictions);
    const mnWater = this.detectWaterPresence(predictions);
    const mnTerrain = this.detectTerrainType(predictions);

    // If pixel analysis says NOT outdoor AND MobileNet says NOT outdoor → low confidence
    const isReliableTerrainImage = pixelAnalysis.isOutdoorScene || mnOutdoor;

    // Weight MobileNet lower (20%) when scene detection is uncertain
    const mnWeight = (mnOutdoor && pixelAnalysis.isOutdoorScene) ? 0.3 : (isReliableTerrainImage ? 0.2 : 0.1);
    const pxWeight = 1 - mnWeight;

    const vegetationScore = Math.min(1, mnVeg * mnWeight + pixelAnalysis.vegetationIndex * pxWeight);
    const waterProbability = Math.min(1, mnWater * mnWeight + pixelAnalysis.waterIndex * pxWeight);

    // Terrain type: pixel analysis can override MobileNet
    let terrainType = mnTerrain;
    if (pixelAnalysis.waterIndex > 0.5) terrainType = 'drainage';
    else if (pixelAnalysis.rockExposureIndex > 0.5 && pixelAnalysis.textureVariance > 0.35) terrainType = 'slope';
    else if (pixelAnalysis.vegetationIndex > 0.6 && pixelAnalysis.textureVariance < 0.2) terrainType = 'flat';

    return {
      vegetationScore,
      terrainType,
      waterProbability,
      predictions: predictions.slice(0, 5),
      pixelAnalysis,
      isReliableTerrainImage,
    };
  }

  /**
   * Detect if MobileNet labels indicate outdoor/nature/terrain scene.
   * MobileNet (ImageNet) includes many outdoor categories.
   */
  private detectOutdoorScene(predictions: any[]): boolean {
    const outdoorTerms = [
      'cliff', 'valley', 'volcano', 'alp', 'mountain', 'hill', 'seashore', 'lakeshore',
      'sandbar', 'promontory', 'coral reef', 'geyser', 'lakeside', 'dam',
      'breakwater', 'pier', 'bridge', 'barn', 'church', 'greenhouse',
      'tree', 'grass', 'field', 'forest', 'jungle', 'park', 'garden', 'savanna',
      'prairie', 'desert', 'beach', 'rock', 'stone', 'soil', 'mud', 'sand',
      'river', 'stream', 'lake', 'ocean', 'sea', 'pond', 'marsh', 'swamp',
      'dirt', 'gravel', 'fence', 'hay', 'harvester', 'plow', 'tractor',
      'ox', 'cow', 'sheep', 'horse', 'goat', 'herd', 'pasture', 'barn',
      'well', 'fountain', 'reservoir', 'aqueduct', 'canal', 'suspension bridge',
      'hedge', 'vine', 'bamboo', 'palm', 'plantation', 'crop', 'farmland'
    ];
    for (const pred of predictions) {
      const label = pred.className.toLowerCase();
      if (outdoorTerms.some(term => label.includes(term)) && pred.probability > 0.05) {
        return true;
      }
    }
    return false;
  }

  private calculateVegetationScore(predictions: any[]): number {
    const vegTerms = ['tree', 'plant', 'grass', 'forest', 'vegetation', 'leaf', 'bamboo',
      'garden', 'park', 'jungle', 'shrub', 'hedge', 'lawn', 'savanna', 'crop'];
    let score = 0;
    predictions.forEach((pred: any) => {
      vegTerms.forEach(term => {
        if (pred.className.toLowerCase().includes(term)) {
          score += pred.probability;
        }
      });
    });
    return Math.min(score, 1);
  }

  private detectTerrainType(predictions: any[]): string {
    const terrainMap: Record<string, string[]> = {
      'valley': ['valley', 'canyon', 'gorge', 'ravine', 'gully', 'gulch'],
      'slope': ['slope', 'hillside', 'incline', 'mountain', 'cliff', 'ridge', 'bluff'],
      'flat': ['plain', 'field', 'plateau', 'meadow', 'steppe', 'prairie', 'savanna'],
      'drainage': ['river', 'stream', 'creek', 'wetland', 'marsh', 'swamp', 'pond', 'dam']
    };
    
    for (const [type, keywords] of Object.entries(terrainMap)) {
      for (const pred of predictions) {
        if (keywords.some(k => pred.className.toLowerCase().includes(k))) {
          return type;
        }
      }
    }
    return 'flat';
  }

  private detectWaterPresence(predictions: any[]): number {
    const waterTerms = ['water', 'river', 'lake', 'stream', 'pond', 'wetland', 'ocean', 'sea',
      'reservoir', 'dam', 'canal', 'flood', 'marsh', 'swamp'];
    let waterScore = 0;
    predictions.forEach((pred: any) => {
      waterTerms.forEach(term => {
        if (pred.className.toLowerCase().includes(term)) {
          waterScore += pred.probability;
        }
      });
    });
    return Math.min(waterScore, 1);
  }

  async analyzeImage(file: File, locationHints?: string[]): Promise<any> {
    const img = new Image();
    const imageUrl = URL.createObjectURL(file);
    
    return new Promise((resolve, reject) => {
      img.onload = async () => {
        try {
          const features = await this.detectTerrainFeatures(img);
          const metadata = await this.extractMetadata(file);

          // Generate unique image fingerprint (works for EVERY image)
          const imageFingerprint = this.generateImageFingerprint(img);

          // Build comprehensive forensic identity
          const imageForensicId = this.buildForensicIdentity(imageFingerprint, metadata);

          // ═══ VISUAL GEO-ESTIMATION (runs FIRST — pure pixel math, instant) ═══
          // Used to bias forward geocoding when filename is ambiguous
          let geoEstimate: any = undefined;
          let visualHintCountryCodes: string[] = [];
          if (features.pixelAnalysis) {
            const labels = (features.predictions || []).map((p: any) => p.className);
            geoEstimate = estimateGeographicLocation(features.pixelAnalysis, labels, locationHints);
            // Extract country codes from top visual estimates to bias forward geocoding
            if (geoEstimate?.estimates?.length > 0) {
              visualHintCountryCodes = geoEstimate.estimates
                .slice(0, 5)
                .map((e: any) => e.countryCode?.toLowerCase())
                .filter(Boolean);
              console.log('[GeoEstimate] Visual hints:', geoEstimate.estimates.slice(0,3).map((e:any) => `${e.region},${e.country}(${e.countryCode})`));
            }
          }

          // ═══ GPS EXTRACTION CHAIN ═══
          let gpsSource: 'exif' | 'browser' | 'ip' | 'none' = 'none';
          let gps: { latitude: number; longitude: number } | undefined;
          let gpsAccuracy = 0;
          let locationMethod: 'exif-gps' | 'filename-geocode' | 'iptc-geocode' | 'visual-estimate' | 'none' = 'none';
          const locationContext: {
            city?: string; country?: string; region?: string;
            filenameHint?: string; iptcLocation?: string;
          } = {};

          // Layer 1: EXIF GPS — dedicated multi-strategy extractor
          const exifGPS = await this.extractGPSFromEXIF(file);
          if (exifGPS) {
            gps = exifGPS;
            gpsSource = 'exif';
            gpsAccuracy = 10;
            locationMethod = 'exif-gps';
            console.log('[GPS] EXIF GPS found:', exifGPS);
          }

          // Layer 2: IPTC/XMP location text
          const locationText = await this.extractLocationText(file);
          if (locationText) {
            if (locationText.city) locationContext.city = locationText.city;
            if (locationText.country) locationContext.country = locationText.country;
            if (locationText.locationName) locationContext.iptcLocation = locationText.locationName;
          }

          // Layer 3: Filename location hints
          const filenameHint = this.extractLocationFromFilename(file.name);
          if (filenameHint) locationContext.filenameHint = filenameHint;
          console.log('[GPS] Filename hint:', filenameHint, '| IPTC:', locationText);

          // Pre-declare resolvedLocation
          let resolvedLocation: {
            country?: string; countryCode?: string; state?: string;
            county?: string; constituency?: string; ward?: string;
            city?: string; suburb?: string;
            village?: string; road?: string; neighbourhood?: string;
            postcode?: string; displayName?: string; placeType?: string;
            source: 'nominatim' | 'bigdatacloud' | 'none';
            isFromImage: boolean;
          } = { source: 'none', isFromImage: false };

          // ═══ Layer 4: FORWARD GEOCODING (biased by visual estimate) ═══
          // When no EXIF GPS, geocode filename/IPTC text.
          // If visual estimation suggests a region, uses countrycodes filter.
          let forwardGeoResult: any = null;
          if (!gps) {
            // Strategy A: If we have visual hints, try filename + country code filter FIRST
            if (filenameHint && visualHintCountryCodes.length > 0) {
              const ccParam = visualHintCountryCodes.slice(0, 5).join(',');
              console.log(`[ForwardGeocode] Trying "${filenameHint}" with visual bias: ${ccParam}`);
              forwardGeoResult = await this.forwardGeocodeWithBias(filenameHint, ccParam);
            }

            // Strategy B: Try filename without bias
            if (!forwardGeoResult && filenameHint) {
              forwardGeoResult = await this.forwardGeocode(filenameHint);
            }

            // Strategy C: Try IPTC/XMP location text
            if (!forwardGeoResult && locationText) {
              const iptcQuery = [locationText.locationName, locationText.city, locationText.state, locationText.country]
                .filter(Boolean).join(' ');
              if (iptcQuery.length > 2) {
                forwardGeoResult = await this.forwardGeocode(iptcQuery);
              }
            }

            // Apply forward geocoding result
            if (forwardGeoResult) {
              gps = { latitude: forwardGeoResult.latitude, longitude: forwardGeoResult.longitude };
              gpsSource = 'none';
              gpsAccuracy = forwardGeoResult.importance > 0.6 ? 5000 : forwardGeoResult.importance > 0.3 ? 15000 : 30000;
              locationMethod = filenameHint && forwardGeoResult ? 'filename-geocode' : 'iptc-geocode';
              metadata.gps = gps;
              resolvedLocation = {
                country: forwardGeoResult.country,
                countryCode: forwardGeoResult.countryCode,
                state: forwardGeoResult.state,
                county: forwardGeoResult.county,
                city: forwardGeoResult.city,
                suburb: forwardGeoResult.suburb,
                village: forwardGeoResult.village,
                road: forwardGeoResult.road,
                neighbourhood: forwardGeoResult.neighbourhood,
                postcode: forwardGeoResult.postcode,
                displayName: forwardGeoResult.displayName,
                placeType: forwardGeoResult.placeType,
                source: 'nominatim',
                isFromImage: false,
              };
              if (forwardGeoResult.city) locationContext.city = forwardGeoResult.city;
              if (forwardGeoResult.country) locationContext.country = forwardGeoResult.country;
              if (forwardGeoResult.state) locationContext.region = forwardGeoResult.state;
              locationContext.filenameHint = `${filenameHint} → ${forwardGeoResult.displayName?.split(',').slice(0, 3).join(',')}`;
              console.log('[GPS] Forward geocode result:', forwardGeoResult.displayName);
            }
          }

          // Merge GPS into metadata
          if (gps) {
            metadata.gps = gps;
          }

          // ═══ REVERSE GEOCODING — only for EXIF GPS ═══
          if (gps && gpsSource === 'exif') {
            resolvedLocation = { ...await this.reverseGeocode(gps.latitude, gps.longitude), isFromImage: true };
            if (resolvedLocation.source !== 'none') {
              if (resolvedLocation.city) locationContext.city = resolvedLocation.city;
              if (resolvedLocation.country) locationContext.country = resolvedLocation.country;
              if (resolvedLocation.state) locationContext.region = resolvedLocation.state;
            }
          }

          // ═══ VISUAL ESTIMATE AUTO-APPLY (only if nothing else found) ═══
          if (locationMethod === 'none' && geoEstimate?.bestEstimate && geoEstimate.bestEstimate.confidence >= 0.25) {
            const est = geoEstimate.bestEstimate;
            gps = { latitude: est.latitude, longitude: est.longitude };
            gpsSource = 'none';
            gpsAccuracy = 50000;
            locationMethod = 'visual-estimate';
            metadata.gps = gps;
            console.log('[GPS] Visual estimate applied:', est.region, est.country);

            try {
              const estResolved = await this.reverseGeocode(est.latitude, est.longitude);
              if (estResolved.source !== 'none') {
                resolvedLocation = { ...estResolved, isFromImage: false };
                if (estResolved.city) locationContext.city = estResolved.city;
                if (estResolved.country) locationContext.country = estResolved.country;
                if (estResolved.state) locationContext.region = estResolved.state;
              }
            } catch { /* reverse geocode failed */ }
          }

          URL.revokeObjectURL(imageUrl);
          resolve({
            ...features,
            metadata,
            gpsSource,
            gpsAccuracy,
            locationMethod,
            imageFingerprint,
            imageForensicId,
            locationContext,
            resolvedLocation,
            geoEstimate,
            isReliableTerrainImage: features.isReliableTerrainImage,
          });
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(imageUrl);
        reject(new Error('Failed to load image'));
      };
      img.src = imageUrl;
    });
  }
}