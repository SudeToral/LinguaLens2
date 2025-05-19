import { createUserWithEmailAndPassword, User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { auth } from "/Users/sudetoral/linguLens2/FirebaseConfig";

// Kullanıcı tipi
type User = {
  email: string;
  username?: string;
};

// Context tipii
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean | undefined;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
};

// Context oluşturuluyor
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContextProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const currentUser: User = {
          email: firebaseUser.email ?? "",
          username: firebaseUser.displayName ?? "",
        };
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser({
        email: result.user.email ?? "",
        username: result.user.displayName ?? "",
      });
      setIsAuthenticated(true);
    } catch (e) {
      console.log("Login error:", e);
      throw e;
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Firebase displayName'e kullanıcı adını set et
      await updateProfile(result.user, {
        displayName: username,
      });

      setUser({
        email: result.user.email ?? "",
        username: username,
      });
      setIsAuthenticated(true);
    } catch (e) {
      console.log("Register error:", e);
      throw e;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be wrapped inside AuthContextProvider!");
  }
  return value;
};
