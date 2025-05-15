import { Entypo } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import React, { useRef, useState } from "react";
import {
  Button,
  Dimensions,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View
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

  const grabPicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        skipProcessing: true,
      });
      setCapturedUri(photo.uri);
      setModalVisible(true);
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
          className="bg-blue-500 px-4 py-2 rounded"
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
        className="rounded-lg overflow-hidden border-2 border-dashed border-gray-400"
        style={{ width: squareSize, height: squareSize }}
      >
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing} />
      </View>

      {/* Flip & Create Button */}
      <View className="h-20 flex-row items-center justify-center">
        <TouchableOpacity
          onPress={toggleCameraFacing}
          className="bg-black bg-opacity-50 p-3 rounded-full mr-4"
        >
          <Entypo name="cycle" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={grabPicture}
          className="bg-blue-600 px-4 py-2 rounded-md"
        >
          <Text className="text-white font-semibold">Create Flashcard</Text>
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
          <View className="bg-white rounded-lg p-6">
            {capturedUri && (
              <Image
                source={{ uri: capturedUri }}
                className="w-full h-80 rounded-md mb-4"
              />
            )}
            <Text className="text-3xl text-center">Translated word</Text>
            <Text className="text-2xl text-center">Base Language word</Text>
            <View className="flex-row justify-between">
              <Button
                title="Cancel"
                color="#DC2626"
                onPress={() => setModalVisible(false)}
              />
              <Button
                title="Save"
                onPress={() => {
                  /* TODO: save flashcard */
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
