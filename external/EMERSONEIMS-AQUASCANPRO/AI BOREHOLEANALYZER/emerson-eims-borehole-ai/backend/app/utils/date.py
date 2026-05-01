from datetime import datetime

def format_datetime(dt: datetime, format_str: str = "%Y-%m-%d %H:%M:%S") -> str:
    return dt.strftime(format_str)

def parse_date(date_str: str) -> datetime:
    return datetime.fromisoformat(date_str)