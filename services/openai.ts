import axios from 'axios';
import * as FileSystem from 'expo-file-system';

// Your OpenAI API key should be stored securely
// For development purposes, you can set it here, but for production,
// consider using environment variables or a secure storage solution
const OPENAI_API_KEY = 'your-openai-api-key';

/**
 * Service for interacting with OpenAI APIs
 */
export const OpenAIService = {
  /**
   * Transcribe audio using OpenAI's Whisper API
   * @param audioUri - Local URI of the audio file to transcribe
   * @param language - Optional language code (e.g., 'en', 'es')
   * @returns Promise with transcription result
   */
  async transcribeAudio(audioUri: string, language?: string): Promise<string> {
    try {
      const formData = new FormData();
      
      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(audioUri);
      if (!fileInfo.exists) {
        throw new Error('Audio file does not exist');
      }
      
      // Add the file to form data
      const file = {
        uri: audioUri,
        type: 'audio/m4a', // Adjust based on your recording format
        name: 'audio.m4a',
      };
      
      formData.append('file', file as any);
      formData.append('model', 'whisper-1');
      
      if (language) {
        formData.append('language', language);
      }
      
      // Send request to OpenAI Whisper API
      const response = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data.text;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  },
};