import axios from "axios";
import toast from "react-hot-toast";
const API_URL = process.env.REACT_APP_API_URL;

console.log("API_URL:", API_URL);

const authRegister = `${API_URL}/auth/register/`;
const authLogin = `${API_URL}/auth/login/`;
const getUserInfoUrl = `${API_URL}/auth/user/`;
const authLogout = `${API_URL}/auth/logout/`;


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
    toast.error("Registration failed:", error);
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
    console.log("Login response data:", response.data);

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      console.error("Login failed:", error);
    }
  }
};

export const logoutUserDb = async (token) => {
  try {
    const response = await toast.promise(
      axios.post(authLogout, {}, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-type": "application/json"
        }
      }),
      {
        loading: "Logging out...",
        success: <b>Logout successful</b>,
        error: "Logout failed"
      }
    );
    return response.data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw new Error("Failed to logout");
  }
};

export const fetchUserInfo = async (token) => {
  try {
    const response = await axios.get(getUserInfoUrl, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-type": "application/json"
      }
    });
    console.log(response.data.email, "эти данные должны в хедере отабражаться");
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Failed to fetch user data");
  }
};