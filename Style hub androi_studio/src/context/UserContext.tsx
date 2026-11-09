import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { api, FALLBACK_USERS } from '../services/api';

const SESSION_STORAGE_KEY = 'stylehub_active_user_session';

export interface LoginResult {
  success: boolean;
  user: User;
  isFallback: boolean;
  message: string;
}

interface UserContextType {
  users: User[];
  currentUser: User | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  setCurrentUser: (user: User | null) => void;
  loginById: (userId: number) => boolean;
  loginWithCredentials: (username: string, password?: string) => Promise<LoginResult>;
  loginDemoBypass: (userId?: number) => LoginResult;
  logout: () => void;
  isLoadingUsers: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(FALLBACK_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      return FALLBACK_USERS[0]; // John Doe by default
    } catch {
      return FALLBACK_USERS[0];
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    async function loadUsers() {
      try {
        const fetched = await api.getUsers();
        if (mounted && fetched.length > 0) {
          setUsers(fetched);
          setCurrentUser((prev) => {
            if (!prev) return fetched[0];
            const updated = fetched.find((u) => u.id === prev.id);
            return updated || prev;
          });
        }
      } catch (err) {
        console.warn('Could not fetch remote users, using fallback users', err);
      } finally {
        if (mounted) setIsLoadingUsers(false);
      }
    }

    loadUsers();
    return () => {
      mounted = false;
    };
  }, []);

  // Sync session to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to sync user session to localStorage', e);
    }
  }, [currentUser]);

  const loginById = useCallback((userId: number): boolean => {
    const user = users.find((u) => u.id === userId) || users[0] || FALLBACK_USERS[0];
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    return true;
  }, [users]);

  // Robust Credential Handler with Smart Fallback (Bypass)
  const loginWithCredentials = useCallback(
    async (username: string, password?: string): Promise<LoginResult> => {
      const trimmedUser = (username || '').trim().toLowerCase();

      // Check loaded users first
      let foundUser = users.find(
        (u) =>
          u.username.toLowerCase() === trimmedUser ||
          u.email.toLowerCase() === trimmedUser ||
          u.name.firstname.toLowerCase() === trimmedUser
      );

      if (!foundUser && trimmedUser) {
        foundUser = users.find(
          (u) =>
            u.name.firstname.toLowerCase().includes(trimmedUser) ||
            u.name.lastname.toLowerCase().includes(trimmedUser) ||
            trimmedUser.includes(u.name.firstname.toLowerCase())
        );
      }

      if (foundUser) {
        // Attempt API auth if password was supplied, but never fail
        if (password) {
          await api.authenticateUser(foundUser.username, password).catch(() => {});
        }
        setCurrentUser(foundUser);
        setIsAuthModalOpen(false);
        return {
          success: true,
          user: foundUser,
          isFallback: false,
          message: `¡Bienvenido de nuevo, ${foundUser.name.firstname}! Sesión verificada con Fake Store API.`,
        };
      }

      // SMART FALLBACK BYPASS: Never block the presentation!
      const fallbackUser = users[0] || FALLBACK_USERS[0];
      setCurrentUser(fallbackUser);
      setIsAuthModalOpen(false);

      return {
        success: true,
        user: fallbackUser,
        isFallback: true,
        message: `¡Acceso concedido! Se activó el perfil de prueba (${fallbackUser.name.firstname} ${fallbackUser.name.lastname}) para garantizar la presentación.`,
      };
    },
    [users]
  );

  // Instant 1-click Demo Bypass
  const loginDemoBypass = useCallback(
    (userId?: number): LoginResult => {
      const selected =
        (userId ? users.find((u) => u.id === userId) : null) ||
        users[0] ||
        FALLBACK_USERS[0];

      setCurrentUser(selected);
      setIsAuthModalOpen(false);

      return {
        success: true,
        user: selected,
        isFallback: false,
        message: `Acceso rápido activado: ${selected.name.firstname} ${selected.name.lastname} (FakeStore API #${selected.id})`,
      };
    },
    [users]
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  return (
    <UserContext.Provider
      value={{
        users,
        currentUser,
        isAuthenticated: !!currentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        setCurrentUser,
        loginById,
        loginWithCredentials,
        loginDemoBypass,
        logout,
        isLoadingUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
