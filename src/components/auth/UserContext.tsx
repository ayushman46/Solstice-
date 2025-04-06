import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUser, User as UserType } from '@/lib/data';
import { toast } from 'sonner';

type UserContextType = {
  user: UserType;
  updateUser: (userData: Partial<UserType>) => void;
  isLoading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserType>(() => {
    // Try to get user from local storage
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : mockUser;
  });

  useEffect(() => {
    // Save user to local storage when it changes
    localStorage.setItem('user', JSON.stringify(user));
    
    // Also save name and email separately for other components to use easily
    localStorage.setItem('userName', user.name);
    localStorage.setItem('userEmail', user.email);
    
    // Check if we have an auth token but no user data - this shouldn't happen,
    // but just in case, we'll keep the user logged in with default data
    const authToken = localStorage.getItem('authToken');
    if (authToken && !user.id) {
      setUser(mockUser);
    }
    
    setIsLoading(false);
  }, [user]);

  const updateUser = (userData: Partial<UserType>) => {
    setUser(prev => {
      const updatedUser = { ...prev, ...userData };
      return updatedUser;
    });
    toast.success("Profile updated successfully!");
  };

  return (
    <UserContext.Provider value={{ user, updateUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};
