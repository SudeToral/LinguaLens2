import apiClient from './apiClient';
import * as ImageManipulator from 'expo-image-manipulator';

interface BaseWordReturn {
  baseWord: string;
  image: string;
}

export const uploadFlashcard = async (
  userId: string,
  baseWord: string,
  translatedWord: string,
  sentences: string,
  imageUri: string,
  deckName: string
): Promise<any> => {
  try {
    // Step 1: Compress image before uploading
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 800 } }], // Resize to 800px width, maintain aspect ratio
      {
        compress: 0.7, // 70% quality
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('baseWord', baseWord);
    formData.append('translatedWord', translatedWord);
    formData.append('sentences', sentences);
    formData.append('deckName', deckName);

    formData.append('file', {
      uri: manipulatedImage.uri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    } as any);

    const response = await apiClient.post('/upload-flashcard', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Flashcard upload failed:', error.response?.data || error.message);
    throw error;
  }
};

export const getBaseWord = async (imageUri: string): Promise<BaseWordReturn> => {
    const formData = new FormData();
  
    formData.append('file', {
      uri: imageUri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    } as any);
  
    try {
      const response = await apiClient.post('/detect/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      return {
        baseWord: response.data.label,
        image: response.data.image,
      };
    } catch (error: any) {
      console.error('Detection failed:', error.response?.data || error.message);
      throw error;
    }
  };
