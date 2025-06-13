import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { fetchDecks, fetchFlashcards } from "../services/flashcardService";
import { account } from "../lib/appwriteConfig";

const DeckButton = ({ name }: { name: string }) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/flashcardStudy/${name}`)}
      className="w-[45%] m-1 items-center"
    >
      <MaterialCommunityIcons name="card-multiple" size={120} color="#81C784" />
      <Text className="text-black mt-2 text-center font-bold">{name}</Text>
    </Pressable>
  );
};

export const FlashCards = () => {
  const [decks, setDecks] = useState<{ name: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = await account.get();
      if (!user) {
        console.error("User not found. Please log in.");
        return;
      }
      try {
        const fetchedDecks = await fetchDecks(user.$id);
        setDecks(fetchedDecks.map((deckName) => ({ name: deckName })));
        } catch (error) {
        console.error("Error fetching decks:", error);
        }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView className="bg-primary flex-1 px-4 pt-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-row flex-wrap justify-between">
          {decks.map((deck) => (
            <DeckButton key={deck.name} name={deck.name} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FlashCards;