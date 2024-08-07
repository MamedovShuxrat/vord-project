import axios from "axios";
import { toast } from "react-hot-toast";

// eslint-disable-next-line no-undef
const API_URL = process.env.REACT_APP_API_URL || "http://vardserver:8000/api";

const authRegister = `${API_URL}/register/`;
const authLogin = `${API_URL}/login/`;
const getUserInfo = `${API_URL}/user/`;
const authLogout = `${API_URL}/logout/`;

export const registerUser = async (name, email, password, confirmPassword) => {
  try {
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

    const response = await toast.promise(
      axios.post(authLogin, { email, password }),
      {
        loading: "Logging in...",
        success: <b>Success login!</b>,
        error: <b>Login failed: invalid username or password</b>
      }
    );
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
    console.log("Logging out with token:", token);
    const response = await toast.promise(
      axios.post(authLogout, null, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-type": "application/json"
        }
      }),
      {
        loading: "Logging out...",
        success: <b>Logout successful!</b>,
        error: <b>Logout failed: an error occurred</b>
      })
    console.log("Logout response:", response.data)

    return response.data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw new Error("Failed to logout");
  }
};
