// app/profile.tsx

import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useProfile } from "../../context/ProfileContext";

const Profile = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile, setProfile } = useProfile();

  // which field is being edited?
  const [editingField, setEditingField] = useState<"Username" | "Email" | "Interests" | "Password" | null>(null);

  // generic editor
  const [inputValue, setInputValue] = useState("");

  // password-specific editors
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const openEditor = (field: keyof typeof profile | "Password") => {
    setEditingField(field);
    if (field === "Password") {
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
    } else {
      setInputValue(profile[field]);
    }
  };

  const saveGeneric = () => {
    if (!editingField || editingField === "Password") return;

    if (editingField === "Email") {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(inputValue)) {
        return Alert.alert("Error", "Please enter a valid email address.");
      }
    }

    setProfile({ ...profile, [editingField]: inputValue });
    setEditingField(null);
  };

  const savePassword = () => {
    if (oldPass !== profile.password) {
      return Alert.alert("Error", "Old password is incorrect.");
    }
    if (newPass !== confirmPass) {
      return Alert.alert("Error", "New passwords do not match.");
    }
    setProfile({ ...profile, password: newPass });
    setEditingField(null);
  };

  const fields: Array<keyof Omit<typeof profile, "password"> | "Password"> = [
    "Username",
    "Email",
    "Password",
    "Interests",
  ];

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="bg-white flex-1">
      {/* Header */}
      <View className="px-6 pt-6 pb-4 border-b border-gray-200 bg-purple-100">
        <Text className="text-gray-800 text-2xl font-bold">
          {profile.Username}
        </Text>
      </View>

      {/* Profile fields */}
      <View className="flex-1 px-6 pt-4">
        {fields.map((field) => {
          const displayValue =
            field === "Password"
              ? "••••••••"
              : (profile[field as keyof typeof profile] as string);

          return (
            <TouchableOpacity
              key={field}
              className="py-4 border-b border-gray-200 flex-row justify-between items-center"
              onPress={() => {
                if (field === "Interests") {
                  router.push("../interests");
                } else {
                  openEditor(field as any);
                }
              }}
            >
              <View>
                <Text className="text-gray-600 text-lg">{field}</Text>
                <Text className="text-gray-800 text-base mt-1">
                  {displayValue}
                </Text>
              </View>

              {field === "Interests" && (
                <Text className="text-purple-600 font-medium">Edit</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Log Out */}
      <View className="px-4" style={{ paddingBottom: insets.bottom + 20 }}>
        <TouchableOpacity
          className="bg-purple-100 py-3 rounded-xl items-center"
          onPress={() => {
            router.replace("/(tabs)");
          }}
        >
          <Text className="text-black text-base font-medium">Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Modal */}
      <Modal
        visible={!!editingField}
        animationType="slide"
        transparent
        onRequestClose={() => setEditingField(null)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-11/12 p-6 rounded-2xl">
            <Text className="text-gray-800 text-lg font-semibold mb-4">
              {editingField === "Password"
                ? "Change Password"
                : `Change ${editingField}`}
            </Text>

            {editingField === "Password" ? (
              <>
                <TextInput
                  className="border border-gray-300 p-3 rounded-lg mb-4"
                  value={oldPass}
                  onChangeText={setOldPass}
                  secureTextEntry
                  placeholder="Old Password"
                />
                <TextInput
                  className="border border-gray-300 p-3 rounded-lg mb-4"
                  value={newPass}
                  onChangeText={setNewPass}
                  secureTextEntry
                  placeholder="New Password"
                />
                <TextInput
                  className="border border-gray-300 p-3 rounded-lg mb-6"
                  value={confirmPass}
                  onChangeText={setConfirmPass}
                  secureTextEntry
                  placeholder="Confirm Password"
                />
                <View className="flex-row justify-between">
                  <Pressable onPress={() => setEditingField(null)}>
                    <Text className="text-gray-500">Cancel</Text>
                  </Pressable>
                  <Pressable onPress={savePassword}>
                    <Text className="text-blue-600 font-medium">Save</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <TextInput
                  className="border border-gray-300 p-3 rounded-lg mb-6"
                  value={inputValue}
                  onChangeText={setInputValue}
                  placeholder={editingField as string}
                />
                <View className="flex-row justify-between">
                  <Pressable onPress={() => setEditingField(null)}>
                    <Text className="text-gray-500">Cancel</Text>
                  </Pressable>
                  <Pressable onPress={saveGeneric}>
                    <Text className="text-blue-600 font-medium">Save</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Profile;
