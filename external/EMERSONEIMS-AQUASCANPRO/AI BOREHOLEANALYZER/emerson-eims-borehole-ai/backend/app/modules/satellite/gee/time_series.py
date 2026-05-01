import json
import urllib.request
import numpy as np


class TimeSeriesExtractor:
    def extract_time_series(self, point, collection, start_date, end_date):
        """
        Extract time series from real Open-Meteo historical data.
        GEE requires authentication — this uses free Open-Meteo as substitute.
        Maps collection names to appropriate Open-Meteo variables.
        """
        lat, lon = (point[1], point[0]) if isinstance(point, (list, tuple)) else (0, 0)

        variable_map = {
            "MODIS/006/MOD13Q1": "soil_moisture_0_to_7cm",
            "NASA/GPM_L3/IMERG_V06": "precipitation_sum",
            "ECMWF/ERA5_LAND/DAILY_AGGR": "temperature_2m_mean",
        }
        var = variable_map.get(collection, "soil_moisture_0_to_7cm")

        sd = str(start_date)[:10] if not isinstance(start_date, str) else start_date[:10]
        ed = str(end_date)[:10] if not isinstance(end_date, str) else end_date[:10]

        try:
            url = (
                f"https://archive-api.open-meteo.com/v1/archive"
                f"?latitude={lat}&longitude={lon}"
                f"&start_date={sd}&end_date={ed}"
                f"&daily={var}"
            )
            req = urllib.request.Request(url, headers={"User-Agent": "BoreholeAI/2.0"})
            with urllib.request.urlopen(req, timeout=20) as resp:
                data = json.loads(resp.read().decode())
                dates = data.get("daily", {}).get("time", [])
                values = data.get("daily", {}).get(var, [])
                clean = [(d, v) for d, v in zip(dates, values) if v is not None]
                if clean:
                    ds, vs = zip(*clean)
                    vs = [float(v) for v in vs]
                    return {
                        "dates": list(ds),
                        "values": vs,
                        "statistics": {
                            "mean": float(np.mean(vs)),
                            "std": float(np.std(vs)),
                            "trend": float((vs[-1] - vs[0]) / max(len(vs), 1)),
                        },
                        "source": f"Open-Meteo ERA5 archive ({var})",
                    }
        except Exception:
            pass

        raise RuntimeError(
            "Time series extraction failed — Open-Meteo unreachable "
            "and Google Earth Engine requires authentication credentials. "
            "Configure GEE service account or check network connectivity."
        )