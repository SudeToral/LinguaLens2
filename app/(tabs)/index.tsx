// app/(tabs)/index.tsx
import { Entypo } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import React, { useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  // calculate a square that's 90% of screen width
  const screenWidth = Dimensions.get("window").width;
  const squareSize = screenWidth * 0.9;

  // wait for the permission API
  if (!permission) return null;
  if (!permission.granted) {
    return (
      <View className="flex-1 bg-white justify-center items-center p-4">
        <Text className="mb-4 text-gray-700 text-center">
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          <Text className="text-white">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // flip camera front/back
  const toggleCameraFacing = () =>
    setFacing((f) => (f === "back" ? "front" : "back"));

  return (
    <View className="flex-1 bg-white items-center justify-center">
      {/* camera preview container */}
      <View
        className="rounded-lg overflow-hidden border-2 border-gray-400 border-dashed"
        style={{ width: squareSize, height: squareSize }}
      >
        <CameraView style={{ flex: 1 }} facing={facing}>
          {/* flip button in bottom corner */}
          <View className="absolute bottom-4 right-4">
            <TouchableOpacity
              onPress={toggleCameraFacing}
              className="bg-black bg-opacity-50 p-3 rounded-full"
            >
              <Entypo name="cycle" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>

      {/* instruction text */}
      <Text className="mt-4 text-gray-500">point your camera</Text>
    </View>
  );
}
