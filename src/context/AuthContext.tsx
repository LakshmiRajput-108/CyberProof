
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useRef,
} from 'react';

import { API_BASE_URL } from '../config/api';
import { MEMBER_SESSION_EXPIRED_EVENT } from '../services/apiClient';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  tier: string;
}

export interface GuestSession {
  sessionId: string;
  name: string | null;
  type: 'GUEST';
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  guest: GuestSession | null;
  guestLoading: boolean;
  loading: boolean;
  sessionExpired: boolean;
  dismissSessionExpired: () => void;
  sessionVerificationError: string | null;
  retrySessionVerification: () => void;
  isAuthenticated: boolean;
  ensureGuestSession: (name?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
}

interface AuthResponse {
  token: string;
  user: AuthUser;
}

interface GuestResponse {
  token: string;
  guest: GuestSession;
  error?: string;
}

interface GuestSessionResponse {
  guest: GuestSession;
  error?: string;
}

const TOKEN_KEY = 'cyberproof_auth_token';
const GUEST_TOKEN_KEY = 'cyberproof_guest_token';
const GUEST_DATA_KEY = 'cyberproof_guest_data';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [guest, setGuest] = useState<GuestSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestLoading, setGuestLoading] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [sessionVerificationError, setSessionVerificationError] = useState<string | null>(null);
  const [sessionVerificationAttempt, setSessionVerificationAttempt] = useState(0);
  const guestInitializationRef = useRef<Promise<void> | null>(null);

  const ensureGuestSession = useCallback((name?: string): Promise<void> => {
    if (localStorage.getItem(TOKEN_KEY)) return Promise.resolve();
    if (guestInitializationRef.current) return guestInitializationRef.current;

    const initialize = async (): Promise<void> => {
      setGuestLoading(true);

      try {
        const savedGuestToken = localStorage.getItem(GUEST_TOKEN_KEY);
        const savedGuestData = localStorage.getItem(GUEST_DATA_KEY);

        if (savedGuestToken) {
          if (savedGuestData) {
            try {
              setGuest(JSON.parse(savedGuestData) as GuestSession);
            } catch {
              // The server can restore session metadata from the signed token.
            }
          }

          const response = await fetch(`${API_BASE_URL}/api/guest/session`, {
            headers: {
              'X-Guest-Session': savedGuestToken,
            },
          });

          if (response.ok) {
            const data = await response.json() as GuestSessionResponse;
            if (!data.guest) {
              throw new Error('The saved guest session response was invalid.');
            }

            localStorage.setItem(GUEST_DATA_KEY, JSON.stringify(data.guest));
            setGuest(data.guest);
            return;
          }

          if (response.status !== 401) {
            throw new Error('Could not verify the saved guest session. Please retry when connected.');
          }

          localStorage.removeItem(GUEST_TOKEN_KEY);
          localStorage.removeItem(GUEST_DATA_KEY);
          setGuest(null);
        } else {
          localStorage.removeItem(GUEST_DATA_KEY);
        }

        const response = await fetch(`${API_BASE_URL}/api/guest/session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(name ? { name } : {}),
        });

        const data = await response.json() as GuestResponse;

        if (!response.ok || !data.token || !data.guest) {
          throw new Error(data.error || 'Could not create guest session.');
        }

        localStorage.setItem(GUEST_TOKEN_KEY, data.token);
        localStorage.setItem(GUEST_DATA_KEY, JSON.stringify(data.guest));
        setGuest(data.guest);
      } finally {
        setGuestLoading(false);
      }
    };

    let request: Promise<void>;
    request = initialize().finally(() => {
      if (guestInitializationRef.current === request) {
        guestInitializationRef.current = null;
      }
    });
    guestInitializationRef.current = request;
    return request;
  }, []);

  const handleMemberSessionExpired = useCallback((expiredToken: string) => {
    if (localStorage.getItem(TOKEN_KEY) !== expiredToken) return;

    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setSessionVerificationError(null);
    setSessionExpired(true);
  }, []);

  useEffect(() => {
    const handleExpiredEvent = (event: Event) => {
      const expiredToken = (event as CustomEvent<unknown>).detail;
      if (typeof expiredToken === 'string') {
        handleMemberSessionExpired(expiredToken);
      }
    };

    window.addEventListener(MEMBER_SESSION_EXPIRED_EVENT, handleExpiredEvent);
    return () => window.removeEventListener(MEMBER_SESSION_EXPIRED_EVENT, handleExpiredEvent);
  }, [handleMemberSessionExpired]);

  useEffect(() => {
    let cancelled = false;

    const verifySession = async () => {
      const savedToken = localStorage.getItem(TOKEN_KEY);

      if (!savedToken) {
        if (!cancelled) setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            if (!cancelled) handleMemberSessionExpired(savedToken);
          } else if (!cancelled) {
            setSessionVerificationError(
              'Could not verify your saved account session. Check your connection and retry.'
            );
          }
          return;
        }

        const data = await response.json();

        if (!cancelled) {
          setToken(savedToken);
          setUser(data.user);
          setSessionExpired(false);
          setSessionVerificationError(null);
        }
      } catch {
        if (!cancelled) {
          setSessionVerificationError(
            'Could not verify your saved account session. Check your connection and retry.'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void verifySession();

    return () => {
      cancelled = true;
    };
  }, [handleMemberSessionExpired, sessionVerificationAttempt]);

  const retrySessionVerification = useCallback((): void => {
    setSessionVerificationError(null);
    setLoading(true);
    setSessionVerificationAttempt(attempt => attempt + 1);
  }, []);

  const authenticate = async (
    endpoint: 'login' | 'register',
    payload: Record<string, string>
  ): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Authentication failed');
    }

    const authData = data as AuthResponse;

    if (!authData.token || !authData.user) {
      throw new Error('Invalid authentication response');
    }

    localStorage.setItem(TOKEN_KEY, authData.token);

    setGuest(null);
    setToken(authData.token);
    setUser(authData.user);
    setSessionExpired(false);
    setSessionVerificationError(null);
  };

  const login = async (email: string, password: string): Promise<void> => {
    await authenticate('login', { email, password });
  };

  const register = async (
    email: string,
    password: string,
    name?: string
  ): Promise<void> => {
    await authenticate('register', {
      email,
      password,
      ...(name ? { name } : {}),
    });
  };

  const logout = (): void => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setGuest(null);
    setSessionExpired(false);
    setSessionVerificationError(null);

    void ensureGuestSession().catch((error) => {
      console.error('Guest session creation failed:', error);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        guest,
        guestLoading,
        loading,
        sessionExpired,
        dismissSessionExpired: () => setSessionExpired(false),
        sessionVerificationError,
        retrySessionVerification,
        isAuthenticated: !!user && !!token,
        ensureGuestSession,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};
