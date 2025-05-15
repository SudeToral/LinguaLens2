// app/Interests.tsx

import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useProfile } from "../context/ProfileContext";

const ALL_INTERESTS = [
  "Machine Learning",
  "Robotics",
  "Engineering",
  "Artificial Intelligence",
  "Data Science",
  "Android",
  "iOS",
  "Big Data",
  "Drone",
  "Blockchain",
  "Selenium",
  "Web Development",
  "Virtual Reality",
  "Python",
  "IoT",
  "UI/UX Design",
  "Ethical Hacking",
  "Game Development",
  "CAT Test",
];

const InterestsScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile, setProfile } = useProfile();

  // initialize selected from existing profile.Interests
  const [selected, setSelected] = useState<string[]>(
    profile.Interests ? profile.Interests.split(", ") : []
  );

  const toggle = (topic: string) =>
    setSelected((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );

  return (
    <SafeAreaView className="bg-white flex-1">
      {/* Top title */}
      <View className="px-6 pt-6">
        <Text className="text-gray-800 text-xl font-semibold">
          Pick your interests
        </Text>
      </View>

      {/* Scrollable chips */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 24,
        }}
      >
        <View style={styles.chipContainer}>
          {ALL_INTERESTS.map((topic) => {
            const isSel = selected.includes(topic);
            return (
              <Pressable
                key={topic}
                onPress={() => toggle(topic)}
                style={[styles.chip, isSel && styles.chipSelected]}
              >
                <Text
                  style={[styles.chipText, isSel && styles.chipTextSelected]}
                >
                  {topic}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Done button */}
      <View
        className="px-6"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Pressable
          className="bg-purple-600 py-3 rounded-xl items-center"
          onPress={() => {
            // write back to profile context and go back
            setProfile({
              ...profile,
              Interests: selected.join(", "),
            });
            router.back();
          }}
        >
          <Text className="text-white text-base font-medium">Done</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default InterestsScreen;

const styles = StyleSheet.create({
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4, // compensate chip margin
  },
  chip: {
    margin: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB", // gray-300
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },
  chipSelected: {
    backgroundColor: "#EDE9FE", // purple-100
    borderColor: "#C4B5FD",     // purple-300
  },
  chipText: {
    color: "#4B5563", // gray-600
    fontSize: 14,
  },
  chipTextSelected: {
    color: "#5B21B6", // purple-700
  },
});
