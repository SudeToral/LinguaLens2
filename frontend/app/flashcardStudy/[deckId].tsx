import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View, Pressable, SafeAreaView } from "react-native";
import FlashCard from "./Flashcard";
import { ArrowLeft } from "lucide-react-native"; // Optional: Replace with your icon lib

const FlashcardStudy = () => {
  const { deckId } = useLocalSearchParams();
  const router = useRouter();

  const cardSets: Record<string, string[]> = {
    math: ["1 + 1", "2 + 2", "3 + 3"],
    history: ["WWII", "French Revolution"],
    animals: ["Cat", "Dog", "Elephant"],
  };

  const cards = cardSets[deckId as string] || ["No cards found."];

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
          frontText="Front Text"
          frontImageUri="https://example.com/front.jpg"
          backText="Back Text"
          backImageUri="https://example.com/back.jpg"
        />
      </View>
    </SafeAreaView>
  );
};

export default FlashcardStudy;
