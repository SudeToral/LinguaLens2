import { MaterialIcons } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProfileProvider } from '../../context/ProfileContext';
import { DropdownMenu } from '../Components/DropDownMenu';
import { MenuOption } from '../Components/MenuOption';

// Settings button in header
export function SettingsButton() {
  return (
    <Link href="/settings" asChild>
      <TouchableOpacity style={styles.settingsButton}>
        <MaterialIcons name="settings" size={24} color="#fff" />
      </TouchableOpacity>
    </Link>
  );
}

// Tabs layout wrapping flashcards, camera (index) and profile screens
export default function TabsLayout() {
  const [visible, setVisible] = useState(false);
  const [language, setLanguage] = useState('english');

  return (
    <ProfileProvider>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarItemStyle: {
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          },
          tabBarStyle: {
            backgroundColor: '#0F0D23',
            height: 80,
            position: 'absolute',
            borderTopWidth: 1,
            borderColor: '#0F0D23',
          },
          headerStyle: { backgroundColor: '#0F0D23' },
          headerLeft: () => <SettingsButton />,
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <DropdownMenu
                visible={visible}
                handleOpen={() => setVisible(true)}
                handleClose={() => setVisible(false)}
                trigger={
                  <View style={styles.languageTrigger}>
                    <Text style={styles.languageText}>{language}</Text>
                  </View>
                }
              >
                <MenuOption
                  onSelect={() => {
                    setLanguage('spanish');
                    setVisible(false);
                  }}
                >
                  <Text>spanish</Text>
                </MenuOption>
                <MenuOption
                  onSelect={() => {
                    setLanguage('turkish');
                    setVisible(false);
                  }}
                >
                  <Text>turkish</Text>
                </MenuOption>
                <MenuOption
                  onSelect={() => {
                    setLanguage('english');
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
            title: 'Flashcards',
            headerShown: true,
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'Camera',
            headerShown: true,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
          }}
        />
      </Tabs>
    </ProfileProvider>
  );
}

const styles = StyleSheet.create({
  settingsButton: {
    marginLeft: 16,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  languageTrigger: {
    height: 36,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F0D23',
  },
});