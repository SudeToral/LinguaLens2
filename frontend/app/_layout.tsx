import { AuthContextProvider, useAuth } from "@/context/AuthContext";
import { ProfileProvider } from "@/context/ProfileContext";
import { Slot, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StatusBar } from "react-native";


const InnerLayout = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof isAuthenticated === "undefined") return;

    if (!isAuthenticated) {
      router.replace("/signup");
    }
  }, [isAuthenticated]);

  return <Slot />;
};

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <ProfileProvider>
        <StatusBar hidden />
        <InnerLayout />
      </ProfileProvider>
    </AuthContextProvider>
  );
}
