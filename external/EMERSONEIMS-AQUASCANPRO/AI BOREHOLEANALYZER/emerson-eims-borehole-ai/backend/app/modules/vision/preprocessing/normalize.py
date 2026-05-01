import numpy as np
from PIL import Image

class ImageNormalizer:
    @staticmethod
    def normalize_pixel_values(image_array, method='minmax'):
        if method == 'minmax':
            min_val = image_array.min()
            max_val = image_array.max()
            return (image_array - min_val) / (max_val - min_val + 1e-8)
        elif method == 'zscore':
            mean = image_array.mean()
            std = image_array.std()
            return (image_array - mean) / (std + 1e-8)
        elif method == 'imagenet':
            mean = np.array([0.485, 0.456, 0.406])
            std = np.array([0.229, 0.224, 0.225])
            return (image_array - mean) / std
    
    @staticmethod
    def apply_clahe(image, clip_limit=2.0, grid_size=(8, 8)):
        import cv2
        img_array = np.array(image)
        
        if len(img_array.shape) == 3:
            lab = cv2.cvtColor(img_array, cv2.COLOR_RGB2LAB)
            l, a, b = cv2.split(lab)
            clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=grid_size)
            l = clahe.apply(l)
            lab = cv2.merge([l, a, b])
            return Image.fromarray(cv2.cvtColor(lab, cv2.COLOR_LAB2RGB))
        else:
            clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=grid_size)
            return Image.fromarray(clahe.apply(img_array))