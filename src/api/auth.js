import axios from "axios";
import { toast } from "react-hot-toast";

// eslint-disable-next-line no-undef
const API_URL = process.env.REACT_APP_API_URL || "http://vardserver:8000/api";

const authRegister = `${API_URL}/auth/register/`;
const authLogin = `${API_URL}/auth/login/`;
const getUserInfo = `${API_URL}/auth/user/`;
const authLogout = `${API_URL}/auth/logout/`;

export const registerUser = async (name, email, password, confirmPassword) => {
  try {
    const response = await axios.post(authRegister, {
      username: name,
      email: email,
      password1: password,
      password2: confirmPassword
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    }
    throw new Error("An unexpected error occurred.");
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(authLogin, { email, password });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    }
    throw new Error("An unexpected error occurred.");
  }
};

export const fetchUserData = async (token) => {
  try {
    const response = await axios.get(getUserInfo, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Failed to fetch user data");
  }
};

export const logoutUser = async (token) => {
  try {
    const response = await axios.post(authLogout, null, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-type": "application/json"
      }
    });
    toast.success("Logout successful");

    return response.data;
  } catch (error) {
    toast.error("Logout failed")
    console.error("Logout failed:", error);
    throw new Error("Failed to logout");
  }
};
