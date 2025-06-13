import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View, Pressable, SafeAreaView } from "react-native";
import FlashCard from "./Flashcard";
import { ArrowLeft } from "lucide-react-native"; // Optional: Replace with your icon lib
import { use, useEffect, useState } from "react";
import { fetchFlashcards } from "../services/flashcardService";
import { account } from "../lib/appwriteConfig";
import { storage } from "../lib/appwriteConfig";


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

  const [flashCards, setFlashCards] = useState<Flashcard[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [loadingFlashcards, setLoadingFlashcards] = useState(true);

  useEffect(() => {
    account
      .get()
      .then((user) => setUserId(user.$id))
      .catch((err) => console.error("Cannot fetch user:", err));
  }, []);

  useEffect(() => {
    if (!userId) return;

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
      setLoadingFlashcards(false);
    };

    fetchData();
  }, [userId]);

  // Early return if loading
  if (!userId || loadingFlashcards) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>Loading flashcards...</Text>
      </SafeAreaView>
    );
  }
  if (flashCards.length === 0) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-primary">
        <Text className="text-black text-2xl font-bold">You finished the deck!</Text>
        <Pressable onPress={() => router.back()} className="mt-4 p-2 bg-black rounded-lg">
          <Text className="text-white">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const currentCard = flashCards[0];
  const imageUrl = storage.getFileView("6834cf58002581c4badd", currentCard.photoId).href;

  // 🔻 Remove current card permanently
  const removeCard = () => {
    setFlashCards((prev) => prev.slice(1));
  };

  // 🔁 Move current card to end of the list
  const retryCard = () => {
    setFlashCards((prev) => [...prev.slice(1), prev[0]]);
  };




  return (
    <SafeAreaView className="flex-1 bg-primary p-4 justify-center">
      <View className="flex-row mb-10">
        <Pressable onPress={() => router.back()} className="mt-4 ml-4">
          <ArrowLeft color="black" size={24} />
        </Pressable>
        <View className="flex-1 items-center mt-4">
          <Text className="text-black text-2xl font-bold mr-12">Deck: {deckId}</Text>
        </View>
      </View>

      <View className="flex-1 items-center">
        <FlashCard
          frontText={currentCard.translatedWord}
          frontImageUri={imageUrl}
          backText={currentCard.baseWord}
          backSentences={currentCard.sentences}
          goodFunction={removeCard}
          retryFunction={retryCard}
        />
      </View>
    </SafeAreaView>
  );
};

export default FlashcardStudy;
