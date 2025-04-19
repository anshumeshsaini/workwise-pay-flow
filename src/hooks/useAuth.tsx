
import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { User, UserRole } from "@/types";
import { generateAvatar } from "@/lib/utils";

// Mock user data for the demo (this would be integrated with Supabase in production)
const MOCK_USERS = [
  {
    id: "e-1",
    email: "employer@example.com",
    password: "password",
    role: "employer" as UserRole,
    name: "John Smith",
    avatar_url: "/avatars/employer.svg",
    wallet_balance: 5000,
    created_at: new Date().toISOString(),
  },
  {
    id: "l-1",
    email: "worker@example.com",
    password: "password",
    role: "labourer" as UserRole,
    name: "Ram Kumar",
    avatar_url: "/avatars/labourer.svg",
    wallet_balance: 1500,
    created_at: new Date().toISOString(),
    phone: "9876543210"
  }
];

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check local storage for user session on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("workwise_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      // In a real app, this would be a Supabase auth call
      const mockUser = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );

      if (!mockUser) {
        throw new Error("Invalid credentials");
      }

      // Strip out the password before storing
      const { password: _, ...userWithoutPassword } = mockUser;
      
      // Store user in state and localStorage
      setUser(userWithoutPassword as User);
      localStorage.setItem("workwise_user", JSON.stringify(userWithoutPassword));
      
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    setIsLoading(true);

    try {
      // Check if user already exists
      if (MOCK_USERS.some((u) => u.email === email)) {
        throw new Error("Email already in use");
      }

      // Create new user (in a real app, this would be a Supabase auth call)
      const newUser = {
        id: `user-${Date.now()}`,
        email,
        password, // In real app, this would be handled by Supabase, not stored directly
        role: userData.role || "labourer",
        name: userData.name || "User",
        avatar_url: generateAvatar(userData.name || "User"),
        wallet_balance: 0,
        created_at: new Date().toISOString(),
        phone: userData.phone || "",
      };

      // Add to mock data (in real app, this would be saved to Supabase)
      MOCK_USERS.push(newUser);

      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      });
      
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    // In a real app, this would call Supabase auth.signOut()
    setUser(null);
    localStorage.removeItem("workwise_user");
    
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user) return;
    
    try {
      // In a real app, this would update the user in Supabase
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("workwise_user", JSON.stringify(updatedUser));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Update user error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
