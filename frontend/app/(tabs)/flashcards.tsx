import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";

const DeckButton = ({ deckId, name }: { deckId: string; name: string }) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/flashcardStudy/${deckId}`)}
      className="w-[45%] m-1 items-center"
    >
      <MaterialCommunityIcons name="card-multiple" size={120} color="#81C784" />
      <Text className="text-black mt-2 text-center font-bold">{name}</Text>
    </Pressable>
  );
};


const FlashCards = () => {
  const decks = [
    { id: "math", name: "Math Deck" },
    { id: "history", name: "History Deck" },
    { id: "animals", name: "Animal Deck" },
  ];

  return (
    <SafeAreaView className="bg-primary flex-1 px-4 pt-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-row flex-wrap justify-between">
          {decks.map((deck) => (
            <DeckButton key={deck.id} deckId={deck.id} name={deck.name} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FlashCards;