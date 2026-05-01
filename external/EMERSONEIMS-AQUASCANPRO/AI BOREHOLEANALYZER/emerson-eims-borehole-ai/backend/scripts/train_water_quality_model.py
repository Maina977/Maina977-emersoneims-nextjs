#!/usr/bin/env python3
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import StandardScaler

def create_water_quality_nn():
    model = tf.keras.Sequential([
        tf.keras.layers.Dense(256, activation='relu', input_shape=(25,)),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Dropout(0.3),
        tf.keras.layers.Dense(128, activation='relu'),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Dropout(0.3),
        tf.keras.layers.Dense(64, activation='relu'),
        tf.keras.layers.Dense(32, activation='relu'),
        tf.keras.layers.Dense(8, activation='linear')  # 8 water quality parameters
    ])
    model.compile(
        optimizer=tf.keras.optimizers.Adam(0.001),
        loss='mse',
        metrics=['mae', tf.keras.metrics.RootMeanSquaredError()]
    )
    return model

def train_model():
    # Generate synthetic data
    n_samples = 20000
    X_train = np.random.randn(n_samples, 25)
    y_train = np.random.randn(n_samples, 8)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    
    X_val = np.random.randn(5000, 25)
    X_val_scaled = scaler.transform(X_val)
    y_val = np.random.randn(5000, 8)
    
    model = create_water_quality_nn()
    
    callbacks = [
        tf.keras.callbacks.EarlyStopping(patience=30, restore_best_weights=True),
        tf.keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=15, min_lr=0.00001),
        tf.keras.callbacks.ModelCheckpoint('../ai_models/water_quality/neural_network.h5', save_best_only=True)
    ]
    
    history = model.fit(
        X_train_scaled, y_train,
        validation_data=(X_val_scaled, y_val),
        epochs=150,
        batch_size=128,
        callbacks=callbacks
    )
    
    # Save scaler
    import pickle
    with open('../ai_models/water_quality/scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)
    
    print("Water quality model training completed!")

if __name__ == "__main__":
    train_model()