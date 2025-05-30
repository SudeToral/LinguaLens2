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
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [baseWord, setBaseWord] = useState("");
  const [translatedWord, setTranslatedWord] = useState("");

  const screenWidth = Dimensions.get("window").width;
  const squareSize = screenWidth * 0.9;

  const toggleCameraFacing = () =>
    setFacing((f) => (f === "back" ? "front" : "back"));

  const grabPicture = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({
      skipProcessing: true,
    });
    const newBaseWordModule = await getBaseWord(photo.uri);
    setBaseWord(newBaseWordModule.baseWord);
    await handleTranslation();
    setCapturedUri(photo.uri);
    setModalVisible(true);
  };

  const handleTranslation = async () => {
    try {
      const resp = await translateWord(baseWord);
      setTranslatedWord(resp);
    }
    catch (err) {
      console.error("Error translating word:", err);
    }
  }

  const handleSaveFlashcard = async (
    baseWord: string,
    translatedWord: string,
    exampleSentence: string,
    imageUri: string
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
        imageUri
      );
      console.log("Flashcard uploaded successfully:", resp);
    } catch (err) {
      console.error("Error uploading flashcard:", err);
    }
  };

  if (!permission) return null;
  if (!permission.granted) {
    return (
      <View className="flex-1 bg-white justify-center items-center p-4">
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
    <View className="flex-1 bg-white items-center justify-center">
      {/* Camera Preview */}
      <View
        className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden"
        style={{ width: squareSize, height: squareSize }}
      >
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing} />
      </View>

      {/* Flip & Capture Buttons */}
      <View className="flex-row items-center justify-center mt-5 w-full relative">
        <TouchableOpacity
          onPress={grabPicture}
          className="bg-blue-600 p-10 rounded-full"
        />
        <TouchableOpacity
          onPress={toggleCameraFacing}
          className="absolute right-10 bg-black/50 p-2 rounded-full"
        >
          <Entypo name="cycle" size={24} color="#fff" />
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
          <View className="bg-white rounded-2xl p-6">
            {capturedUri && (
              <Image
                source={{ uri: capturedUri }}
                className="w-full h-80 rounded-xl mb-4"
              />
            )}
            <Text className="text-2xl text-center mb-1">{translatedWord}</Text>
            <Text className="text-lg text-center mb-4">{baseWord}</Text>
            <View className="flex-row justify-between">
              <Button
                title="Cancel"
                color="#DC2626"
                onPress={() => setModalVisible(false)}
              />
              <Button
                title="Save"
                onPress={async () => {
                  if (capturedUri) {
                    await handleSaveFlashcard(
                      baseWord,
                      "definition",
                      "Sample sentence",
                      capturedUri
                    );
                  }
                  setModalVisible(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
