import { Entypo } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import React, { useRef, useState } from "react";
import {
  Button,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getBaseWord, uploadFlashcard } from "../services/photoService";
import axios from "axios"

export default function Index() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [isModalVisible, setModalVisible] = useState(false);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");
  const [baseWord, setBaseWord] = useState("");

  const screenWidth = Dimensions.get("window").width;
  const squareSize = screenWidth * 0.9;

  const toggleCameraFacing = () =>
    setFacing((f) => (f === "back" ? "front" : "back"));

  const grabPicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        skipProcessing: true,
      });
      const newBaseWordModule = await getBaseWord(photo.uri);
      setBaseWord(newBaseWordModule.baseWord);
      setCapturedUri(photo.uri);
      setModalVisible(true);
    }
  };

  if (!permission) return null;
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Grant camera permission to continue
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.grantButton}>
          <Text style={styles.grantButtonText}>Grant</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSaveFlashcard = async (
    userId: string,
    baseWord: string,
    translatedWord: string,
    exampleSentence: string,
    imageUri: string
  ) => {
    try {
      const response = await uploadFlashcard(
        userId,
        baseWord,
        translatedWord,
        exampleSentence,
        imageUri
      );
      console.log("Flashcard uploaded successfully:", response);
    } catch (error) {
      console.error("Error uploading flashcard:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Camera Preview */}
      <View style={[styles.cameraContainer, { width: squareSize, height: squareSize }]}>
        <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
      </View>

      {/* Flip & Capture Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={grabPicture} style={styles.captureButton} />
        <TouchableOpacity onPress={toggleCameraFacing} style={styles.flipButton}>
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {capturedUri && (
              <Image source={{ uri: capturedUri }} style={styles.imagePreview} />
            )}
            <Text style={styles.modalTitle}>Translated word</Text>
            <Text style={styles.modalSubtitle}>{baseWord}</Text>
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                color="#DC2626"
                onPress={() => setModalVisible(false)}
              />
              <Button
                title="Save"
                onPress={async () => {
                  if (capturedUri) {
                    handleSaveFlashcard(
                      "682b40d4000fe02b3527",        // Replace with actual Appwrite user ID
                      baseWord,                 // baseWord
                      "definition",           // translatedWord
                      "Sample sentence",    // example sentence
                      capturedUri          // image URI from camera
                    );
                    //const response = await axios.get("http://192.168.1.102:8000/ping");

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraContainer: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#ccc",
    borderRadius: 12,
    overflow: "hidden",
  },
  camera: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    position: "relative",
    width: "100%",
  },
  captureButton: {
    backgroundColor: "#2563EB",
    padding: 40,
    borderRadius: 999,
  },
  flipButton: {
    position: "absolute",
    right: 40,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 999,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
  },
  imagePreview: {
    width: "100%",
    height: 320,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  permissionText: {
    marginBottom: 16,
    color: "#374151",
    textAlign: "center",
  },
  grantButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  grantButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
});
