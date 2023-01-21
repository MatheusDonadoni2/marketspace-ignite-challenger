import { createContext, ReactNode, useEffect, useState } from "react";

import { api } from "@services/api";
import { UserDTO } from "@dtos/UserDTO";

import {
  storageUserGet,
  storageUserRemove,
  storageUserSave,
} from "@storage/storageUser";
import {
  storageAuthTokenGet,
  storageAuthTokenRemove,
  storageAuthTokenSave,
} from "@storage/storageToken";

export type AuthContextDataProps = {
  user: UserDTO;
  isLoadingAsyncStorage: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshedToken: string;
};

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

type AuthContextProviderProps = {
  children: ReactNode;
};

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState({} as UserDTO);
  const [refreshedToken, setRefreshedToken] = useState("");
  const [isLoadingAsyncStorage, setIsLoadingAsyncStorage] = useState(false);

  async function userAndTokenUpdate(userData: UserDTO, token: string) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
  }

  async function storageUserAndTokenSave(user: UserDTO, token: string) {
    try {
      setIsLoadingAsyncStorage(true);
      await storageUserSave(user);
      await storageAuthTokenSave(token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingAsyncStorage(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post("/sessions", { email, password });
      if (data.user && data.token) {
        await userAndTokenUpdate(data.user, data.token);
        await storageUserAndTokenSave(data.user, data.token);
      }
    } catch (error) {
      throw error;
    }
  }

  async function signOut() {
    try {
      setIsLoadingAsyncStorage(true);
      setUser({} as UserDTO);
      await storageAuthTokenRemove();
      await storageUserRemove();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingAsyncStorage(false);
    }
  }

  function refreshedTokenUpdated(newToken: string) {
    setRefreshedToken(newToken);
  }
  async function loadUserData() {
    try {
      setIsLoadingAsyncStorage(true);
      const userLogged = await storageUserGet();
      const token = await storageAuthTokenGet();

      if (userLogged && token) {
        setUser(userLogged);
        userAndTokenUpdate(userLogged, token);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingAsyncStorage(true);
    }
  }
  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager({
      signOut,
      refreshedTokenUpdated,
    });
    return () => {
      subscribe();
    };
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoadingAsyncStorage,
        signOut,
        signIn,
        refreshedToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
