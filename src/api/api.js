import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://vardserver:8000/api";

// Auth Endpoints
export const registerUser = async (name, email, password, confirmPassword) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register/`, {
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
    const response = await axios.post(`${API_URL}/auth/login/`, {
      email,
      password
    });
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
    const response = await axios.get(`${API_URL}/auth/user/`, {
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
    const response = await axios.post(`${API_URL}/auth/logout/`, null, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw new Error("Failed to logout");
  }
};

// ClientDB Endpoints
export const connectClientDB = async (formData) => {
  try {
    const response = await axios.post("`${API_URL}/api/clientdb/", formData, {
      headers: {
        "Content-type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("Connection to client DB failed:", error);
    throw new Error("Failed to connect to client DB");
  }
};

// Test Results Endpoints
export const getUserTestStats = async (testID, ids, access) => {
  try {
    const res = await axios({
      url: `${API_URL}/tests/${testID}/stats`,
      method: "GET",
      headers: {
        "Access-Control-Allow-Headers": "*",
        Authorization: `Bearer ${access}`
      }
    });
    return res.data;
  } catch (error) {
    console.error("Failed to get user test stats:", error);
    throw new Error("Failed to get user test stats");
  }
};

export const getTestResults = async (id, offset, limit, access) => {
  try {
    const res = await axios({
      url: `${API_URL}/tests-complete/?test=${id}&offset=${offset}&limit=${limit}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
        Authorization: `Bearer ${access}`
      },
      data: {
        id: id
      }
    });
    return res.data;
  } catch (error) {
    console.error("Failed to get test results:", error);
    throw new Error("Failed to get test results");
  }
};

export const getFilteredTextAnswers = async (
  question_id,
  offset,
  limit,
  category,
  ids,
  access
) => {
  try {
    const res = await axios({
      url: `${API_URL}/filtered-text-answers/`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
        Authorization: `Bearer ${access}`
      },
      data: {
        question_id: question_id,
        offset: offset,
        limit: limit,
        category: category,
        ids: ids
      }
    });
    return res.data;
  } catch (error) {
    console.error("Failed to get filtered text answers:", error);
    throw new Error("Failed to get filtered text answers");
  }
};
