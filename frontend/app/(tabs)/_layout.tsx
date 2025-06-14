import { MaterialIcons, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, Tabs } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ProfileProvider } from "../../context/ProfileContext";
import { DropdownMenu } from "../Components/DropDownMenu";
import { MenuOption } from "../Components/MenuOption";
import { create } from 'zustand';
import CountryFlag from "react-native-country-flag";


interface StoreState {
  targetLang: string;
  setTargetLang: (v: string) => void;
}

export const targetLanguage = create<StoreState>((set) => ({
  targetLang: 'Turkish',
  setTargetLang: (v) => set({ targetLang: v }),
}));

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
  const { targetLang, setTargetLang } = targetLanguage();
  const flagMap: { [key: string]: string } = {
    English: "US",
    Turkish: "TR",
    Spanish: "ES",
  };
  

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
            backgroundColor: "#708A58", // Background for navbar
            height: 100,
            position: "absolute",
            borderWidth: 0,
            borderColor: "#0F0D23",
            overflow: "hidden",
          },
          headerStyle: {
            backgroundColor: "#708A58",
            height: 120,
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
                  <View className="h-10 bg-tertiary flex-row justify-center items-center w-20 px-2 py-1 rounded-3xl">
                    <CountryFlag isoCode={flagMap[targetLang]} size={20} />
                    {/* Eğer istersen yanına targetLang de gösterebilirsin */}
                    {/* <Text className="ml-2 text-black font-semibold">{targetLang}</Text> */}
                  </View>
                }
                
              >
                <MenuOption
  onSelect={() => {
    setTargetLang("Spanish");
    setVisible(false);
  }}
>
  <View className="flex-row items-center space-x-2 rounded-3xl">
    <CountryFlag isoCode="ES" size={25} />
    <Text>Spanish</Text>
  </View>
    </MenuOption>

    <MenuOption
      onSelect={() => {
      
        setTargetLang("Turkish");
        setVisible(false);
      }}
    >
      <View className="flex-row items-center space-x-2">
        <CountryFlag isoCode="TR" size={25} />
        <Text>Turkish</Text>
      </View>
    </MenuOption>

    <MenuOption
      onSelect={() => {
        setTargetLang("English");
        setVisible(false);
      }}
    >
      <View className="flex-row items-center space-x-2">
        <CountryFlag isoCode="US" size={25} />
        <Text>English</Text>
      </View>
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