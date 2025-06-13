import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View, Pressable, SafeAreaView } from "react-native";
import FlashCard from "./Flashcard";
import { ArrowLeft } from "lucide-react-native"; // Optional: Replace with your icon lib
import { use, useEffect, useState } from "react";
import { fetchFlashcards } from "../services/flashcardService";
import { account } from "../lib/appwriteConfig";


type Flashcard = {
  $collectionId: string;
  $createdAt: string;
  $databaseId: string;
  $id: string;
  $permissions: string[];
  $updatedAt: string;
  baseWord: string;
  deckName: string;
  photoId: string;
  sentences: string;
  translatedWord: string;
  userId: string;
};

const FlashcardStudy = () => {
  const { deckId } = useLocalSearchParams();
  const router = useRouter();

  const [flashCards, setFlashCards] = useState<string[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [userId, setUserId] = useState<string>("");
  const [loadingFlashcards, setLoadingFlashcards] = useState(true);

  useEffect(() => {
    account
      .get()
      .then((user) => setUserId(user.$id))
      .catch((err) => console.error("Cannot fetch user:", err));
  }, []); // Run once on mount

  useEffect(() => {
    if (!userId) {
      return;  // Don't fetch if no userId yet
    }
    const fetchData = async () => {
      setLoadingFlashcards(true);
      const fetchedCards = await fetchFlashcards(userId, deckId as string);
      if (!fetchedCards || fetchedCards.length === 0) {
        console.error("No flashcards found for this deck.");
        setFlashCards([]);
        setLoadingFlashcards(false);
        return;
      }
      setFlashCards(fetchedCards);
      setCurrentCardIndex(0);
      setLoadingFlashcards(false);
    }
    
    fetchData();
  }, [userId]);
  

    // Render loading indicator while fetching
  if (!userId || loadingFlashcards) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>Loading flashcards...</Text>
      </SafeAreaView>
    );
  }

  const currentCard = flashCards[currentCardIndex];
;
  console.log("Current card:", currentCard);
  console.log("Current card type:", typeof currentCard);
  const baseWord = (currentCard as any).baseWord;
  console.log("Base word:", baseWord);

  return (
    <SafeAreaView className="flex-1 bg-primary p-4 justify-center">
      <View className="flex-row mb-10">
        <Pressable onPress={() => router.back()} className="mt-4 ml-4">
          {/* Optional icon - replace with Image or Text if needed */}
          <ArrowLeft color="black" size={24} />
        </Pressable>
        <View className="flex-1 items-center mt-4">
          <Text className="text-black text-2xl font-bold mr-12">Deck: {deckId}</Text>
        </View>
        
        
      </View>
      <View className="flex-1 items-center">
        
        <FlashCard
          frontText={(currentCard as any).translatedWord}
          frontImageUri="https://example.com/front.jpg"
          backText={(currentCard as any).baseWord}
          backSentences= {(currentCard as any).sentences}
        />
      </View>
    </SafeAreaView>
  );
};

export default FlashcardStudy;
