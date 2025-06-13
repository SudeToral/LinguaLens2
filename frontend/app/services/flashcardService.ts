import { databases } from "../lib/appwriteConfig";
import { Query } from 'appwrite';

const DB_ID = '682b8dc8002b735ece29';
const COLLECTION_ID = '6834cde500256bd6b773';

const DECK_COLLECTION_ID = '684c70e40038eb434002';


export async function fetchFlashcards(userId: string, deckName: string): Promise<any[]> {
    try {  
        const cond1 = Query.equal('userId', userId);
        const cond2 = Query.equal('deckName', deckName);
      const response = await databases.listDocuments(DB_ID, COLLECTION_ID, [
        
        Query.and(
            [cond1, cond2]
          ),
      ]);
      console.log('Fetched flashcards for user & deck:', response.documents);
      return response.documents;
    } catch (error) {
      console.error('Failed to fetch flashcards:', error);
      return [];
    }
  }


export async function fetchDecks(userId: string): Promise<any[]> {
    try { // User id kontrol etme çalışmadı sildik, onu düzelt
        const response = await databases.listDocuments(DB_ID, DECK_COLLECTION_ID); 
        //console.log('Response:', response);
        const decks = response.documents.map(doc => doc.deckName).filter(name => name);
        //console.log('Fetched decks:', decks);
        return decks;
    } catch (error) {
        console.error('Failed to fetch decks:', error);
        return [];
    }
}
