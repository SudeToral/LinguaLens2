import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedSnackbar from "./Components/AnimatedSnackbar";
import { ArrowLeft } from "lucide-react-native";

const LANGUAGES = ["English", "Turkish", "Spanish", "German", "French"];

const Settings = () => {
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("English");

  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const showSnackbar = (message: string) => {
    setSnackMsg(message);
    setSnackVisible(true);
  };

  const handleClearCache = () => {
    Alert.alert("Confirm", "Are you sure you want to clear app cache?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => showSnackbar("Cache cleared successfully"),
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      {/* 🔙 Geri Dönme Butonu ve Başlık */}
      <View className="flex-row items-center px-4 py-4 bg-support border-gray-300">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ArrowLeft size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-black">Settings</Text>
      </View>

      <View className="flex-1 p-5">
        {/* 🌙 Dark Mode */}
        <View className="py-4 border-b border-gray-200 flex-row justify-between items-center">
          <View>
            <Text className="text-base text-gray-600">Dark Mode</Text>
            <Text className="text-base text-black">
              {darkMode ? "Enabled" : "Disabled"}
            </Text>
          </View>
          <Switch value={darkMode} onValueChange={(v) => {
            setDarkMode(v);
            showSnackbar(`Dark mode ${v ? "enabled" : "disabled"}`);
          }} />
        </View>

        {/* 🔔 Notifications */}
        <View className="py-4 border-b border-gray-200 flex-row justify-between items-center">
          <View>
            <Text className="text-base text-gray-600">Notifications</Text>
            <Text className="text-base text-black">
              {notifications ? "On" : "Off"}
            </Text>
          </View>
          <Switch value={notifications} onValueChange={(v) => {
            setNotifications(v);
            showSnackbar(`Notifications ${v ? "enabled" : "disabled"}`);
          }} />
        </View>

        {/* 🌐 Language Selection */}
        <TouchableOpacity
          className="py-4 border-b border-gray-200"
          onPress={() => setLanguageModalVisible(true)}
        >
          <Text className="text-base text-gray-600">Base Language</Text>
          <Text className="text-base text-black">{language}</Text>
        </TouchableOpacity>

        {/* 🧹 Clear Cache */}
        <TouchableOpacity
          className="py-4 border-b border-gray-200"
          onPress={handleClearCache}
        >
          <Text className="text-base text-gray-600">Clear App Cache</Text>
          <Text className="text-base text-black">Tap to clear temporary data</Text>
        </TouchableOpacity>


      </View>

      {/* 🌍 Language Modal */}
      <Modal transparent animationType="fade" visible={languageModalVisible}>
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white w-11/12 rounded-2xl p-5">
            <Text className="text-lg font-bold mb-4 text-black">
              Choose Base Language
            </Text>
            {LANGUAGES.map((lang) => (
              <Pressable
                key={lang}
                className="py-3 border-b border-gray-200"
                onPress={() => {
                  setLanguage(lang);
                  showSnackbar(`Language set to ${lang}`);
                  setLanguageModalVisible(false);
                }}
              >
                <Text className="text-base text-black">{lang}</Text>
              </Pressable>
            ))}
            <Pressable onPress={() => setLanguageModalVisible(false)}>
              <Text className="text-gray-500 mt-4 text-center">Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <AnimatedSnackbar
        message={snackMsg}
        visible={snackVisible}
        onClose={() => setSnackVisible(false)}
      />
    </SafeAreaView>
  );
};

export default Settings;