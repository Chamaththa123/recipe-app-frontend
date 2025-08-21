"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import axiosClient from "@/api/axiosClient";
import { toast } from "react-toastify"; // <-- import toast
import "react-toastify/dist/ReactToastify.css";

interface User {
  _id: string;
  full_name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user and token from cookies
    const storedUser = Cookies.get("_user");
    const storedToken = Cookies.get("_auth");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await axiosClient("users/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const userData: User = res.user;
      const authToken: string = res.token;

      setUser(userData);
      setToken(authToken);

      Cookies.set("_user", JSON.stringify(userData), { expires: 7 });
      Cookies.set("_auth", authToken, { expires: 7 });

      if (typeof window !== "undefined") {
        window.location.href = "/recipe/dashboard";
      }
    } catch (err: unknown) {
      if (err && typeof err === "object" && "data" in err) {
        const error = err as { data?: { error?: string } };
        toast.error(error.data?.error);
      } else {
        toast.error("Login failed");
      }
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    Cookies.remove("_user");
    Cookies.remove("_auth");
    if (typeof window !== "undefined") {
      window.location.href = "/auth";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user && !!token,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
