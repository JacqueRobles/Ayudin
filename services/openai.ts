import axios from 'axios';
// Using legacy import to retain getInfoAsync until we migrate to new File API
import * as FileSystem from 'expo-file-system/legacy';

// Your OpenAI API key should be stored securely
// For development purposes, you can set it here, but for production,
// consider using environment variables or a secure storage solution
// TODO: Replace with your actual OpenAI API key
const OPENAI_API_KEY = 'sk-';

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
    const maxRetries = 3;
    let attempt = 0;
    let lastError: any = null;

    // Build form data once (FileSystem check still needed each attempt in case of race conditions)
    const buildFormData = async () => {
      // Note: size option may be available in some versions but not in type definitions
      const fileInfo = await FileSystem.getInfoAsync(audioUri);
      if (!fileInfo.exists) {
        throw new Error('Audio file does not exist');
      }
      const formData = new FormData();
      const file = {
        uri: audioUri,
        type: 'audio/m4a',
        name: 'audio.m4a',
      };
      formData.append('file', file as any);
      formData.append('model', 'whisper-1');
      if (language) formData.append('language', language);
      return formData;
    };

    while (attempt < maxRetries) {
      try {
        // Attempt to get file info to log size for debugging
        let fileSizeInfo = 'unknown';
        try {
          const fileInfo = await FileSystem.getInfoAsync(audioUri);
          // The 'size' property might be available in runtime but not in types
          const fileSize = fileInfo.exists && (fileInfo as any).size;
          if (fileSize) {
            fileSizeInfo = `${Math.round(fileSize / 1024)} KB`;
          }
        } catch {
          // Ignore errors with file size
        }
        
        console.log(`Whisper API attempt ${attempt + 1}/${maxRetries} - File size: ${fileSizeInfo}`);
        
        const formData = await buildFormData();
        const response = await axios.post(
          'https://api.openai.com/v1/audio/transcriptions',
          formData,
          {
            headers: {
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
              'Content-Type': 'multipart/form-data',
            },
            timeout: 60_000,
          }
        );
        console.log(`Whisper API success on attempt ${attempt + 1}`);
        return response.data.text;
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status;
        console.warn(`Whisper API error on attempt ${attempt + 1}: Status ${status || 'network error'}`);
        
        // Log detailed error info
        if (error.response?.data) {
          console.warn('API Error details:', JSON.stringify(error.response.data));
        }

        // Rate limit or server overload -> retry with exponential backoff
        if (status === 429 || status === 503) {
          attempt += 1;
          if (attempt >= maxRetries) break;
          const retryAfterHeader = error?.response?.headers?.['retry-after'];
          const baseDelay = retryAfterHeader ? parseInt(retryAfterHeader, 10) * 1000 : 1000 * Math.pow(2, attempt); // 1s, 2s, 4s
          // add +/- up to 30% jitter
          const jitter = baseDelay * (Math.random() * 0.6 - 0.3);
          await new Promise(res => setTimeout(res, baseDelay + jitter));
          continue;
        }

        // Network errors (no response)
        if (!error.response) {
          attempt += 1;
          if (attempt >= maxRetries) break;
          await new Promise(res => setTimeout(res, 1000 * Math.pow(2, attempt)));
          continue;
        }
        // Other errors -> do not retry
        break;
      }
    }

    // Enhance errors with better diagnostics
    if (!lastError) {
      console.error('Unknown transcription error with no details');
      throw new Error('Error desconocido al transcribir audio');
    }
    
    // Special handling for common errors
    const status = lastError?.response?.status;
    
    if (status === 429) {
      console.error('Rate limit reached after all retries');
      const retryAfter = lastError?.response?.headers?.['retry-after'] || 15;
      const enhanced: any = new Error(`Rate limit alcanzado (429). Espera unos segundos y vuelve a intentar. (RetryAfter: ${retryAfter}s)`);
      enhanced.code = 'RATE_LIMIT';
      enhanced.retryAfter = retryAfter;
      enhanced.cause = lastError;
      throw enhanced;
    } 
    
    if (status === 413) {
      console.error('File too large (413)');
      const enhanced: any = new Error('El audio es demasiado grande. Intenta una grabación más corta.');
      enhanced.code = 'FILE_TOO_LARGE';
      enhanced.cause = lastError;
      throw enhanced;
    }
    
    // Other API errors
    if (lastError.response) {
      console.error(`API Error ${status}:`, lastError.response.data || 'No error details');
      const errorMessage = lastError.response.data?.error?.message || `Error ${status} al transcribir audio`;
      throw new Error(errorMessage);
    }
    
    // Network/other errors
    console.error('Error transcribing audio:', lastError);
    throw lastError;
  },
};