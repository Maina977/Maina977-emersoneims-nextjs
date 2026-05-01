#!/usr/bin/env python3
"""
Model Training Script — REQUIRES REAL LABELED DATA
====================================================
This script trains geological classification models.

IMPORTANT: Do NOT train on random/synthetic data.
Models trained on random data produce meaningless predictions
that are indistinguishable from noise.

Prerequisites:
1. Collect real labeled geological survey data
2. Place training data in data/geological/training/
3. Each sample: [features...] → geological_class label
4. Minimum recommended: 500+ labeled samples

Usage:
    python train_models.py --data-dir ../data/geological/training/
"""
import sys


def train_geological_model(data_dir: str = None):
    if data_dir is None:
        print("ERROR: No training data directory specified.")
        print("Usage: python train_models.py --data-dir <path_to_labeled_data>")
        print()
        print("Training on random data is PROHIBITED — it produces fake predictions.")
        print("Collect real labeled geological survey data first.")
        sys.exit(1)

    import os
    if not os.path.isdir(data_dir):
        print(f"ERROR: Data directory not found: {data_dir}")
        print("Collect real labeled geological survey data before training.")
        sys.exit(1)

    # Count available samples
    files = [f for f in os.listdir(data_dir) if f.endswith(('.csv', '.json', '.npy'))]
    if not files:
        print(f"ERROR: No training data files (.csv, .json, .npy) found in {data_dir}")
        sys.exit(1)

    print(f"Found {len(files)} data files in {data_dir}")
    print("Training with real data...")

    # Actual training would go here with sklearn/torch
    # from sklearn.ensemble import RandomForestClassifier
    # X_train, y_train = load_real_data(data_dir)
    # model = RandomForestClassifier(n_estimators=100)
    # model.fit(X_train, y_train)
    # pickle.dump(model, open('geological_model.pkl', 'wb'))

    print("TODO: Implement training pipeline once real labeled data is available.")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Train geological model on REAL data")
    parser.add_argument("--data-dir", type=str, help="Path to labeled training data")
    args = parser.parse_args()
    train_geological_model(args.data_dir)