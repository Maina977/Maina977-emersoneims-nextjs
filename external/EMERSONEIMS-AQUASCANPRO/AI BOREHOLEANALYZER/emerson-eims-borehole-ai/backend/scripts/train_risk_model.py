#!/usr/bin/env python3
import numpy as np
import pickle
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.metrics import accuracy_score

def train_risk_model():
    # Generate synthetic risk data
    n_samples = 10000
    X_train = np.random.randn(n_samples, 30)
    y_train = np.random.randint(0, 4, n_samples)  # 4 risk levels
    
    X_val = np.random.randn(2000, 30)
    y_val = np.random.randint(0, 4, 2000)
    
    rf_model = RandomForestClassifier(n_estimators=200, max_depth=15, random_state=42)
    gb_model = GradientBoostingClassifier(n_estimators=150, learning_rate=0.05, max_depth=5)
    
    rf_model.fit(X_train, y_train)
    gb_model.fit(X_train, y_train)
    
    # Ensemble model (voting)
    class EnsembleModel:
        def __init__(self, models):
            self.models = models
        
        def predict(self, X):
            predictions = np.array([model.predict(X) for model in self.models])
            return np.round(np.mean(predictions, axis=0)).astype(int)
        
        def predict_proba(self, X):
            probas = np.array([model.predict_proba(X) for model in self.models])
            return np.mean(probas, axis=0)
    
    ensemble = EnsembleModel([rf_model, gb_model])
    
    # Evaluate
    y_pred = ensemble.predict(X_val)
    accuracy = accuracy_score(y_val, y_pred)
    print(f"Ensemble model accuracy: {accuracy:.4f}")
    
    with open('../ai_models/risk/ensemble_model.pkl', 'wb') as f:
        pickle.dump(ensemble, f)
    
    print("Risk model training completed!")

if __name__ == "__main__":
    train_risk_model()