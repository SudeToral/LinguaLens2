import { MaterialIcons } from "@expo/vector-icons";
import { Link, Tabs } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DropdownMenu } from "../Components/DropDownMenu";
import { MenuOption } from "../Components/MenuOption";

export function SettingsButton() {
    return (
      <Link href="/settings" asChild>
        <TouchableOpacity className="mx-5">
          <MaterialIcons name="settings" size={24} color="#fff" />
        </TouchableOpacity>
      </Link>
    );
}


export default function TabsLayout() {
    const [visible, setVisible] = useState(false);
    const [language, setLanguage] = useState("english");
  return (
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
          backgroundColor: "#0F0D23",
          borderRadius: 0,
          marginHorizontal: 0,
          marginBottom: 0,
          height: 80,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#0F0D23",
        },
        headerStyle: { backgroundColor: "#0F0D23" },
        headerLeft: () => <SettingsButton />,
        headerRight: () => <View style={styles.container}>
        <DropdownMenu
          visible={visible}
          handleOpen={() => setVisible(true)}
          handleClose={() => setVisible(false)}
          trigger={
            <View className="h-10 bg-white flex-row justify-items-center align-text-bottom w-20 px-1 py-1 mr-5">
              <Text className="font-semibold from-neutral-50"> {language} </Text>
            </View>
          }
        >
          <MenuOption onSelect={() => {
            setLanguage("spanish");
            setVisible(false);
          }}>
            <Text>spanish</Text>
          </MenuOption>
          <MenuOption onSelect={() => {
            setLanguage("turkish");
            setVisible(false);
          }}>
            <Text>turkish</Text>
          </MenuOption>
          <MenuOption onSelect={() => {
            setLanguage("english");
             setVisible(false);
           }}>
             <Text>english</Text>
           </MenuOption>
        </DropdownMenu>
      </View>
      }}
    >
      <Tabs.Screen
        name="flashcards"
        options={{
          title: "flashcards",
          headerShown: true,

        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "index",
          headerShown: true,
          
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
    container: {
    },
    triggerStyle: {
      height: 40,
      backgroundColor: "#fff",
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: 50,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
    },
    triggerText: {
      fontSize: 16,
    }
  });
  