// services/sentenceService.ts

import apiClient from "./apiClient";

export interface GenerateRequest {
  word: string;
  interest?: string;
  count?: number;
  language?: string;
  level?: string;
}

export interface GenerateResponse {
  sentences: string[];
}

/**
 * Call the backend to generate example sentences for a given word.
 *
 * @param params GenerateRequest payload
 * @returns Promise resolving to an array of generated sentences
 */
export async function generateSentences(
  params: GenerateRequest
): Promise<string[]> {
  try {
    // set defaults if not provided
    const payload: GenerateRequest = {
      interest: "",
      count: 3,
      language: "English",
      level: "A2-B1",
      ...params,
    };
    const response = await apiClient.post<GenerateResponse>(
      "/generate-sentences",
      payload
    );
    return response.data.sentences;
  } catch (err) {
    console.error("Error generating sentences:", err);
    throw err;
  }
}
