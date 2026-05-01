import torch
import torch.nn as nn

class DepthEstimationModel:
    def __init__(self, model_type="DPT_Hybrid"):
        self.model_type = model_type
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
        if model_type == "DPT_Hybrid":
            self.model = torch.hub.load('intel-isl/MiDaS', 'DPT_Hybrid')
        else:
            self.model = torch.hub.load('intel-isl/MiDaS', 'MiDaS_small')
        
        self.model.to(self.device)
        self.model.eval()
    
    def predict(self, image_tensor):
        with torch.no_grad():
            prediction = self.model(image_tensor)
        return prediction
    
    def load_weights(self, weights_path):
        self.model.load_state_dict(torch.load(weights_path, map_location=self.device))
        return self