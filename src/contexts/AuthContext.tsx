import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('music_app_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('music_app_users') || '[]');
    const userExists = existingUsers.find((u: any) => u.email === email);
    
    if (userExists) {
      return false; // User already exists
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In real app, this would be hashed
      name,
    };

    // Save to users list
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem('music_app_users', JSON.stringify(updatedUsers));

    // Set current user (without password)
    const userWithoutPassword = { id: newUser.id, email: newUser.email, name: newUser.name };
    setUser(userWithoutPassword);
    localStorage.setItem('music_app_user', JSON.stringify(userWithoutPassword));

    return true;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const existingUsers = JSON.parse(localStorage.getItem('music_app_users') || '[]');
    const user = existingUsers.find((u: any) => u.email === email && u.password === password);
    
    if (user) {
      const userWithoutPassword = { id: user.id, email: user.email, name: user.name };
      setUser(userWithoutPassword);
      localStorage.setItem('music_app_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('music_app_user');
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};