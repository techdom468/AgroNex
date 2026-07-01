import os
from ultralytics import YOLO

def train_model():
    print("Initializing YOLOv8 Plant Disease Detection Training...")
    
    # 1. Hardware Check
    # This script requires a GPU for 54,000+ images. 
    # For local testing, we load the pre-trained weights.
    
    # Load a pretrained YOLOv8n model
    model = YOLO("yolov8n.pt")
    
    # 2. Dataset Definition
    # PlantVillage dataset normally requires a custom data.yaml
    # Example data.yaml structure:
    # path: ../datasets/plantvillage
    # train: images/train
    # val: images/val
    # nc: 38
    # names: ['Apple_scab', 'Apple_healthy', ...]
    
    # 3. Training Process (Commented out to prevent local crashes)
    """
    results = model.train(
        data="plantvillage_data.yaml", # Path to your dataset YAML
        epochs=100,                    # Number of epochs
        imgsz=256,                     # Image resolution (PlantVillage is 256x256)
        batch=32,                      # Batch size
        device=0,                      # GPU device ID
        workers=8,                     # Dataloader workers
        project="AgroNex_Disease_AI",  # Project name
        name="yolov8n_plantvillage"    # Run name
    )
    
    # The best weights are automatically saved to AgroNex_Disease_AI/yolov8n_plantvillage/weights/best.pt
    """
    
    # For Local Dev Setup: We just download YOLOv8n and copy it to our disease model directory
    # so the Django application can use it as a placeholder `best.pt`.
    
    model_dir = os.path.dirname(os.path.abspath(__file__))
    best_pt_path = os.path.join(model_dir, "best.pt")
    
    # Mocking the training process by exporting the base yolov8n.pt as our best.pt
    model.save(best_pt_path)
    
    print(f"✅ Training script ready. Pre-trained dummy model saved to {best_pt_path}")
    print("To train on the real PlantVillage dataset, uncomment the model.train() block and run on a GPU instance.")

if __name__ == "__main__":
    train_and_save = train_model()
