import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { account } from "../app/lib/appwriteConfig";
  
  // User type based on Appwrite's response
  type User = {
    $id: string;
    name: string;
    email: string;
    [key: string]: any;
  };
  
  type Session = {
    $id: string;
    userId: string;
    expire: string;
    [key: string]: any;
  };
  
  type SigninParams = {
    email: string;
    password: string;
  };
  
  type AuthContextType = {
    session: Session | null;
    user: User | null;
    isAuthenticated: boolean | undefined;
    signin: (credentials: SigninParams) => Promise<void>;
    register: (email: string, password: string, username: string) => Promise<void>;
    signout: () => Promise<void>;
  };
  
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
  type AuthProviderProps = {
    children: ReactNode;
  };
  
  export const AuthContextProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      checkAuth();
    }, []);
  
    const checkAuth = async () => {
      try {
        const userResp = await account.get();
        setUser(userResp);
        setIsAuthenticated(true);
      } catch (error) {
        setUser(null);
        setSession(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
  
    const signin = async ({ email, password }: SigninParams): Promise<void> => {
      try {
        setLoading(true);
        const sessionResponse = await account.createEmailPasswordSession(email, password);
        setSession(sessionResponse);
        const userResponse = await account.get();
        setUser(userResponse);
        setIsAuthenticated(true);
      } catch (error) {
        console.log("Signin failed:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    };
  
    const register = async (email: string, password: string, username: string): Promise<void> => {
      try {
        setLoading(true);
        // Create a new user account.
        // The "unique()" value tells Appwrite to generate a unique user ID.
        await account.create("unique()", email, password, username);
        // Automatically sign in the user after registration.
        await signin({ email, password });
      } catch (error) {
        console.log("Registration failed:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    };
  
    const signout = async (): Promise<void> => {
      try {
        setLoading(true);
        await account.deleteSession("current");
        setUser(null);
        setSession(null);
        setIsAuthenticated(false);
      } catch (error) {
        console.log("Signout failed:", error);
      } finally {
        setLoading(false);
      }
    };
  
    const contextData: AuthContextType = {
      session,
      user,
      isAuthenticated,
      signin,
      register,
      signout,
    };
  
    return (
      <AuthContext.Provider value={contextData}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthContextProvider");
    }
    return context;
  };
  