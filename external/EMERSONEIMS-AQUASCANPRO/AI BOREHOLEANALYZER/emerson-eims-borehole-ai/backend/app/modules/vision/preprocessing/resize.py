from PIL import Image
import numpy as np

class ImageResizer:
    @staticmethod
    def resize_to_target(image, target_size=(224, 224), maintain_aspect=True):
        if maintain_aspect:
            image.thumbnail(target_size, Image.Resampling.LANCZOS)
            new_img = Image.new('RGB', target_size, (0, 0, 0))
            new_img.paste(image, ((target_size[0] - image.size[0]) // 2,
                                  (target_size[1] - image.size[1]) // 2))
            return new_img
        else:
            return image.resize(target_size, Image.Resampling.LANCZOS)
    
    @staticmethod
    def batch_resize(images, target_size=(224, 224)):
        return [ImageResizer.resize_to_target(img, target_size) for img in images]
    
    @staticmethod
    def adaptive_resize(image, max_dimension=1024):
        ratio = max_dimension / max(image.size)
        new_size = tuple(int(dim * ratio) for dim in image.size)
        return image.resize(new_size, Image.Resampling.LANCZOS)