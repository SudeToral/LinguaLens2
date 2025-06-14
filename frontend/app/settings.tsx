import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { useAuth } from "../context/AuthContext";
import { account } from "./lib/appwriteConfig";

const LANGUAGES = ["English", "Turkish", "Spanish", "German", "French"];

const Settings = () => {
  const router = useRouter();
  const { signout } = useAuth();

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("English");

  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  // 📩 Delete account handler
  const handleDeleteAccount = async () => {
    try {
      // Şifreyi sabit bir değerle değiştir
      await account.updatePassword("xxxxxxxx", deletePassword);

      // Oturumu kapat
      await signout();
      router.replace("/signin");

      console.log("Şifre değiştirildi ve çıkış yapıldı.");
    } catch (error) {
      console.error("Hesap silme işlemi başarısız:", error);
      Alert.alert("Hata", "Şifre yanlış veya işlem başarısız.");
    } finally {
      setDeleteModalVisible(false);
      setDeletePassword("");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-tertiary border-gray-300">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ArrowLeft size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-black">Settings</Text>
      </View>

      <View className="flex-1 p-5">
        {/* Notifications */}
        <View className="py-4 border-b border-gray-200 flex-row justify-between items-center">
          <View>
            <Text className="text-base text-gray-600">Notifications</Text>
            <Text className="text-base text-black">{notifications ? "On" : "Off"}</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={(v) => setNotifications(v)}
          />
        </View>

        {/* Language Selection */}
        <TouchableOpacity
          className="py-4 border-b border-gray-200"
          onPress={() => setLanguageModalVisible(true)}
        >
          <Text className="text-base text-gray-600">Base Language</Text>
          <Text className="text-base text-black">{language}</Text>
        </TouchableOpacity>

        {/* Delete Account */}
        <TouchableOpacity
          className="py-4 border-b border-gray-200"
          onPress={() => setDeleteModalVisible(true)}
        >
          <Text className="text-base text-gray-600">Delete Account</Text>
          <Text className="text-base text-black">Remove account and sign out</Text>
        </TouchableOpacity>
      </View>

      {/* Language Modal */}
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

      {/* Delete Confirmation Modal */}
      <Modal transparent animationType="fade" visible={deleteModalVisible}>
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-primary w-11/12 p-5 rounded-2xl">
            <Text className="text-lg font-bold mb-4 text-black">Confirm Deletion</Text>
            <Text className="text-sm mb-3 text-gray-600">
              Please enter your current password to continue.
            </Text>
            <TextInput
              className="border border-gray-300 p-3 rounded-lg text-black mb-4"
              placeholder="Password"
              secureTextEntry
              value={deletePassword}
              onChangeText={setDeletePassword}
            />
            <View className="flex-row justify-between mt-2">
            <Pressable onPress={() => setDeleteModalVisible(false)}>
                <Text className="text-gray-500 font-semibold">Cancel</Text>
              </Pressable>
              <Pressable onPress={handleDeleteAccount}>
                <Text className="text-support font-semibold">Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Settings;
