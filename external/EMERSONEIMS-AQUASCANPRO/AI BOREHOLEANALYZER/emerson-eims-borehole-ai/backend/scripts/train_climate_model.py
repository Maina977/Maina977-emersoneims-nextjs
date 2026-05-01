#!/usr/bin/env python3
import numpy as np
import tensorflow as tf

def create_lstm_model(input_shape=(24, 10)):
    model = tf.keras.Sequential([
        tf.keras.layers.LSTM(128, return_sequences=True, input_shape=input_shape),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.LSTM(64, return_sequences=True),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.LSTM(32),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Dense(16, activation='relu'),
        tf.keras.layers.Dense(1, activation='linear')
    ])
    model.compile(optimizer=tf.keras.optimizers.Adam(0.001), loss='mse', metrics=['mae'])
    return model

def train_model():
    # Generate synthetic climate time series
    n_samples = 5000
    X_train = np.random.randn(n_samples, 24, 10)
    y_train = np.random.randn(n_samples, 1)
    
    X_val = np.random.randn(1000, 24, 10)
    y_val = np.random.randn(1000, 1)
    
    model = create_lstm_model()
    
    callbacks = [
        tf.keras.callbacks.EarlyStopping(patience=20, restore_best_weights=True),
        tf.keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=10),
        tf.keras.callbacks.ModelCheckpoint('../ai_models/climate/lstm_model.h5', save_best_only=True)
    ]
    
    history = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=100,
        batch_size=64,
        callbacks=callbacks
    )
    
    print("Climate model training completed!")

if __name__ == "__main__":
    train_model()