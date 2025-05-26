import { Entypo } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import React, { useRef, useState } from "react";

import { detectObjects } from "@/utils/vision";


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

export default function Index() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [isModalVisible, setModalVisible] = useState(false);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");

  const screenWidth = Dimensions.get("window").width;
  const squareSize = screenWidth * 0.9;

  const toggleCameraFacing = () =>
    setFacing((f) => (f === "back" ? "front" : "back"));

  const [labels, setLabels] = useState<string[] | null>(null);

  const grabPicture = async () => {
    if (!cameraRef.current) return;
  
    const photo = await cameraRef.current.takePictureAsync({ skipProcessing: true });
    console.log("📸 Photo URI:", photo.uri);                 // ①
  
    try {
      const detected = await detectObjects(photo.uri);
      console.log("🔍 Detected labels:", detected);          // ②
      setLabels(detected);
    } catch (err) {
      console.log("❌ Vision error:", err);                  // ③
      setLabels(["Detection failed"]);
    }
  
    setCapturedUri(photo.uri);
    setModalVisible(true);
    console.log("👁️ Modal should be visible now");          // ④
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
        onShow={() => console.log("✅ Modal opened")}
      >  

        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {capturedUri && (
              <Image source={{ uri: capturedUri }} style={styles.imagePreview} />
            )}
            <Text style={styles.modalTitle}>Translated word</Text>
            <Text style={styles.modalSubtitle}>Base Language word</Text>
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                color="#DC2626"
                onPress={() => setModalVisible(false)}
              />
              <Button
                title="Save"
                onPress={() => {
                  // TODO: Save flashcard
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