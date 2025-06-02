import { useRouter } from "expo-router";
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
import "./globals.css";
import { account, databases } from "./lib/appwriteConfig"; // ✅ Databases eklendi

// 🔁 tam ID’lerle değiştir
const DATABASE_ID   = "682b8dc8002b735ece29";     // senin Database ID’in
const COLLECTION_ID = "682b8dfc0011b9c6a991";  


const ALL_INTERESTS = [
  "Travel",
  "Food & Cooking",
  "Nature",
  "Art & Culture",
  "Music",
  "Movies & TV",
  "Technology",
  "Business",
  "Science",
  "History",
  "Sports",
  "Fashion",
  "Education",
  "Health & Wellness",
  "Hobbies",
  "Social Media",
  "Environment",
  "Literature",
  "Relationships",
  "Politics",
];


const InterestsScreen = () => {
  const insets = useSafeAreaInsets();
  const router  = useRouter();
  const { profile, setProfile } = useProfile();

  const [selected, setSelected] = useState<string[]>([]);

  /* --------------------------------------------------
     1️⃣  Appwrite’tan mevcut interests’i getir
  -------------------------------------------------- */
  useEffect(() => {
    (async () => {
      try {
        const user = await account.get();
        const doc  = await databases.getDocument(DATABASE_ID, COLLECTION_ID, user.$id);
        const current = doc?.interests ? (doc.interests as string).split(", ") : [];
        setSelected(current);
      } catch {
        // Belge yoksa (ilk kullanıcı) context’tekini göster
        if (profile.Interests) {
          setSelected(profile.Interests.split(", "));
        }
      }
    })();
  }, []);

  /* --------------------------------------------------
     2️⃣  Chip seç / kaldır
  -------------------------------------------------- */
  const toggle = (topic: string) =>
    setSelected((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );

  /* --------------------------------------------------
     3️⃣  Kaydet ➜ DB + Context
  -------------------------------------------------- */
  const handleDone = async () => {
    const interestsString = selected.join(", ");
    try {
      const user = await account.get();
      // güncelle veya yoksa oluştur
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
          [ "user:" + user.$id ],
        );
        
      }
      setProfile({ ...profile, Interests: interestsString });
    } catch (err) {
      console.error("Interests save failed:", err);
    } finally {
      router.push("../(tabs)/profile");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Title */}
      <View className="flex-row items-center px-6 pt-12">
      <Pressable onPress={() => router.navigate("/profile")} className="mr-2">
        <Text className="text-3xl text-black">←</Text>
      </Pressable>
      <Text className="text-4xl font-semibold text-gray-800">Pick your interests</Text>
    </View>


      {/* Chips */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 30, paddingTop: 45, paddingBottom: 24 }}>
        <View className="flex-row flex-wrap -mx-1.5">
          {ALL_INTERESTS.map((topic) => {
            const isSel = selected.includes(topic);
            return (
              <Pressable
                key={topic}
                onPress={() => toggle(topic)}
                className={`m-1.5 px-4 py-3 rounded-full border ${
                  isSel ? "bg-blue-200 border-support" : "bg-white border-gray-300"
                }`}
              >
                <Text className={`${isSel ? "text-blue-600" : "text-gray-600"} text-m`}>
                  {topic}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Done button */}
      <View className="px-6" style={{ paddingBottom: insets.bottom + 16 }}>
        <Pressable onPress={handleDone} className="bg-support py-4 rounded-2xl items-center">
          <Text className="text-black font-semibold text-xl ">Done</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default InterestsScreen;
