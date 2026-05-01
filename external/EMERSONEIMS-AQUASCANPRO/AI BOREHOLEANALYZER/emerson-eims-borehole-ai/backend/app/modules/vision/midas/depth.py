import torch
import torchvision.transforms as transforms
from PIL import Image
import numpy as np

class MiDaSDepthEstimator:
    def __init__(self):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = torch.hub.load('intel-isl/MiDaS', 'MiDaS_small')
        self.model.to(self.device)
        self.model.eval()
        
        self.transform = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])
    
    def estimate_depth(self, image_path):
        img = Image.open(image_path).convert('RGB')
        img_tensor = self.transform(img).unsqueeze(0).to(self.device)
        
        with torch.no_grad():
            depth = self.model(img_tensor)
        
        depth = depth.squeeze().cpu().numpy()
        depth_normalized = (depth - depth.min()) / (depth.max() - depth.min())
        
        return {
            "depth_map": depth_normalized.tolist(),
            "min_depth": float(depth.min()),
            "max_depth": float(depth.max()),
            "mean_depth": float(depth.mean())
        }
    
    def get_terrain_features(self, depth_map):
        depth_array = np.array(depth_map)
        
        # Calculate terrain features
        slope = np.gradient(depth_array)
        roughness = np.std(depth_array)
        
        return {
            "slope_mean": float(np.mean(slope)),
            "roughness": float(roughness),
            "is_valley": float(depth_array.min()) < 0.2,
            "is_mountain": float(depth_array.max()) > 0.8
        }