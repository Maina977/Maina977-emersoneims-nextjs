import { useState, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import { launchCamera, launchImageLibrary, CameraOptions } from 'react-native-image-picker';

interface Photo {
  id: string;
  uri: string;
  fileName: string;
  type: string;
  timestamp: Date;
}

export const useCamera = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const takePhoto = useCallback(async () => {
    const options: CameraOptions = {
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: false,
      includeBase64: false
    };

    setIsLoading(true);
    
    try {
      const result = await launchCamera(options);
      
      if (result.didCancel) {
        console.log('User cancelled camera');
      } else if (result.errorCode) {
        Alert.alert('Error', result.errorMessage || 'Failed to take photo');
      } else if (result.assets && result.assets[0]) {
        const asset = result.assets[0];
        const newPhoto: Photo = {
          id: Date.now().toString(),
          uri: asset.uri!,
          fileName: asset.fileName || `photo_${Date.now()}.jpg`,
          type: asset.type || 'image/jpeg',
          timestamp: new Date()
        };
        setPhotos(prev => [...prev, newPhoto]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open camera');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const pickFromGallery = useCallback(async () => {
    const options: CameraOptions = {
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 5
    };

    setIsLoading(true);
    
    try {
      const result = await launchImageLibrary(options);
      
      if (result.didCancel) {
        console.log('User cancelled gallery');
      } else if (result.errorCode) {
        Alert.alert('Error', result.errorMessage || 'Failed to pick image');
      } else if (result.assets) {
        const newPhotos: Photo[] = result.assets.map(asset => ({
          id: Date.now().toString() + Math.random(),
          uri: asset.uri!,
          fileName: asset.fileName || `photo_${Date.now()}.jpg`,
          type: asset.type || 'image/jpeg',
          timestamp: new Date()
        }));
        setPhotos(prev => [...prev, ...newPhotos]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open gallery');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removePhoto = useCallback((photoId: string) => {
    setPhotos(prev => prev.filter(p => p.id !== photoId));
  }, []);

  const clearPhotos = useCallback(() => {
    setPhotos([]);
  }, []);

  return {
    photos,
    isLoading,
    takePhoto,
    pickFromGallery,
    removePhoto,
    clearPhotos,
    photoCount: photos.length
  };
};