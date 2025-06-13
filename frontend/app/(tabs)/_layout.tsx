// app/(tabs)/_layout.tsx

import { MaterialIcons, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, Tabs } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ProfileProvider } from "../../context/ProfileContext";
import { DropdownMenu } from "../Components/DropDownMenu";
import { MenuOption } from "../Components/MenuOption";

export function SettingsButton() {
  return (
    <Link href="/settings" asChild>
      <TouchableOpacity className="mx-5">
        <MaterialIcons name="settings" size={24} color="black" />
      </TouchableOpacity>
    </Link>
  );
}

export default function TabsLayout() {
  const [visible, setVisible] = useState(false);
  const [language, setLanguage] = useState("english");

  return (
    <ProfileProvider>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarItemStyle: {
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          },
          tabBarStyle: {
            backgroundColor: "#64B5F6", // Background for navbar
            height: 100,
            position: "absolute",
            borderWidth: 0,
            borderColor: "#0F0D23",
            overflow: "hidden",
          },
          headerStyle: {
            backgroundColor: "#64B5F6",
          },
          tabBarIconStyle: {
            justifyContent: "center",
            marginTop: 15,
          },
          headerLeft: () => <SettingsButton />,
          headerRight: () => (
            <View className="mr-5">
              <DropdownMenu
                visible={visible}
                handleOpen={() => setVisible(true)}
                handleClose={() => setVisible(false)}
                trigger={
                  <View className="h-10 bg-white flex-row justify-center items-center w-20 px-2 py-1 rounded">
                    <Text className="font-semibold text-black font-playpen">{language}</Text>
                  </View>
                }
              >
                <MenuOption
                  onSelect={() => {
                    setLanguage("spanish");
                    setVisible(false);
                  }}
                >
                  <Text>spanish</Text>
                </MenuOption>
                <MenuOption
                  onSelect={() => {
                    setLanguage("turkish");
                    setVisible(false);
                  }}
                >
                  <Text>turkish</Text>
                </MenuOption>
                <MenuOption
                  onSelect={() => {
                    setLanguage("english");
                    setVisible(false);
                  }}
                >
                  <Text>english</Text>
                </MenuOption>
              </DropdownMenu>
            </View>
          ),
        }}
      >
        <Tabs.Screen
          name="flashcards"
          options={{
            title: "Flashcards",
            headerShown: true,
            tabBarIcon: ({ size }) => (
              <MaterialCommunityIcons name="cards" size={32} color="black" />)
          }}/>
        <Tabs.Screen
          name="index"
          options={{
            title: "LinguaLens",
            headerShown: true,
            tabBarIcon: ({ size }) => (
              <Entypo name="home" size={32} color="black"/>)
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ size }) => (
              <MaterialCommunityIcons name="account" size={32} color="black" />)
          }}
        />
      </Tabs>
    </ProfileProvider>
  );
}
