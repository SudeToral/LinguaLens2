import apiClient from './apiClient';

export interface TranslateRequest {
  word: string;
}

export interface TranslateResponse {
  translated_word: string;
}

/**
 * Send a word to the backend translate endpoint and return the translated word.
 * @param word The string you want translated
 * @returns Promise that resolves to the translated string
 */
export async function translateWord(word: string): Promise<string> {
  try {
    const payload: TranslateRequest = { word };
    const response = await apiClient.post<TranslateResponse>("/translate", payload);
    return response.data.translated_word;
  } catch (err) {
    console.error("Translation failed:", err);
    throw err;
  }
}
