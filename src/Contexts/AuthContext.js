import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const authLogin = "${API_URL}/auth/login/";
const getUserInfo = "${API_URL}/auth/user/";
const authLogout = "${API_URL}/auth/logout/";
const authRegister = "${API_URL}/auth/register/";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("");
  console.log(user, "reg");
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const register = async (name, email, password, confirmPassword) => {
    try {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
      const response = await toast.promise(
        axios.post(authRegister, {
          username: name,
          email: email,
          password1: password,
          password2: confirmPassword
        }),
        {
          loading: "Registering...",
          success: <b>Registration successful</b>,
          error: "Registration failed"
        }
      );
      const { data } = response;
      const [token, userData] = data;
      localStorage.setItem("userToken", JSON.stringify(token));
      localStorage.setItem("userData", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      toast.error("Registration failed:", error);
      throw new Error("Failed to register");
    }
  };

  const login = async (email, password) => {
    try {
      const response = await toast.promise(
        axios.post(authLogin, { email, password }),
        {
          loading: "Logging in...",
          success: <b>Success login!</b>,
          error: <b>Login failed: invalid username or password</b>
        }
      );
      getUserData(response.data.key);
      localStorage.setItem("userToken", JSON.stringify(response.data.key));
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const getUserData = async (token) => {
    try {
      const response = await axios.get(getUserInfo, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-type": "application/json"
        }
      });
      localStorage.setItem("userData", JSON.stringify(response.data));
      return setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw new Error("Failed to fetch user data");
    }
  };

  const logout = async (token) => {
    try {
      const response = await axios.post(authLogout, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-type": "application/json"
        }
      });
      toast.success("Logout successful", response.data);
      setUser(null);
      localStorage.removeItem("userData");
      localStorage.removeItem("userToken");

      return response.data;
    } catch (error) {
      console.error("Logout failed:", error);
      throw new Error("Failed to logout");
    }
  };

  const contextValue = {
    user,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
