import { useCallback, useEffect, useState } from "react";
import { httpClient } from "../../utils/httpClient";
import { USER_SESSION_TOKEN_KEY, UserSessionContext } from "./userContext";

const clearLegacyTokenStorage = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(USER_SESSION_TOKEN_KEY);
};

const getSessionUser = (data) => {
  const payload = data?.data ?? data;

  return payload?.user ?? payload?.usuario ?? payload?.data?.user ?? null;
};

export const UserSessionProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const applySession = useCallback((nextUser) => {
    setUser(nextUser);
  }, []);

  const clearSession = useCallback(() => {
    clearLegacyTokenStorage();
    applySession(null);
  }, [applySession]);

  const validateSession = useCallback(async () => {
    try {
      const { data } = await httpClient.get("/users/me");
      const nextUser = getSessionUser(data);

      applySession(nextUser);
      return nextUser;
    } catch (error) {
      clearSession();
      throw error;
    }
  }, [applySession, clearSession]);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        await validateSession();
      } catch {
        // Invalid or expired session; local state is cleared in validateSession.
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [clearSession, validateSession]);

  const login = useCallback(
    async (credentials) => {
      const { data } = await httpClient.post("/users/login", credentials);
      const nextUser = getSessionUser(data);

      if (!nextUser) {
        throw new Error("La respuesta del servidor no contiene una sesión válida.");
      }

      clearLegacyTokenStorage();
      applySession(nextUser);
      return nextUser;
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    try {
      await httpClient.post("/users/logout");
    } catch {
      // Local cleanup should still happen even if the API logout fails.
    } finally {
      clearSession();
    }
  }, [clearSession]);

  return (
    <UserSessionContext
      value={{
        user,
        token: null,
        loading,
        isAuthenticated: Boolean(user),
        login,
        logout,
      }}
    >
      {children}
    </UserSessionContext>
  );
};


