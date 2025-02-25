import axios from "axios";
import { toast } from "react-hot-toast";

// Устанавливаем URL API
const API_URL = process.env.REACT_APP_API_URL;
console.log(API_URL);

// Определяем эндпоинты для авторизации
const authRegister = `${API_URL}/register/`;
const authLogin = `${API_URL}/login/`;
const getUserInfo = `${API_URL}/user/`;
const authLogout = `${API_URL}/logout/`;
const clientDbUrl = `${API_URL}/clientdb/`;

// Регистрация пользователя
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
        success: "Registration successful",
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

// Вход пользователя
export const loginUser = async (email, password) => {
  try {
    const response = await toast.promise(
      axios.post(authLogin, { email, password }),
      {
        loading: "Logging in...",
        success: "Success login!",
        error: "Login failed: invalid username or password"
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    }
    throw new Error("An unexpected error occurred.");
  }
};

// Получение данных пользователя
export const fetchUserData = async (token) => {
  try {
    const response = await axios.get(getUserInfo, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-type": "application/json"
      }
    });
    localStorage.setItem("userData", JSON.stringify(response.data));
    return response.data;

  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Failed to fetch user data");
  }
};

// Получение баз данных пользователя
export const fetchUserConnections = async (token) => {
  try {
    const response = await axios.get(clientDbUrl, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user databases:", error);
    throw new Error("Failed to fetch user databases");
  }
};

// Выход пользователя
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
        success: "Logout successful!",
        error: "Logout failed: an error occurred"
      }
    );
    console.log("Logout response:", response.data);

    return response.data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw new Error("Failed to logout");
  }
};

// Подключение к базе данных клиента
export const connectClientDB = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/clientdb/`, formData, {
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

// Функция для удаления базы данных пользователя
export const deleteUserConnection = async (id, token) => {
  try {
    const response = await toast.promise(
      axios.delete(`${clientDbUrl}${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json"
        }
      }),
      {
        loading: "Deleting connection...",
        success: "Connection deleted successfully!",
        error: "Error deleting connection. Please try again."
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting user connection:", error);
    throw new Error("Failed to delete user connection.");
  }
};

// Получение статистики по тестам пользователя
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

// Получение результатов тестов
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

// Получение отфильтрованных текстовых ответов
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
        Authorization: `Bearer${access}`
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
