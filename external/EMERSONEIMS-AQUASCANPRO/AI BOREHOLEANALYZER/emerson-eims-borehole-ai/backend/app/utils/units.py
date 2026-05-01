def convert_depth(meters: float, to_unit: str = "ft") -> float:
    if to_unit == "ft":
        return meters * 3.28084
    return meters

def convert_yield(m3_per_hour: float, to_unit: str = "gpm") -> float:
    if to_unit == "gpm":
        return m3_per_hour * 4.40287
    return m3_per_hour