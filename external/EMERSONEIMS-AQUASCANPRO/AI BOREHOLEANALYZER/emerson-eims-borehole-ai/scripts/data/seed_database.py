#!/usr/bin/env python3

import sqlite3
import json
from datetime import datetime

def seed_database():
    conn = sqlite3.connect('borehole.db')
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            email TEXT UNIQUE,
            name TEXT,
            created_at TEXT
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS analyses (
            id INTEGER PRIMARY KEY,
            user_id INTEGER,
            image_url TEXT,
            probability REAL,
            recommended_depth REAL,
            created_at TEXT
        )
    ''')
    
    # Seed sample data
    sample_users = [
        (1, 'user1@example.com', 'John Doe', datetime.now().isoformat()),
        (2, 'user2@example.com', 'Jane Smith', datetime.now().isoformat()),
    ]
    
    cursor.executemany('INSERT OR IGNORE INTO users VALUES (?,?,?,?)', sample_users)
    
    sample_analyses = [
        (1, 1, 'sample1.jpg', 0.78, 45, datetime.now().isoformat()),
        (2, 1, 'sample2.jpg', 0.65, 60, datetime.now().isoformat()),
        (3, 2, 'sample3.jpg', 0.82, 35, datetime.now().isoformat()),
    ]
    
    cursor.executemany('INSERT OR IGNORE INTO analyses VALUES (?,?,?,?,?,?)', sample_analyses)
    
    conn.commit()
    conn.close()
    
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_database()