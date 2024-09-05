import axios from "axios";

const API_URL = "http://varddev.tech:8000/api";
const clientDbUrl = `${API_URL}/clientdb/`;
const chartsUrl = `${API_URL}/charts/`;
const clientDataUrl = `${API_URL}/clientdata/`;

// Получение баз данных пользователя
export const fetchUserDatabases = async (token) => {
  try {
    const response = await axios.get(clientDbUrl, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user databases:", error);
    throw new Error("Failed to fetch user databases.");
  }
};

// Выполнение SQL-запроса и получение результатов
export const runQuery = async (token, requestData) => {
  try {
    const response = await axios.post(chartsUrl, requestData, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to execute query:", error);
    throw error; // Пробрасываем ошибку дальше для обработки в компоненте
  }
};

// Функция для получения результата из clientdata
export const fetchQueryResult = async (token, clientdataId) => {
  try {
    const response = await axios.get(`${clientDataUrl}${clientdataId}/`, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch query result:", error);
    throw new Error("Failed to fetch query result.");
  }
};

// Функция для обновления данных запроса на сервере
export const updateQueryData = async (token, chartId, requestData) => {
  try {
    const response = await axios.put(`${chartsUrl}${chartId}/`, requestData, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update query data:", error);
    throw error;
  }
};
