/**
 * Google Apps Script web app — read/write API in front of a Google Sheet.
 *
 * This is the free, durable, laptop-independent datastore that backs the
 * website's leads + analytics. It implements the CANONICAL CONTRACT in
 * integrations/google-sheets/CONTRACT.md (sections 2, 3, 4) EXACTLY.
 *
 * ============================  SETUP STEPS  ============================
 * (1) Create a Google Sheet (owned by emersoneimservices@gmail.com).
 * (2) In that Sheet: Extensions -> Apps Script. Delete the stub, paste this
 *     whole file (Code.gs) in, and Save.
 * (3) Project Settings (gear icon) -> Script Properties -> Add script property:
 *         Name:  SHEET_TOKEN
 *         Value: <the SAME long random secret as the website's SHEET_TOKEN env var>
 *     (Without this property set, the web app refuses to serve or write data.)
 * (4) Deploy -> New deployment -> type "Web app".
 *         Execute as:      Me
 *         Who has access:  Anyone
 *     Deploy, authorize, then copy the ".../exec" URL into the website's
 *     SHEET_WEBAPP_URL env var (Vercel).
 *
 * Runtime: V8 (Apps Script). No Node APIs. Everything below is plain GAS.
 * ======================================================================
 */

// ---- Sheet schema (CONTRACT section 4) --------------------------------------

var EVENTS_TAB = 'Events';
var EVENTS_HEADER = ['ts', 'day', 'site', 'host', 'path', 'type', 'ref',
                     'label', 'visitor', 'country', 'region', 'city'];

var LEADS_TAB = 'Leads';
var LEADS_HEADER = ['received_at', 'name', 'email', 'phone', 'company',
                    'service', 'message', 'source', 'location', 'country',
                    'region', 'city', 'status'];

var LIVE_WINDOW_SECONDS = 300; // live_visitors: ts within last 300s
var GEO_LIMIT = 50;            // geo aggregations limited to 50 rows

// ---- JSON response helpers --------------------------------------------------

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Constant-time-ish string comparison. Rejects when the stored token is empty
 * so the app never serves data without a configured SHEET_TOKEN.
 */
function tokenOk(provided) {
  var stored = PropertiesService.getScriptProperties().getProperty('SHEET_TOKEN');
  if (!stored || !provided) return false;
  if (String(provided).length !== String(stored).length) return false;
  var a = String(provided), b = String(stored), diff = 0;
  for (var i = 0; i < a.length; i++) {
    diff |= (a.charCodeAt(i) ^ b.charCodeAt(i));
  }
  return diff === 0;
}

// ---- Sheet access -----------------------------------------------------------

/** Get a tab by name, creating it with the given header row if missing. */
function getOrCreateTab(name, header) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(header);
  } else if (sh.getLastRow() === 0) {
    sh.appendRow(header);
  }
  return sh;
}

/**
 * Read a whole tab once into an array of row-objects keyed by the header row.
 * Returns [] when the tab is missing or has only a header / is empty.
 * Reads getDataRange().getValues() exactly once per call (efficient).
 */
function readRows(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name);
  if (!sh) return [];
  var values = sh.getDataRange().getValues();
  if (values.length < 2) return []; // header only or empty
  var header = values[0];
  var out = [];
  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    var obj = {};
    for (var c = 0; c < header.length; c++) {
      obj[String(header[c])] = row[c];
    }
    out.push(obj);
  }
  return out;
}

/**
 * Coerce a value to a length-capped string and neutralize spreadsheet/CSV
 * formula injection: a cell beginning with = + - @ is prefixed with a single
 * quote so Sheets/Excel treat it as text when the owner opens or exports the
 * sheet. The API itself never evaluates these, but a human viewer might.
 */
function cell(value, max) {
  if (value === null || value === undefined) return '';
  var s = String(value);
  if (s.length > max) s = s.slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

// ============================  WRITES (doPost)  ===============================

function doPost(e) {
  try {
    var body = (e && e.postData && e.postData.contents) ? e.postData.contents : '';
    var data = body ? JSON.parse(body) : {};

    if (!tokenOk(data.token)) {
      return jsonOut({ ok: false, error: 'unauthorized' });
    }

    if (data.kind === 'event') {
      var ev = data.event || {};
      var sh = getOrCreateTab(EVENTS_TAB, EVENTS_HEADER);
      // ts is numeric; the rest are short codes/paths. Defensive caps so a rogue
      // caller can't bloat cells even if the token ever leaks.
      sh.appendRow([
        Number(ev.ts) || '', cell(ev.day, 10), cell(ev.site, 16), cell(ev.host, 120),
        cell(ev.path, 300), cell(ev.type, 16), cell(ev.ref, 120), cell(ev.label, 80),
        cell(ev.visitor, 32), cell(ev.country, 2), cell(ev.region, 80), cell(ev.city, 80)
      ]);
      return jsonOut({ ok: true });
    }

    if (data.kind === 'lead') {
      var ld = data.lead || {};
      var sl = getOrCreateTab(LEADS_TAB, LEADS_HEADER);
      sl.appendRow([
        cell(ld.received_at, 40), cell(ld.name, 200), cell(ld.email, 320), cell(ld.phone, 40),
        cell(ld.company, 200), cell(ld.service, 80), cell(ld.message, 5000), cell(ld.source, 120),
        cell(ld.location, 200), cell(ld.country, 2), cell(ld.region, 80), cell(ld.city, 80),
        cell(ld.status, 40)
      ]);
      return jsonOut({ ok: true });
    }

    return jsonOut({ ok: false, error: 'unknown_kind' });
  } catch (err) {
    // Never throw to the caller; always valid JSON.
    return jsonOut({ ok: false, error: 'exception' });
  }
}

// ============================  READS (doGet)  ================================

function doGet(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};
    var action = p.action || '';

    if (!tokenOk(p.token)) {
      // stats consumers expect {error:...}; keep that shape for all reads.
      return jsonOut({ error: 'unauthorized' });
    }

    if (action === 'stats') {
      var days = parseInt(p.days, 10);
      if (isNaN(days)) days = 30;
      if (days < 1) days = 1;
      if (days > 365) days = 365;
      return jsonOut(buildStats(days));
    }

    if (action === 'leads') {
      var limit = parseInt(p.limit, 10);
      if (isNaN(limit) || limit < 1) limit = 50;
      if (limit > 500) limit = 500;
      var rows = readRows(LEADS_TAB);
      var recent = rows.slice(Math.max(0, rows.length - limit)).reverse();
      return jsonOut({ leads: recent });
    }

    return jsonOut({ error: 'unknown_action' });
  } catch (err) {
    return jsonOut({ error: 'exception' });
  }
}

// ============================  AGGREGATION  =================================

/**
 * Build the AnalyticsStats JSON (CONTRACT section 3) from the Events tab over
 * the last `days`. Empty sheet -> all zeros. Never fabricates numbers.
 *
 * Rules:
 *  - views   = rows with type='pageview'
 *  - clicks  = rows with type='click'
 *  - visitors= distinct `visitor`
 *  - pings count ONLY toward live_visitors (never views/visitors)
 *  - today   = rows whose `day` == today's UTC date
 *  - live_visitors = distinct visitors with ts within last 300s
 *  - geo aggregations exclude empty values, order by views desc, limit 50
 */
function buildStats(days) {
  var nowMs = Date.now();
  var nowSec = Math.floor(nowMs / 1000);
  var todayUtc = utcDayString(new Date(nowMs));

  // Window lower bound (inclusive) by UTC day string.
  var minDayMs = nowMs - (days - 1) * 86400000;
  var minDay = utcDayString(new Date(minDayMs));

  var rows = readRows(EVENTS_TAB);

  // Totals / today
  var totalViews = 0, totalClicks = 0;
  var visitorsSet = {};         // distinct visitor (pageview/click only)
  var todayViews = 0;
  var todayVisitors = {};
  var liveVisitors = {};

  // Grouped accumulators
  var series = {};       // key day|site
  var pages = {};        // key site|path
  var sites = {};        // key site
  var clicksByLabel = {};// key label|site
  var countries = {};    // key country
  var regions = {};      // key country|region
  var cities = {};       // key country|region|city

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var type = String(row.type || '');
    var day = String(row.day || '');
    var site = String(row.site || '');
    var path = String(row.path || '');
    var label = String(row.label || '');
    var visitor = String(row.visitor || '');
    var country = String(row.country || '');
    var region = String(row.region || '');
    var city = String(row.city || '');
    var ts = Number(row.ts) || 0;

    // live_visitors: pings included here; ts within last 300s.
    if (visitor && ts && (nowSec - ts) <= LIVE_WINDOW_SECONDS && (nowSec - ts) >= 0) {
      liveVisitors[visitor] = true;
    }

    // Pings contribute ONLY to live_visitors — skip everything else.
    if (type === 'ping') continue;

    // Window filter (by UTC day string) for all the aggregations below.
    if (day && day < minDay) continue;
    if (day && day > todayUtc) continue;

    var isView = (type === 'pageview');
    var isClick = (type === 'click');

    if (isView) totalViews++;
    if (isClick) totalClicks++;
    if (visitor) visitorsSet[visitor] = true;

    // today (UTC day match)
    if (day === todayUtc) {
      if (isView) todayViews++;
      if (visitor) todayVisitors[visitor] = true;
    }

    // series: per day + site
    if (day) {
      accView(series, day + '|' + site, { day: day, site: site }, isView, visitor);
    }
    // top_pages: per site + path
    accView(pages, site + '|' + path, { site: site, path: path }, isView, visitor);
    // per_site
    accView(sites, site, { site: site }, isView, visitor);

    // top_clicks: clicks with non-empty label, grouped by label + site
    if (isClick && label !== '') {
      var ck = label + '|' + site;
      if (!clicksByLabel[ck]) clicksByLabel[ck] = { label: label, site: site, clicks: 0 };
      clicksByLabel[ck].clicks++;
    }

    // geo aggregations (exclude empty values), counted on views.
    if (country !== '') {
      accView(countries, country, { country: country }, isView, visitor);
      if (region !== '') {
        accView(regions, country + '|' + region,
                { country: country, region: region }, isView, visitor);
        if (city !== '') {
          accView(cities, country + '|' + region + '|' + city,
                  { country: country, region: region, city: city }, isView, visitor);
        }
      }
    }
  }

  return {
    generated_at: new Date(nowMs).toISOString(),
    window_days: days,
    totals: {
      views: totalViews,
      clicks: totalClicks,
      visitors: countKeys(visitorsSet)
    },
    today: {
      views: todayViews,
      visitors: countKeys(todayVisitors)
    },
    live_visitors: countKeys(liveVisitors),
    series: finalizeViewGroups(series, ['day', 'site'], false),
    top_pages: finalizeViewGroups(pages, ['site', 'path'], true),
    per_site: finalizeViewGroups(sites, ['site'], true),
    top_clicks: finalizeClicks(clicksByLabel),
    top_countries: finalizeViewGroups(countries, ['country'], true, GEO_LIMIT),
    top_regions: finalizeViewGroups(regions, ['country', 'region'], true, GEO_LIMIT),
    top_cities: finalizeViewGroups(cities, ['country', 'region', 'city'], true, GEO_LIMIT)
  };
}

// ---- aggregation helpers ----------------------------------------------------

/** Accumulate views + distinct visitors into a grouped bucket. */
function accView(map, key, dims, isView, visitor) {
  var b = map[key];
  if (!b) {
    b = { dims: dims, views: 0, _visitors: {} };
    map[key] = b;
  }
  if (isView) b.views++;
  if (visitor) b._visitors[visitor] = true;
}

/**
 * Turn a view-group map into the contract array shape.
 * fields = ordered dimension keys to copy onto each output object.
 * sortByViews=true -> order by views desc (and limit if provided).
 */
function finalizeViewGroups(map, fields, sortByViews, limit) {
  var arr = [];
  for (var k in map) {
    if (!map.hasOwnProperty(k)) continue;
    var b = map[k];
    var o = {};
    for (var f = 0; f < fields.length; f++) o[fields[f]] = b.dims[fields[f]];
    o.views = b.views;
    o.visitors = countKeys(b._visitors);
    arr.push(o);
  }
  if (sortByViews) {
    arr.sort(function (x, y) { return y.views - x.views; });
  } else {
    // series: stable chronological by day then site.
    arr.sort(function (x, y) {
      if (x.day < y.day) return -1;
      if (x.day > y.day) return 1;
      return String(x.site) < String(y.site) ? -1 : (String(x.site) > String(y.site) ? 1 : 0);
    });
  }
  if (limit && arr.length > limit) arr = arr.slice(0, limit);
  return arr;
}

/** top_clicks: order by clicks desc. */
function finalizeClicks(map) {
  var arr = [];
  for (var k in map) {
    if (map.hasOwnProperty(k)) arr.push(map[k]);
  }
  arr.sort(function (x, y) { return y.clicks - x.clicks; });
  return arr;
}

function countKeys(obj) {
  var n = 0;
  for (var k in obj) { if (obj.hasOwnProperty(k)) n++; }
  return n;
}

/** UTC date as YYYY-MM-DD (matches the website's `day` column). */
function utcDayString(d) {
  var y = d.getUTCFullYear();
  var m = d.getUTCMonth() + 1;
  var day = d.getUTCDate();
  return y + '-' + (m < 10 ? '0' + m : m) + '-' + (day < 10 ? '0' + day : day);
}
