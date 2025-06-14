
import { Entypo } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import React, { useRef, useState, useEffect } from "react";
import {
  Button,
  Dimensions,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { account } from "../lib/appwriteConfig";
import { getBaseWord, uploadFlashcard } from "../services/photoService";
import { translateWord } from "../services/translationService";
import { generateSentences } from "../services/sentenceService";
import DeckModal from "../Components/DeckModal";

export default function Index() {
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    account
      .get()
      .then((user) => setUserId(user.$id))
      .catch((err) => console.error("Cannot fetch user:", err));
  }, []);

  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [isModalVisible, setModalVisible] = useState(false);
  const [areDecksVisibe, setAreDecksVisibe] = useState(false);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [baseWord, setBaseWord] = useState("");
  const [translatedWord, setTranslatedWord] = useState("");
  const [sentences, setSentences] = useState(Array<string>);

  const screenWidth = Dimensions.get("window").width;
  const squareSize = screenWidth * 0.9;

  const toggleCameraFacing = () =>
    setFacing((f) => (f === "back" ? "front" : "back"));

  const handleSentences = async (): Promise<string[]> => {
    if (!translatedWord) {
      console.log("No translated word!");
      return [];
    }
    try {
      const result = await generateSentences({
        word: translatedWord,
        interest: "",
        count: 3,
        language: "English",
        level: "A2-B1",
      });
      setSentences(result);    // still update state for display
      return result;           // <-- return the fresh array
    } catch (err) {
      console.error("Error generating sentences:", err);
      return [];
    }
  };
  const [selectedDeck, setSelectedDeck] = useState("");
  const selectDeck = async (deckName: string) => {

    const fresh = await handleSentences();
    const combined = fresh.join(" ");
    console.log("Combined: ", combined);
    deckName = deckName.trim()
    if (capturedUri) {
      await handleSaveFlashcard(
        baseWord,
        translatedWord,
        combined,
        capturedUri,
        deckName,
      );
    } else {
      console.warn("Captured URI is null—cannot save flashcard");
    }
  }

  

  const grabPicture = async () => {
    if (!cameraRef.current) return;
  
    const photo = await cameraRef.current.takePictureAsync({
      skipProcessing: true,
    });
  
    setCapturedUri(photo.uri);
    setBaseWord("");          // Clear previous state
    setTranslatedWord("");    // Clear previous state
    setSentences([]);         // Clear previous state
    setModalVisible(true);    // <-- Show modal immediately
  
    try {
      const { baseWord: freshBase } = await getBaseWord(photo.uri);
      setBaseWord(freshBase);
  
      const t = await translateWord(freshBase);
      setTranslatedWord(t);
    } catch (err) {
      console.error("Error processing image:", err);
    }
  };  

  const handleSaveFlashcard = async (
    baseWord: string,
    translatedWord: string,
    exampleSentence: string,
    imageUri: string,
    deckName: string
  ) => {
    if (!userId) {
      console.warn("No user ID yet—cannot upload flashcard");
      return;
    }
    try {
      const resp = await uploadFlashcard(
        userId,
        baseWord,
        translatedWord,
        exampleSentence,
        imageUri,
        deckName
      );
      console.log("Flashcard uploaded successfully:", resp);
    } catch (err) {
      console.error("Error uploading flashcard:", err);
    }
  };

  if (!permission) return null;
  if (!permission.granted) {
    return (
      <View className="flex-1 bg-primary ndary justify-center items-center p-4">
        <Text className="mb-4 text-gray-700 text-center">
          Grant camera permission to continue
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-blue-500 px-4 py-3 rounded-lg"
        >
          <Text className="text-white font-medium">Grant</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary items-center justify-center">
      {/* Camera Preview */}
      <View
        className=" border-solid border-secondary overflow-hidden"
        style={{ width: squareSize, height: squareSize, borderRadius: 48, borderWidth: 12}}
      >
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing} className="roundedn-3xl"/>
      </View>

      {/* Flip & Capture Buttons */}
      <View className="flex-row items-center justify-center mt-5 w-full relative">
        <TouchableOpacity
          onPress={grabPicture}
          className="bg-secondary p-2 rounded-full">
            <Entypo name="circle" size={60} color="#FFB823" className="border-2 rounded-full"/>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={toggleCameraFacing}
          className="absolute right-10 bg-secondary p-2 rounded-full"
        >
          <Entypo name="cycle" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        transparent
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center p-4">
          <View className="bg-primary rounded-3xl p-6 border-4 border-support">
            {capturedUri && (
              <Image
                source={{ uri: capturedUri }}
                className="w-full h-80 rounded-3xl mb-4 border-8 border-support"
              />
            )}
            <Text className="text-2xl text-center mb-1">
              {translatedWord || "Loading..."}
            </Text>
            <Text className="text-lg text-center mb-4">
              {baseWord || "Loading..."}
            </Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="bg-secondary px-6 py-3 rounded-3xl justify-center">
                  <Text className="text-xl font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  setModalVisible(false);
                  setAreDecksVisibe(true);
                }}
                className="bg-tertiary px-8 py-3 rounded-3xl justify-center">
                  <Text className="text-xl font-semibold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Flashcard Modal */}
      <DeckModal visible={areDecksVisibe}
        onClose={() => setAreDecksVisibe(false)}
        onSelectDeck={(deckName) => { setAreDecksVisibe(false); 
        selectDeck(deckName);
        console.log(`Selected deck: ${deckName}`);
  }} />
    </View>
  );
}