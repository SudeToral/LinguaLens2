import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useProfile } from "../../context/ProfileContext";
import AnimatedSnackbar from "../Components/AnimatedSnackbar";
import { account, databases } from "../lib/appwriteConfig";

type EditableField = "Username" | "Email" | "Interests" | "Password";

const DATABASE_ID = "682b8dc8002b735ece29";
const COLLECTION_ID = "682b8dfc0011b9c6a991";

const Profile = () => {
  const router = useRouter();
  const { profile, setProfile } = useProfile();
  const { signout } = useAuth();
  const insets = useSafeAreaInsets();

  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");

  const showSnackbar = (message: string) => {
    setSnackMsg(message);
    setSnackVisible(true);
  };

  useEffect(() => {
    (async () => {
      try {
        const user = await account.get();
        try {
          const doc = await databases.getDocument(DATABASE_ID, COLLECTION_ID, user.$id);
          setProfile({
            Username: user.name,
            Email: user.email,
            password: "",
            Interests: doc.interests ?? "",
          });
        } catch {
          await databases.createDocument(DATABASE_ID, COLLECTION_ID, user.$id, {
            interests: "",
            userId: user.$id,
          });
          setProfile({
            Username: user.name,
            Email: user.email,
            password: "",
            Interests: "",
          });
        }
      } catch (err) {
        console.error("Appwrite profile fetch failed:", err);
      }
    })();
  }, []);

  const openEditor = (field: EditableField) => {
    setEditingField(field);
    if (field === "Password") {
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
    } else {
      setInputValue(profile[field]);
      setOldPass("");
    }
  };

  const saveGeneric = async () => {
    if (!editingField || editingField === "Password") return;
    try {
      const user = await account.get();

      if (editingField === "Email") {
        if (!oldPass) {
          showSnackbar("Please enter your password to update email.");
          return;
        }
        await account.updateEmail(inputValue, oldPass);
        showSnackbar("Email updated successfully!");
      } else if (editingField === "Username") {
        await account.updateName(inputValue);
        showSnackbar("Username updated successfully!");
      } else if (editingField === "Interests") {
        await databases.updateDocument(DATABASE_ID, COLLECTION_ID, user.$id, {
          interests: inputValue,
        });
        showSnackbar("Interests updated successfully!");
      }

      setProfile({ ...profile, [editingField]: inputValue });
    } catch (err) {
      console.error("Update failed:", err);
      const msg =
        editingField === "Email"
          ? "Email update failed. Please try again."
          : `${editingField} update failed.`;
      showSnackbar(msg);
    } finally {
      setEditingField(null);
      setOldPass("");
    }
  };

  const savePassword = async () => {
    if (newPass !== confirmPass) {
      showSnackbar("Passwords do not match.");
      return;
    }
    try {
      await account.updatePassword(newPass, oldPass);
      setProfile({ ...profile, password: newPass });
      showSnackbar("Password updated successfully!");
    } catch (err) {
      console.error("Password update error:", err);
      showSnackbar("Password update failed. Please try again.");
    } finally {
      setEditingField(null);
    }
  };

  const fields: EditableField[] = ["Username", "Email", "Password", "Interests"];

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="p-5  border-gray-300 bg-tertiary">
        <Text className="text-2xl font-bold text-black">{profile.Username}</Text>
      </View>

      <View className="flex-1 p-5">
        {fields.map((field) => {
          const val = field === "Password" ? "••••••••" : profile[field];
          return (
            <TouchableOpacity
              key={field}
              className="py-4 border-b border-gray-200 flex-row justify-between items-center"
              onPress={() =>
                field === "Interests"
                  ? router.push("../interests")
                  : openEditor(field)
              }
            >
              <View>
                <Text className="text-base text-gray-600">{field}</Text>
                <Text className="text-base text-black">{val}</Text>
              </View>
              
            </TouchableOpacity>
          );
        })}
      </View>

      <View className="px-5 mb-20">
        <TouchableOpacity
          className="bg-secondary py-3 rounded-2xl items-center"
          onPress={async () => {
            await signout();
            router.replace("/signin");
          }}
        >
          <Text className="text-base font-bold text-black">Log Out</Text>
        </TouchableOpacity>
      </View>

      <Modal transparent animationType="slide" visible={!!editingField}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-primary w-11/12 p-5 rounded-2xl">
            <Text className="text-lg font-semibold mb-4 text-black">
              {editingField === "Password" ? "Change Password" : `Change ${editingField}`}
            </Text>

            {editingField === "Password" ? (
              <>
                <TextInput
                  className="border border-gray-400 p-3 rounded-lg mb-3 text-black"
                  placeholder="Old Password"
                  secureTextEntry
                  value={oldPass}
                  onChangeText={setOldPass}
                />
                <TextInput
                  className="border border-gray-400 p-3 rounded-lg mb-3 text-black"
                  placeholder="New Password"
                  secureTextEntry
                  value={newPass}
                  onChangeText={setNewPass}
                />
                <TextInput
                  className="border border-gray-400 p-3 rounded-lg mb-6 text-black"
                  placeholder="Confirm Password"
                  secureTextEntry
                  value={confirmPass}
                  onChangeText={setConfirmPass}
                />
              </>
            ) : (
              <>
                <TextInput
                  className="border border-gray-400 p-3 rounded-lg mb-3 text-black"
                  placeholder={editingField ?? ""}
                  value={inputValue}
                  onChangeText={setInputValue}
                />

                {editingField === "Email" && (
                  <>
                    <Text className="text-sm text-gray-500 mb-1 ml-1">
                      To update your email, please enter your current password.
                    </Text>
                    <TextInput
                      className="border border-gray-400 p-3 rounded-lg mb-6 text-black"
                      placeholder="Current Password"
                      secureTextEntry
                      value={oldPass}
                      onChangeText={setOldPass}
                    />
                  </>
                )}
              </>
            )}

            <View className="flex-row justify-between">
              <Pressable onPress={() => setEditingField(null)}>
                <Text className="text-gray-500">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={editingField === "Password" ? savePassword : saveGeneric}
              >
                <Text className="text-tertiary font-semibold">Save</Text>
              </Pressable>
            </View>
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

export default Profile;