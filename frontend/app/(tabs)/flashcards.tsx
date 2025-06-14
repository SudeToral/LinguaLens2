import { useRouter } from "expo-router";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  TouchableWithoutFeedback,
  UIManager,
  findNodeHandle,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { fetchDecks } from "../services/flashcardService";
import { account, databases } from "../lib/appwriteConfig";
import { Query } from "react-native-appwrite";
import { RefreshControl } from "react-native";


const databaseId = "682b8dc8002b735ece29";
const deckCollectionId = "684c70e40038eb434002";
const COLLECTION_ID = '6834cde500256bd6b773'; // flashcards

const DeckButton = ({
  name,
  onLongPress,
  onRefReady,
}: {
  name: string;
  onLongPress: () => void;
  onRefReady: (ref: any) => void;
}) => {
  const router = useRouter();
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      onRefReady(ref);
    }
  }, [ref.current]);

  return (
    <Pressable
      ref={ref}
      onPress={() => router.push(`/flashcardStudy/${name}`)}
      onLongPress={onLongPress}
      className="w-[45%] m-1 items-center"
    >
      <MaterialCommunityIcons name="card-multiple" size={120} color="#FFB823" />
      <Text className="text-black mt-2 text-center font-bold">{name}</Text>
    </Pressable>
  );
};

export const FlashCards = () => {
  const [decks, setDecks] = useState<{ name: string }[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedFlashcards, setSelectedFlashcards] = useState<{ id: string; front: string; back: string }[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDecksFromServer = async () => {
    try {
      const user = await account.get();
      if (!user) {
        console.error("User not found. Please log in.");
        return;
      }
      const fetchedDecks = await fetchDecks(user.$id);
      setDecks(fetchedDecks.map((deckName) => ({ name: deckName })));
    } catch (error) {
      console.error("Error fetching decks:", error);
    }
  };
  

  const handleEditDeck = async () => {
    if (!selectedDeck) return;
  
    try {
      // Placeholder: Replace with your actual API call
      const user = await account.get();
      const result = await databases.listDocuments(
        databaseId,
        COLLECTION_ID,
        [
          Query.and([
            Query.equal("userId", user.$id),
            Query.equal("deckName", selectedDeck),
          ]),
        ]
      );
  
      setSelectedFlashcards(result.documents.map(doc => ({
        id: doc.$id,
        front: doc.translatedWord,
        back: doc.baseWord,
      })));
  
      setIsEditModalVisible(true);
      setSelectedDeck(null);
    } catch (err) {
      console.error("Failed to fetch flashcards for editing:", err);
    }
  };

  const handleDeleteFlashcard = async (flashcardId: string) => {
    try {
      await databases.deleteDocument(databaseId, COLLECTION_ID, flashcardId);
  
      // Remove from local state to update UI
      setSelectedFlashcards((prev) =>
        prev.filter((card) => card.id !== flashcardId)
      );
  
      console.log("Flashcard deleted successfully.");
    } catch (err) {
      console.error("Failed to delete flashcard:", err);
    }
  };
  
  

  const handleDeleteDeck = async (deckName: string) => {
    try {
      // Step 1: Get user
      const user = await account.get();
  
      // Step 2: Query the database for the deck document by name and user
      const result = await databases.listDocuments(databaseId, deckCollectionId, [
        Query.and([
          Query.equal("userId", user.$id),
          Query.equal("deckName", deckName),
        ])
      ]);
  
      if (result.documents.length === 0) {
        console.error("Deck not found.");
        return;
      }
  
      // Step 3: Delete the deck document
      const deckId = result.documents[0].$id;
      await databases.deleteDocument(databaseId, deckCollectionId, deckId);
  
      console.log("Deck deleted successfully.");
  
      // Step 4: Refresh local deck list
      setDecks((prev) => prev.filter((deck) => deck.name !== deckName));
      setSelectedDeck(null);
    } catch (err) {
      console.error("Failed to delete deck:", err);
    }
  };

  const deckRefs = useRef<{ [key: string]: any }>({});

  useEffect(() => {
    fetchDecksFromServer();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDecksFromServer();
    setRefreshing(false);
  };
  

  const handleLongPress = (deckName: string) => {
    const ref = deckRefs.current[deckName];
    if (ref?.current) {
      const handle = findNodeHandle(ref.current);
      if (handle) {
        UIManager.measure(handle, (_x, _y, _width, _height, pageX, pageY) => {
          setMenuPosition({ x: pageX, y: pageY });
          setSelectedDeck(deckName);
        });
      }
    }
  };

  const handleEdit = () => {
    console.log("Edit", selectedDeck);
    handleEditDeck();
    setSelectedDeck(null);
  };

  const handleDelete = () => {
    if (!selectedDeck) return;
  
    Alert.alert(
      "Delete Deck",
      `Are you sure you want to delete the deck "${selectedDeck}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            handleDeleteDeck(selectedDeck);
            setSelectedDeck(null);
          },
        },
      ]
    );
  };
  

  return (
    <SafeAreaView className="bg-primary flex-1 px-4 pt-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        <View className="flex-row flex-wrap justify-between">
          {decks.map((deck) => (
            <DeckButton
              key={deck.name}
              name={deck.name}
              onLongPress={() => handleLongPress(deck.name)}
              onRefReady={(ref) => {
                deckRefs.current[deck.name] = ref;
              }}
            />
          ))}
        </View>
      </ScrollView>

      {/* Dropdown near the pressed item */}
      <Modal transparent visible={!!selectedDeck} animationType="none">
        <TouchableWithoutFeedback onPress={() => setSelectedDeck(null)}>
          <View className="absolute top-0 left-0 right-0 bottom-0">
            {selectedDeck && (
              <View
                style={{
                  position: "absolute",
                  top: menuPosition.y + 10,
                  left: menuPosition.x,
                  backgroundColor: "#fff",
                  padding: 12,
                  borderRadius: 8,
                  elevation: 5,
                  shadowColor: "#000",
                  shadowOpacity: 0.2,
                  shadowOffset: { width: 0, height: 2 },
                }}
              >
                <Pressable onPress={handleEdit}>
                  <Text className="text-blue-600 py-1">Edit Deck</Text>
                </Pressable>
                <Pressable onPress={handleDelete}>
                  <Text className="text-red-600 py-1">Delete Deck</Text>
                </Pressable>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Edit Deck Modal */}
      <Modal visible={isEditModalVisible} animationType="slide">
        <SafeAreaView className="flex-1 bg-primary px-4 pt-4">
          <Text className="text-xl font-bold text-center mb-4">{selectedDeck}</Text>

          <ScrollView>
            {selectedFlashcards.map((card) => (
              <View
                key={card.id}
                className="flex-row items-center justify-between bg-white p-4 mb-2 rounded-lg shadow"
              >
                <View>
                  <Text className="text-base font-semibold">Target Word: {card.front}</Text>
                  <Text className="text-sm text-gray-600">Base Word: {card.back}</Text>
                </View>
                <Pressable onPress={() => { 
                  Alert.alert(
                    "Delete Flashcard",
                    "Are you sure you want to delete this flashcard?",
                    [
                      { text: "Cancel", style: "cancel" },
                      { text: "Delete", style: "destructive", onPress: () => handleDeleteFlashcard(card.id) },
                    ]
                  );
                  
                 }}>
                  <MaterialCommunityIcons name="trash-can-outline" size={24} color="#2D4F2B" />
                </Pressable>
              </View>
            ))}
          </ScrollView>

          <Pressable
            className="mt-4 bg-secondary p-4 rounded-lg items-center"
            onPress={() => setIsEditModalVisible(false)}
          >
            <Text className="text-white font-bold">Done</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
};

export default FlashCards;
