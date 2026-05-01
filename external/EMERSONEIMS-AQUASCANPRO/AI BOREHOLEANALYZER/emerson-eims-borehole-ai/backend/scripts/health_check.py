#!/usr/bin/env python3
import requests
import sys

def check_health():
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print("✅ Backend is healthy")
            return True
        else:
            print(f"❌ Backend returned {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Backend is not responding: {e}")
        return False

if __name__ == "__main__":
    sys.exit(0 if check_health() else 1)