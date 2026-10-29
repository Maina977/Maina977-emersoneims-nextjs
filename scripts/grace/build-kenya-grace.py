"""
Cut real GRACE / GRACE-FO data to Kenya for AquaScan (public/data/kenya-grace.json).

Inputs (open, no account or token):
  1. G3P v1.12 groundwater storage anomalies (GWSA), 0.5 deg, monthly 2002-04..2023-09
     Guentner et al. (2024), doi:10.5880/G3P.2024.001
     https://isdc-data.gfz.de/grace/GravIS/G3P/v1.12/G3P_v1.12.zip  (member GWSA/...nc)
  2. GFZ GravIS RL06 terrestrial water storage (TWS), monthly 2002..latest
     Boergens, Dobslaw & Dill (2019), doi:10.5880/GFZ.GRAVIS_06_L3_TWS
     https://isdc-data.gfz.de/grace/GravIS/GFZ/Level-3/TWS/GRAVIS-3_GFZOP_0600_TWS_GRID_GFZ_0006.nc

Both are averaged to a 1 deg grid over Kenya (their effective resolution is
~250-300 km, so nothing is lost) and stored as monthly series in cm of
equivalent water height. Refresh monthly when GFZ publishes new TWS months.

Usage: python build-kenya-grace.py <gwsa.nc> <tws.nc> <out.json>
"""
import json
import sys
import datetime as dt

import numpy as np
import netCDF4

LAT_MIN, LAT_MAX, LON_MIN, LON_MAX = -5.0, 6.0, 33.0, 43.0


def find_var(ds, names):
    for n in names:
        if n in ds.variables:
            return ds.variables[n]
    return None


def grid_values(ds, skip=('uncertainty',)):
    """The 3-D data variable (time, lat, lon), however it is named."""
    for v in ds.variables.values():
        if v.ndim == 3 and not any(s in v.name.lower() for s in skip):
            return v
    raise SystemExit('no 3-D variable')


def to_cm(arr, units):
    u = (units or '').lower().strip()
    if u in ('m', 'meter', 'meters', 'm ewh', 'm water equivalent'):
        return arr * 100.0
    if u in ('mm', 'millimeter', 'millimeters', 'kg/m2', 'kg m-2', 'kg/m^2', 'mm ewh'):
        return arr / 10.0
    if u in ('cm', 'centimeter', 'centimeters', 'cm ewh'):
        return arr
    raise SystemExit(f'unknown units: {units!r}')


def months_of(tvar):
    """One label per solution. GRACE has a few partial-month solutions whose
    mid-date falls in the previous month (GravIS: 2011-10-31, 2015-04-26); a
    second solution in a month moves to the next month when that month has no
    solution of its own."""
    dates = netCDF4.num2date(tvar[:], tvar.units, getattr(tvar, 'calendar', 'standard'))
    labels = [(d.year, d.month) for d in dates]
    present = set(labels)
    seen = set()
    out = []
    for y, m in labels:
        if (y, m) in seen:
            ny, nm = (y + 1, 1) if m == 12 else (y, m + 1)
            if (ny, nm) not in present:
                present.add((ny, nm))
                y, m = ny, nm
        seen.add((y, m))
        out.append(f'{y:04d}-{m:02d}')
    return out


def merge_duplicates(months, cells):
    """Average any month that still has two solutions."""
    uniq = sorted(set(months))
    if len(uniq) == len(months):
        return months, cells
    idx = {m: [i for i, x in enumerate(months) if x == m] for m in uniq}
    merged = {}
    for k, s in cells.items():
        row = []
        for m in uniq:
            vals = [s[i] for i in idx[m] if s[i] is not None]
            row.append(round(sum(vals) / len(vals), 2) if vals else None)
        merged[k] = row
    return uniq, merged


def cut(path, label, var=None):
    ds = netCDF4.Dataset(path)
    v = ds.variables[var] if var else grid_values(ds)
    lat = find_var(ds, ['lat', 'latitude', 'y'])[:]
    lon = find_var(ds, ['lon', 'longitude', 'x'])[:]
    lon = np.where(lon > 180, lon - 360, lon)
    t = find_var(ds, ['time', 't'])
    months = months_of(t)
    dims = v.dimensions
    data = v[:]
    # Put the axes in (time, lat, lon) order.
    order = [next(i for i, d in enumerate(dims) if d.startswith(k)) for k in ('time', 'lat', 'lon')] if all(any(d.startswith(k) for d in dims) for k in ('time', 'lat', 'lon')) else [0, 1, 2]
    data = np.ma.transpose(data, order)
    data = to_cm(np.ma.filled(data.astype('float64'), np.nan), getattr(v, 'units', ''))
    print(label, 'var', v.name, 'units', getattr(v, 'units', ''), 'shape', data.shape, 'months', months[0], '..', months[-1], f'lat step {abs(lat[1]-lat[0])}')
    out = {}
    for la in np.arange(LAT_MIN + 0.5, LAT_MAX, 1.0):
        for lo in np.arange(LON_MIN + 0.5, LON_MAX, 1.0):
            mi = (lat >= la - 0.5) & (lat < la + 0.5)
            mj = (lon >= lo - 0.5) & (lon < lo + 0.5)
            if not mi.any() or not mj.any():
                continue
            block = data[:, mi][:, :, mj]
            series = np.nanmean(block.reshape(block.shape[0], -1), axis=1)
            if np.all(np.isnan(series)):
                continue
            out[f'{la:.1f},{lo:.1f}'] = [None if np.isnan(x) else round(float(x), 2) for x in series]
    months, out = merge_duplicates(months, out)
    return months, out, getattr(v, 'long_name', v.name)


def main():
    gwsa_path, tws_path, out_path = sys.argv[1:4]
    g_months, g_cells, g_name = cut(gwsa_path, 'GWSA')
    # G3P publishes a 1-sigma uncertainty per cell and month; its mean over the
    # record travels with the series.
    u_cells = {}
    if 'uncertainty' in netCDF4.Dataset(gwsa_path).variables:
        _, u_series, _ = cut(gwsa_path, 'GWSA uncertainty', 'uncertainty')
        u_cells = {k: round(float(np.nanmean([x for x in s if x is not None])), 2) for k, s in u_series.items()}
    t_months, t_cells, t_name = cut(tws_path, 'TWS')
    result = {
        'generated': dt.date.today().isoformat(),
        'grid': {'step': 1.0, 'note': 'cell key = centre "lat,lon"; values in cm equivalent water height, monthly anomalies'},
        'gwsa': {
            'name': 'Groundwater storage anomaly (G3P v1.12)',
            'variable': g_name,
            'citation': 'Guentner et al. (2024) Global Gravity-based Groundwater Product (G3P) v1.12, GFZ Data Services, doi:10.5880/G3P.2024.001',
            'method': 'GRACE/GRACE-FO total water storage minus soil moisture, snow, glaciers and surface water (ESA CCI and other products); 250 km Gaussian filter',
            'months': g_months, 'cells': g_cells,
            'meanUncertainty_cm': u_cells,
        },
        'tws': {
            'name': 'Terrestrial water storage anomaly (GFZ GravIS RL06)',
            'variable': t_name,
            'citation': 'Boergens, Dobslaw & Dill (2019) GFZ GravIS RL06 Continental Water Storage Anomalies, GFZ Data Services, doi:10.5880/GFZ.GRAVIS_06_L3_TWS',
            'method': 'GRACE (2002-2017) and GRACE-FO (2018-) monthly gravity fields; total of groundwater, soil water, surface water and snow',
            'months': t_months, 'cells': t_cells,
        },
    }
    with open(out_path, 'w') as f:
        json.dump(result, f, separators=(',', ':'))
    print('cells', len(g_cells), len(t_cells), 'written', out_path)


if __name__ == '__main__':
    main()
