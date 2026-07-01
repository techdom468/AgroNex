import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

def train_and_save_model():
    print("Downloading actual agricultural dataset...")
    # Downloading the popular Kaggle crop recommendation dataset from a public mirror
    dataset_url = "https://raw.githubusercontent.com/Gladiator07/Harvestify/master/Data-processed/crop_recommendation.csv"
    
    try:
        df = pd.read_csv(dataset_url)
        print("Dataset loaded successfully!")
    except Exception as e:
        print(f"Error downloading dataset: {e}")
        return
        
    print("Preparing data for training...")
    # The dataset columns are: N, P, K, temperature, humidity, ph, rainfall, label
    X = df.drop('label', axis=1)
    y = df['label']
    
    print("Training Random Forest Model...")
    model = RandomForestClassifier(n_estimators=10, random_state=42)
    model.fit(X, y)
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(os.path.abspath(__file__)), exist_ok=True)
    
    # Save the model
    model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'crop_model.pkl')
    joblib.dump(model, model_path)
    
    print(f"Model saved successfully at: {model_path}")
    print(f"Accuracy on training data: {model.score(X, y):.2f}")

if __name__ == "__main__":
    train_and_save_model()
