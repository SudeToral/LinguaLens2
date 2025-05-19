import { Slot, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { AuthContextProvider, useAuth } from '../context/authContext';
import { ProfileProvider } from '../context/ProfileContext';
import './globals.css';

// Redirect logic wrapped in its own component
const InitialLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (typeof isAuthenticated === 'undefined') {
      return; // still loading
    }

    const inTabsGroup = segments[0] === '(tabs)';

    if (isAuthenticated && !inTabsGroup) {
      router.replace('/');
    } else if (!isAuthenticated && inTabsGroup) {
      router.replace('/signin');
    }
  }, [isAuthenticated, segments, router]);

  return <Slot />;
};

// Root layout for the entire app
export default function RootLayout() {
  return (
    <AuthContextProvider>
      <ProfileProvider>
        <StatusBar hidden />
        <InitialLayout />
      </ProfileProvider>
    </AuthContextProvider>
  );
}
