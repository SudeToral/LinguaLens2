import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { account, databases } from "../lib/appwriteConfig";
import { fetchDecks } from "../services/flashcardService";

const DATABASE_ID = "682b8dc8002b735ece29";
const COLLECTION_ID = "684c70e40038eb434002";

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
  const [newDeckName, setNewDeckName] = useState("");
  const [showInput, setShowInput] = useState(false);

  // Kullanıcının decklerini getir
  const loadDecks = async (uid: string) => {
    try {
      const fetchedDecks = await fetchDecks(uid);
      setDecks(fetchedDecks.map((deckName) => ({ name: deckName })));
    } catch (error) {
      console.error("Error fetching decks:", error);
    }
  };

  useEffect(() => {
    account
      .get()
      .then((user) => {
        setUserId(user.$id);
        loadDecks(user.$id);
      })
      .catch((err) => console.error("Cannot fetch user:", err));
  }, []);

  const addDeck = async () => {
    if (!newDeckName.trim()) return;

    try {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        "unique()",
        {
          deckName: newDeckName.trim(),
          userId: userId,
        }
      );
      setNewDeckName("");
      setShowInput(false);
      loadDecks(userId); // yeniden listele
    } catch (error) {
      console.error("Error creating deck:", error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-center p-4">
        <View className="bg-primary rounded-3xl p-6 border-4 border-support">
          <Text className="text-xl font-bold mb-4 text-center">
            Available Decks
          </Text>

          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View className="flex-row flex-wrap justify-between">
              {decks.map((deck) => (
                <Pressable
                  key={deck.name}
                  className="w-[45%] m-1 items-center"
                  onPress={() => {
                    onSelectDeck(deck.name);
                    console.log(`Selected deck: ${deck.name}`);
                  }}
                >
                  <MaterialCommunityIcons
                    name="card-multiple"
                    size={120}
                    color="#FFB823"
                  />
                  <Text className="text-black mt-2 text-center font-bold">
                    {deck.name}
                  </Text>
                </Pressable>
              ))}

              {/* Add Deck */}
              <Pressable
                className="w-[45%] m-1 items-center"
                onPress={() => setShowInput(!showInput)}
              >
                <MaterialCommunityIcons
                  name="card-plus"
                  size={120}
                  color="#FFB823"
                
                />
                <Text className="text-black mt-2 text-center font-bold">
                  Add Deck
                </Text>
              </Pressable>
            </View>

            {showInput && (
              <View className="w-full mt-4">
                <TextInput
                  className="border border-gray-300 rounded-xl p-3 text-black"
                  placeholder="New Deck Name"
                  value={newDeckName}
                  onChangeText={setNewDeckName}
                />
                <TouchableOpacity
                  className="bg-tertiary py-3 mt-2 rounded-xl items-center"
                  onPress={addDeck}
                >
                  <Text className="text-black font-bold">Create Deck</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          <View className="items-center mt-6">
            <TouchableOpacity
              onPress={onClose}
              className="bg-secondary px-6 py-3 rounded-lg"
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
