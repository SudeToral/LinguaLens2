import { databases } from "../lib/appwriteConfig";
import { Query } from 'appwrite';

const DB_ID = '682b8dc8002b735ece29';
const COLLECTION_ID = '6834cde500256bd6b773'; // flashcards
const DECK_COLLECTION_ID = '684c70e40038eb434002'; // decks

// Flashcard'ları userId ve deckName'e göre filtrele
export async function fetchFlashcards(userId: string, deckName: string): Promise<any[]> {
  try {
    const response = await databases.listDocuments(DB_ID, COLLECTION_ID, [
      Query.and([
        Query.equal('userId', userId),
        Query.equal('deckName', deckName),
      ]),
    ]);
    console.log('Fetched flashcards for user & deck:', response.documents);
    return response.documents;
  } catch (error) {
    console.error('Failed to fetch flashcards:', error);
    return [];
  }
}

// Sadece ilgili userId'ye ait deck'leri getir
export async function fetchDecks(userId: string): Promise<any[]> {
  try {
    const response = await databases.listDocuments(DB_ID, DECK_COLLECTION_ID, [
      Query.equal("userId", userId),
    ]);
    const decks = response.documents
      .map(doc => doc.deckName)
      .filter(name => name);
    return decks;
  } catch (error) {
    console.error('Failed to fetch decks:', error);
    return [];
  }
}
