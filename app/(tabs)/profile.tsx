import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
import { account, databases } from "../lib/appwriteConfig";

// 🔁 tam ID’lerle değiştir
const DATABASE_ID   = "682b8dc8002b735ece29";     // senin Database ID’in
const COLLECTION_ID = "682b8dfc0011b9c6a991";      // verdiğin Collection ID


const Profile = () => {
  const insets = useSafeAreaInsets();
  const router  = useRouter();
  const { profile, setProfile } = useProfile();
  const { signout } = useAuth();

  const [editingField, setEditingField] = useState<"Username" | "Email" | "Interests" | "Password" | null>(null);
  const [inputValue, setInputValue]     = useState("");
  const [oldPass, setOldPass]           = useState("");
  const [newPass, setNewPass]           = useState("");
  const [confirmPass, setConfirmPass]   = useState("");

  /* --------------------------------------------------
     1️⃣  Appwrite’tan kullanıcı + interests çek
  -------------------------------------------------- */
  useEffect(() => {
    (async () => {
      try {
        const user = await account.get();
        try {
          const doc = await databases.getDocument(DATABASE_ID, COLLECTION_ID, user.$id);
          setProfile({
            Username  : user.name,
            Email     : user.email,
            password  : "",
            Interests : doc.interests ?? "",
          });
        } catch {
          // İlk kez giriş — belge yok ➜ oluştur
          await databases.createDocument(DATABASE_ID, COLLECTION_ID, user.$id, {
            interests: "",
            userId   : user.$id,
          });
          setProfile({
            Username  : user.name,
            Email     : user.email,
            password  : "",
            Interests : "",
          });
        }
      } catch (err) {
        console.error("Appwrite profile fetch failed:", err);
      }
    })();
  }, []);

  /* --------------------------------------------------
     2️⃣  Edit aç
  -------------------------------------------------- */
  const openEditor = (field: keyof typeof profile | "Password") => {
    setEditingField(field);
    if (field === "Password") {
      setOldPass(""); setNewPass(""); setConfirmPass("");
    } else {
      setInputValue(profile[field]);
    }
  };

  /* --------------------------------------------------
     3️⃣  Username / Email / Interests kaydet
  -------------------------------------------------- */
  const saveGeneric = async () => {
    if (!editingField || editingField === "Password") return;

    try {
      const user = await account.get();

      if (editingField === "Email") {
        await account.updateEmail(inputValue);
      } else if (editingField === "Username") {
        await account.updateName(inputValue);
      } else if (editingField === "Interests") {
        await databases.updateDocument(DATABASE_ID, COLLECTION_ID, user.$id, {
          interests: inputValue,
        });
      }

      setProfile({ ...profile, [editingField]: inputValue });
      Alert.alert("Success", `${editingField} updated.`);
    } catch (err) {
      console.error("Update failed:", err);
      Alert.alert("Error", "Could not update.");
    } finally {
      setEditingField(null);
    }
  };

  /* --------------------------------------------------
     4️⃣  Şifre kaydet
  -------------------------------------------------- */
  const savePassword = async () => {
    if (newPass !== confirmPass) {
      return Alert.alert("Error", "Passwords do not match.");
    }
    try {
      await account.updatePassword(newPass, oldPass);
      Alert.alert("Success", "Password updated.");
      setProfile({ ...profile, password: newPass });
    } catch (err) {
      console.error("Password update error:", err);
      Alert.alert("Error", "Password update failed.");
    } finally {
      setEditingField(null);
    }
  };

  const fields = ["Username", "Email", "Password", "Interests"] as const;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="p-5 border-b border-gray-200 bg-purple-200">
        <Text className="text-2xl font-bold">{profile.Username}</Text>
      </View>

      {/* Fields */}
      <View className="flex-1 p-5">
        {fields.map((field) => {
          const val = field === "Password" ? "••••••••" : profile[field];
          return (
            <TouchableOpacity
              key={field}
              className="py-4 border-b border-gray-200 flex-row justify-between items-center"
              onPress={() => field === "Interests"
                ? router.push("../interests")
                : openEditor(field as any)
              }
            >
              <View>
                <Text className="text-gray-600 text-base">{field}</Text>
                <Text className="text-black text-base">{val}</Text>
              </View>
              {field === "Interests" && (
                <Text className="text-purple-600 font-semibold">Edit</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Logout */}
      <View className="px-5 mb-14">
        <TouchableOpacity
          className="bg-purple-200 py-3 rounded-xl items-center"
          onPress={async () => {
            await signout();
            router.replace("/signin");
          }}
        >
          <Text className="text-base font-bold">Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal transparent animationType="slide" visible={!!editingField}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-11/12 p-5 rounded-2xl">
            <Text className="text-lg font-semibold mb-4">
              {editingField === "Password" ? "Change Password" : `Change ${editingField}`}
            </Text>

            {editingField === "Password" ? (
              <>
                <TextInput
                  className="border border-gray-300 p-3 rounded-lg mb-3"
                  placeholder="Old Password"
                  secureTextEntry
                  value={oldPass}
                  onChangeText={setOldPass}
                />
                <TextInput
                  className="border border-gray-300 p-3 rounded-lg mb-3"
                  placeholder="New Password"
                  secureTextEntry
                  value={newPass}
                  onChangeText={setNewPass}
                />
                <TextInput
                  className="border border-gray-300 p-3 rounded-lg mb-6"
                  placeholder="Confirm Password"
                  secureTextEntry
                  value={confirmPass}
                  onChangeText={setConfirmPass}
                />

                <View className="flex-row justify-between">
                  <Pressable onPress={() => setEditingField(null)}>
                    <Text className="text-gray-500">Cancel</Text>
                  </Pressable>
                  <Pressable onPress={savePassword}>
                    <Text className="text-blue-600 font-semibold">Save</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <TextInput
                  className="border border-gray-300 p-3 rounded-lg mb-6"
                  placeholder={editingField ?? ""}
                  value={inputValue}
                  onChangeText={setInputValue}
                />

                <View className="flex-row justify-between">
                  <Pressable onPress={() => setEditingField(null)}>
                    <Text className="text-gray-500">Cancel</Text>
                  </Pressable>
                  <Pressable onPress={saveGeneric}>
                    <Text className="text-blue-600 font-semibold">Save</Text>
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
