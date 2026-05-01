import numpy as np
import random
from PIL import Image, ImageOps, ImageEnhance

class ImageAugmenter:
    def __init__(self, seed=None):
        if seed:
            random.seed(seed)
            np.random.seed(seed)
    
    def random_rotate(self, image, max_angle=30):
        """Random rotation"""
        angle = random.uniform(-max_angle, max_angle)
        return image.rotate(angle, expand=True)
    
    def random_flip(self, image, horizontal_prob=0.5, vertical_prob=0.1):
        """Random horizontal/vertical flip"""
        if random.random() < horizontal_prob:
            image = ImageOps.mirror(image)
        if random.random() < vertical_prob:
            image = ImageOps.flip(image)
        return image
    
    def random_brightness(self, image, max_delta=0.3):
        """Random brightness adjustment"""
        enhancer = ImageEnhance.Brightness(image)
        factor = 1.0 + random.uniform(-max_delta, max_delta)
        return enhancer.enhance(factor)
    
    def random_contrast(self, image, max_delta=0.3):
        """Random contrast adjustment"""
        enhancer = ImageEnhance.Contrast(image)
        factor = 1.0 + random.uniform(-max_delta, max_delta)
        return enhancer.enhance(factor)
    
    def random_saturation(self, image, max_delta=0.3):
        """Random saturation adjustment"""
        enhancer = ImageEnhance.Color(image)
        factor = 1.0 + random.uniform(-max_delta, max_delta)
        return enhancer.enhance(factor)
    
    def random_sharpness(self, image, max_delta=0.5):
        """Random sharpness adjustment"""
        enhancer = ImageEnhance.Sharpness(image)
        factor = 1.0 + random.uniform(-max_delta, max_delta)
        return enhancer.enhance(factor)
    
    def random_scale(self, image, min_scale=0.8, max_scale=1.2):
        """Random scaling"""
        scale = random.uniform(min_scale, max_scale)
        new_size = (int(image.width * scale), int(image.height * scale))
        return image.resize(new_size, Image.Resampling.LANCZOS)
    
    def random_crop(self, image, crop_ratio=(0.8, 1.0)):
        """Random crop"""
        crop_factor = random.uniform(crop_ratio[0], crop_ratio[1])
        new_width = int(image.width * crop_factor)
        new_height = int(image.height * crop_factor)
        
        left = random.randint(0, image.width - new_width)
        top = random.randint(0, image.height - new_height)
        
        return image.crop((left, top, left + new_width, top + new_height))
    
    def random_translate(self, image, max_translate=0.1):
        """Random translation"""
        dx = int(image.width * random.uniform(-max_translate, max_translate))
        dy = int(image.height * random.uniform(-max_translate, max_translate))
        
        return ImageOps.expand(image, border=(abs(dx), abs(dy), 0, 0))
    
    def random_shear(self, image, max_shear=0.2):
        """Random shear transformation"""
        from PIL import ImageTransform
        
        shear_x = random.uniform(-max_shear, max_shear)
        shear_y = random.uniform(-max_shear, max_shear)
        
        # Create shear matrix
        matrix = (1, shear_x, 0, shear_y, 1, 0)
        
        return image.transform(image.size, Image.AFFINE, matrix, resample=Image.BICUBIC)
    
    def add_gaussian_noise(self, image, mean=0, std=0.05):
        """Add Gaussian noise"""
        img_array = np.array(image) / 255.0
        noise = np.random.normal(mean, std, img_array.shape)
        noisy = np.clip(img_array + noise, 0, 1)
        return Image.fromarray((noisy * 255).astype(np.uint8))
    
    def add_salt_pepper_noise(self, image, prob=0.02):
        """Add salt and pepper noise"""
        img_array = np.array(image)
        noise = np.random.random(img_array.shape[:2])
        
        salt_mask = noise < prob / 2
        pepper_mask = noise > 1 - prob / 2
        
        img_array[salt_mask] = 255
        img_array[pepper_mask] = 0
        
        return Image.fromarray(img_array)
    
    def random_blur(self, image, max_radius=2):
        """Random Gaussian blur"""
        from PIL import ImageFilter
        
        radius = random.uniform(0, max_radius)
        return image.filter(ImageFilter.GaussianBlur(radius=radius))
    
    def random_erode(self, image, max_size=3):
        """Random erosion"""
        from PIL import ImageFilter
        
        size = random.randint(1, max_size)
        return image.filter(ImageFilter.MaxFilter(size))
    
    def random_dilate(self, image, max_size=3):
        """Random dilation"""
        from PIL import ImageFilter
        
        size = random.randint(1, max_size)
        return image.filter(ImageFilter.MinFilter(size))
    
    def apply_augmentation_sequence(self, image, augmentations=None):
        """Apply a sequence of augmentations"""
        if augmentations is None:
            augmentations = ['rotate', 'flip', 'brightness', 'contrast', 'scale']
        
        for aug in augmentations:
            if aug == 'rotate':
                image = self.random_rotate(image)
            elif aug == 'flip':
                image = self.random_flip(image)
            elif aug == 'brightness':
                image = self.random_brightness(image)
            elif aug == 'contrast':
                image = self.random_contrast(image)
            elif aug == 'saturation':
                image = self.random_saturation(image)
            elif aug == 'sharpness':
                image = self.random_sharpness(image)
            elif aug == 'scale':
                image = self.random_scale(image)
            elif aug == 'crop':
                image = self.random_crop(image)
            elif aug == 'translate':
                image = self.random_translate(image)
            elif aug == 'shear':
                image = self.random_shear(image)
            elif aug == 'gaussian_noise':
                image = self.add_gaussian_noise(image)
            elif aug == 'salt_pepper':
                image = self.add_salt_pepper_noise(image)
            elif aug == 'blur':
                image = self.random_blur(image)
        
        return image
    
    def generate_augmented_batch(self, image, num_augmentations=10):
        """Generate multiple augmented versions of an image"""
        augmented_images = []
        
        for _ in range(num_augmentations):
            aug_image = self.apply_augmentation_sequence(image.copy())
            augmented_images.append(aug_image)
        
        return augmented_images
    
    def create_mosaic(self, images, grid_size=(2, 2)):
        """Create image mosaic from multiple images"""
        if len(images) != grid_size[0] * grid_size[1]:
            raise ValueError(f"Expected {grid_size[0] * grid_size[1]} images, got {len(images)}")
        
        # Resize all images to same size
        target_size = (min(img.width for img in images), min(img.height for img in images))
        resized = [img.resize(target_size, Image.Resampling.LANCZOS) for img in images]
        
        # Create mosaic
        mosaic = Image.new('RGB', (target_size[0] * grid_size[1], target_size[1] * grid_size[0]))
        
        for i, img in enumerate(resized):
            row = i // grid_size[1]
            col = i % grid_size[1]
            mosaic.paste(img, (col * target_size[0], row * target_size[1]))
        
        return mosaic
    
    def cutmix(self, image1, image2, alpha=0.5):
        """CutMix augmentation"""
        # Ensure same size
        if image1.size != image2.size:
            image2 = image2.resize(image1.size, Image.Resampling.LANCZOS)
        
        # Random box
        width, height = image1.size
        box_width = int(width * alpha)
        box_height = int(height * alpha)
        
        x = random.randint(0, width - box_width)
        y = random.randint(0, height - box_height)
        
        # Create mixed image
        mixed = image1.copy()
        mixed.paste(image2.crop((x, y, x + box_width, y + box_height)), (x, y))
        
        return mixed
    
    def mixup(self, image1, image2, alpha=0.5):
        """MixUp augmentation"""
        # Convert to arrays
        arr1 = np.array(image1) / 255.0
        arr2 = np.array(image2.resize(image1.size)) / 255.0
        
        # Linear interpolation
        lam = random.uniform(0, 1)
        mixed = (lam * arr1 + (1 - lam) * arr2) * 255.0
        
        return Image.fromarray(mixed.astype(np.uint8))
    
   