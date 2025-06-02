import React, { createContext, ReactNode, useContext, useState } from "react";

// Define the shape of the user profile
export type Profile = {
  Username: string;
  Email: string;
  password: string;       // stored securely, never exposed directly
  Interests: string;      // comma-separated list of interests
};

// Define the context type
type ProfileContextType = {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
};

// Provide default values
const defaultProfile: Profile = {
  Username: "john_doe",
  Email: "john@example.com",
  password: "",
  Interests: "",
};

// Create the context
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Provider component
export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

// Hook for consuming the context
export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
