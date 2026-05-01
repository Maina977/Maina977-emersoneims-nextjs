#!/usr/bin/env python3
import numpy as np
import tensorflow as tf
from tensorflow import keras
from sklearn.model_selection import train_test_split

def create_cnn_attention_model(input_shape=(128, 128, 3)):
    inputs = keras.Input(shape=input_shape)
    
    # CNN layers
    x = keras.layers.Conv2D(32, 3, activation='relu', padding='same')(inputs)
    x = keras.layers.MaxPooling2D(2)(x)
    x = keras.layers.Conv2D(64, 3, activation='relu', padding='same')(x)
    x = keras.layers.MaxPooling2D(2)(x)
    x = keras.layers.Conv2D(128, 3, activation='relu', padding='same')(x)
    x = keras.layers.GlobalAveragePooling2D()(x)
    
    # Attention mechanism
    attention = keras.layers.Dense(128, activation='tanh')(x)
    attention = keras.layers.Dense(128, activation='softmax')(attention)
    x = keras.layers.multiply([x, attention])
    
    # Output layers
    x = keras.layers.Dense(64, activation='relu')(x)
    outputs = keras.layers.Dense(12, activation='softmax')(x)
    
    model = keras.Model(inputs, outputs)
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    return model

def train_model():
    # Generate synthetic training data
    X_train = np.random.rand(10000, 128, 128, 3)
    y_train = np.random.randint(0, 12, 10000)
    y_train = keras.utils.to_categorical(y_train, 12)
    
    X_val = np.random.rand(2000, 128, 128, 3)
    y_val = np.random.randint(0, 12, 2000)
    y_val = keras.utils.to_categorical(y_val, 12)
    
    model = create_cnn_attention_model()
    
    callbacks = [
        keras.callbacks.EarlyStopping(patience=10, restore_best_weights=True),
        keras.callbacks.ModelCheckpoint('../ai_models/geological/weights/best_model.h5', save_best_only=True),
        keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=5)
    ]
    
    history = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=100,
        batch_size=32,
        callbacks=callbacks
    )
    
    print("Model training completed!")
    return model

if __name__ == "__main__":
    train_model()