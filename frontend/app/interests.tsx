import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useProfile } from "../context/ProfileContext";
import AnimatedSnackbar from "./Components/AnimatedSnackbar";
import { account, databases } from "./lib/appwriteConfig";
import "./globals.css";
import { Permission, Role } from "appwrite";


const DATABASE_ID = "682b8dc8002b735ece29";
const COLLECTION_ID = "682b8dfc0011b9c6a991";

const ALL_INTERESTS = [
  "Travel", "Food & Cooking", "Nature", "Art & Culture", "Music", "Movies & TV",
  "Technology", "Business", "Science", "History", "Sports", "Fashion", "Education",
  "Health & Wellness", "Hobbies", "Social Media", "Environment", "Literature",
  "Relationships", "Politics",
];

const InterestsScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile, setProfile } = useProfile();
  const params = useLocalSearchParams(); // 👈 URL parametrelerini al
  const isSignup = params.source === "signup"; // 👈 SignUp’tan mı geldiğini kontrol et

  const [selected, setSelected] = useState<string[]>([]);
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");

  const showSnackbar = (msg: string) => {
    setSnackMsg(msg);
    setSnackVisible(true);
  };

  useEffect(() => {
    (async () => {
      try {
        const user = await account.get();
  
        // ❗ Sign up'tan gelmişse, hiç kayıtlı interest yükleme
        if (isSignup) {
          setSelected([]); // 👉 hiçbiri seçili olmasın
          return;
        }
  
        // ↪️ Normal kullanıcı için eski interest'leri getir
        const doc = await databases.getDocument(DATABASE_ID, COLLECTION_ID, user.$id);
        const current = doc?.interests ? (doc.interests as string).split(", ") : [];
        setSelected(current);
  
      } catch {
        if (!isSignup && profile.Interests) {
          setSelected(profile.Interests.split(", "));
        }
      }
    })();
  }, []);
  

  const toggle = (topic: string) =>
    setSelected((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );

  const handleDone = async () => {
    if (selected.length === 0) {
      return showSnackbar("Please select at least one interest.");
    }

    const interestsString = selected.join(", ");
    try {
      const user = await account.get();
      try {
        await databases.updateDocument(DATABASE_ID, COLLECTION_ID, user.$id, {
          interests: interestsString,
        });
      } catch {
        await databases.createDocument(
          DATABASE_ID,
          COLLECTION_ID,
          user.$id,
          { interests: interestsString, userId: user.$id },
          [
            Permission.read(Role.user(user.$id)),
            Permission.write(Role.user(user.$id)),
            Permission.update(Role.user(user.$id)),
            Permission.delete(Role.user(user.$id)),
          ]
        );
        
      }
      setProfile({ ...profile, Interests: interestsString });

      if (isSignup) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(tabs)/profile");
      }
      
    } catch (err) {
      console.error("Interests save failed:", err);
      showSnackbar("Failed to save interests.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      {/* Geri oku sadece profilden geldiyse göster */}
      <View className="flex-row items-center px-6 pt-12">
        {!isSignup && (
          <Pressable onPress={() => router.push("/(tabs)/profile")} className="mr-2">
            <Text className="text-3xl text-black">←</Text>
          </Pressable>
        )}
        <Text className="text-4xl font-semibold text-gray-800">Pick your interests</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 30, paddingTop: 45, paddingBottom: 24 }}>
        <View className="flex-row flex-wrap -mx-1.5">
          {ALL_INTERESTS.map((topic) => {
            const isSel = selected.includes(topic);
            return (
              <Pressable
                key={topic}
                onPress={() => toggle(topic)}
                className={`m-1.5 px-4 py-3 rounded-full border ${
                  isSel ? "bg-light-100 border-support" : "bg-primary border-black"
                }`}
              >
                <Text className={`${isSel ? "text-light100 font-semibold" : "text-gray-600"} text-m`}>
                  {topic}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View className="px-6" style={{ paddingBottom: insets.bottom + 16 }}>
        <Pressable onPress={handleDone} className="bg-tertiary py-4 rounded-2xl items-center">
          <Text className="text-black font-semibold text-xl">Done</Text>
        </Pressable>
      </View>

      <AnimatedSnackbar
        message={snackMsg}
        visible={snackVisible}
        onClose={() => setSnackVisible(false)}
      />
    </SafeAreaView>
  );
};

export default InterestsScreen;
