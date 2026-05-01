import csv
import json
from app.database.session import SessionLocal
from app.database.models.borehole import Borehole

def seed_borehole_data():
    db = SessionLocal()
    try:
        # Sample borehole data
        sample_data = [
            {"location": "Nairobi, Kenya", "latitude": -1.286389, "longitude": 36.817223, "depth": 45, "yield_rate": 12.5, "success": "yes"},
            {"location": "Kisumu, Kenya", "latitude": -0.091702, "longitude": 34.767956, "depth": 60, "yield_rate": 8.2, "success": "yes"},
        ]
        
        for data in sample_data:
            borehole = Borehole(**data)
            db.add(borehole)
        
        db.commit()
        print(f"Seeded {len(sample_data)} borehole records")
    finally:
        db.close()

if __name__ == "__main__":
    seed_borehole_data()