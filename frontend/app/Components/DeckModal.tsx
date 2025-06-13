import React from "react";
import { useState, useEffect } from "react";
import { fetchDecks } from "../services/flashcardService";

import {
  Modal,
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { account } from "../lib/appwriteConfig";

const DeckModal = ({
    visible,
    onClose,
    onSelectDeck,
  }: {
    visible: boolean;
    onClose: () => void;
    onSelectDeck: (deckName: string) => void;
  }) => {
    const [decks, setDecks] = useState<{ name: string }[]>([]);
    const [userId, setUserId] = useState<string>("");

    useEffect(() => {
        account
        .get()
        .then((user) => setUserId(user.$id))
        .catch((err) => console.error("Cannot fetch user:", err));
        const fetchData = async () => {
            try {
            const fetchedDecks = await fetchDecks(userId);
            setDecks(fetchedDecks.map((deckName) => ({ name: deckName })));
            } catch (error) {
            console.error("Error fetching decks:", error);
            }
        };
        fetchData();
        }, []);
        
    return (
      <Modal visible={visible} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-center p-4">
          <View className="bg-white rounded-3xl p-6 border-4 border-support">
            <Text className="text-xl font-bold mb-4 text-center">Available Decks</Text>
  
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View className="flex-row flex-wrap justify-between">
                {decks.map((deck) => (
                  <Pressable
                    key={deck.name}
                    className="w-[45%] m-1 items-center"
                    onPress={() => { onSelectDeck(deck.name); console.log(`Selected deck: ${deck.name}`); }}
>
                    <MaterialCommunityIcons
                      name="card-multiple"
                      size={120}
                      color="#81C784"
                    />
                    <Text className="text-black mt-2 text-center font-bold">
                      {deck.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
  
            <View className="items-center mb-4">
              <TouchableOpacity
                onPress={onClose}
                className="bg-gray-300 px-6 py-3 rounded-lg mt-4"
              >
                <Text className="text-black font-bold">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

export default DeckModal;
