import { ProfileProvider } from "@/context/ProfileContext";
import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "react-native";
import "./globals.css";

export default function RootLayout() {
  return (
    <ProfileProvider>
      <StatusBar hidden={true} />

      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      </ProfileProvider>
  );
}
