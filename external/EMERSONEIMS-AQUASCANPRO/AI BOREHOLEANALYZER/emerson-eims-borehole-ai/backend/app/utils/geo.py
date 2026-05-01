import math

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371  # Earth's radius in km
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    
    a = math.sin(delta_lat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    return R * c

def get_coordinates(address: str) -> dict:
    """
    Geocode an address using the free Nominatim API (OpenStreetMap).
    Returns real coordinates — no hardcoded fallback.
    """
    import urllib.request
    import urllib.parse
    import json

    encoded = urllib.parse.quote(address)
    url = (
        f"https://nominatim.openstreetmap.org/search"
        f"?q={encoded}&format=json&limit=1"
    )
    try:
        req = urllib.request.Request(url, headers={
            "User-Agent": "BoreholeAI/2.0 (geocoding)"
        })
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
            if data and len(data) > 0:
                return {
                    "latitude": float(data[0]["lat"]),
                    "longitude": float(data[0]["lon"]),
                    "display_name": data[0].get("display_name", ""),
                    "source": "Nominatim (OpenStreetMap)",
                }
    except Exception as exc:
        pass  # Fall through to error below

    return {
        "latitude": None,
        "longitude": None,
        "error": f"Geocoding failed for '{address}' — Nominatim API unreachable or no results",
    }