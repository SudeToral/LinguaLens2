import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import FlashCard from "./Flashcard";

const FlashcardStudy = () => {
  const { deckId } = useLocalSearchParams();

  // Example logic: Load content based on deckId
  // You might fetch data here instead
  const cardSets: Record<string, string[]> = {
    math: ["1 + 1", "2 + 2", "3 + 3"],
    history: ["WWII", "French Revolution"],
    animals: ["Cat", "Dog", "Elephant"],
  };

  const cards = cardSets[deckId as string] || ["No cards found."];

  return (
    <View className="flex-1 items-center bg-primary p-4">
      <Text className="text-white text-2xl font-bold mb-4">Deck: {deckId}</Text>
      {/*cards.map((card, idx) => (
        <Text key={idx} className="text-white text-lg mb-2">
          {card}
        </Text>
      ))*/}
      <FlashCard
        frontText="Front Text"
        frontImageUri="https://example.com/front.jpg"
        backText="Back Text"
        backImageUri="https://example.com/back.jpg" />
    </View>
  );
};

export default FlashcardStudy;
