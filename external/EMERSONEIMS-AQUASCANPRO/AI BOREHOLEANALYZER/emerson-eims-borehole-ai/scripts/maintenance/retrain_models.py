#!/usr/bin/env python3
import subprocess
import sys

def retrain_all_models():
    models = [
        "geological",
        "vegetation", 
        "soil",
        "climate",
        "historical",
        "risk",
        "cost",
        "water_quality"
    ]
    
    for model in models:
        print(f"Training {model} model...")
        subprocess.run([sys.executable, f"train_{model}.py"], cwd="../ai_models")
    
    print("All models retrained successfully!")

if __name__ == "__main__":
    retrain_all_models()