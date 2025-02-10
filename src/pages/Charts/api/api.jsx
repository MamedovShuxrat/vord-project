import axios from "axios";

// Устанавливаем URL API
const API = process.env.REACT_APP_API_URL || "http://varddev.tech:8000/api";
const access = JSON.parse(localStorage.getItem("userToken"));
const clientDbUrl = `${API}/clientdb/`;
const chartsUrl = `${API}/charts/`;
const clientDataUrl = `${API}/clientdata/`;

// Функция для получения списка графиков
export const getChartList = async () => {
  try {
    const res = await axios({
      url: `${chartsUrl}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token${access}`
      }
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching chart list:", error);
    throw error;
  }
};

// Функция для получения деталей конкретного графика
export const getChartDetails = async (chartId) => {
  try {
    const res = await axios({
      url: `${chartsUrl}${chartId}/`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token${access}`
      }
    });
    return res.data;
  } catch (error) {
    console.error(`Error fetching details for chart ${chartId}:`, error);
    throw error;
  }
};

// Функция для добавления нового графика
export const addNewChart = async (chartData) => {
  try {
    const res = await axios({
      url: `${chartsUrl}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token${access}`
      },
      data: chartData
    });
    return res.data;
  } catch (error) {
    console.error("Error adding new chart:", error);
    throw error;
  }
};

// Функция для обновления графика
export const updateChart = async (chartId, chartData) => {
  try {
    const res = await axios({
      url: `${chartsUrl}${chartId}/`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token${access}`
      },
      data: chartData
    });
    return res.data;
  } catch (error) {
    console.error(`Error updating chart ${chartId}:`, error);
    throw error;
  }
};

// Функция для удаления графика
export const deleteChart = async (chartId) => {
  try {
    const res = await axios({
      url: `${chartsUrl}${chartId}/`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token${access}`
      }
    });
    return res.data;
  } catch (error) {
    console.error(`Error deleting chart ${chartId}:`, error);
    throw error;
  }
};

// Функция для выполнения SQL-запроса и получения результатов
export const runQuery = async (token, requestData) => {
  try {
    const res = await axios.post(chartsUrl, requestData, {
      headers: {
        Authorization: `Token${token}`,
        "Content-Type": "application/json"
      }
    });
    return res.data;
  } catch (error) {
    console.error("Failed to execute query:", error);
    throw error;
  }
};

// Функция для получения результата из clientdata
export const fetchQueryResult = async (token, clientdataId) => {
  try {
    const res = await axios.get(`${clientDataUrl}${clientdataId}/`, {
      headers: {
        Authorization: `Token${token}`,
        "Content-Type": "application/json"
      }
    });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch query result:", error);
    throw new Error("Failed to fetch query result.");
  }
};

// Функция для обновления данных запроса на сервере
export const updateQueryData = async (token, chartId, requestData) => {
  try {
    const res = await axios.put(`${chartsUrl}${chartId}/`, requestData, {
      headers: {
        Authorization: `Token${token}`,
        "Content-Type": "application/json"
      }
    });
    return res.data;
  } catch (error) {
    console.error("Failed to update query data:", error);
    throw error;
  }
};

// Функция для получения баз данных пользователя
export const fetchUserDatabases = async (token) => {
  try {
    const res = await axios.get(clientDbUrl, {
      headers: {
        Authorization: `Token${token}`,
        "Content-Type": "application/json"
      }
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching user databases:", error);
    throw new Error("Failed to fetch user databases.");
  }
};

// Функция для выполнения запроса (примерная общая для выполнения SQL запросов)
export const executeQuery = async (clientdb_id, str_query, extension) => {
  try {
    const res = await axios({
      url: `${chartsUrl}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token${access}`
      },
      data: {
        clientdb_id,
        str_query,
        extension
      }
    });
    return res.data;
  } catch (error) {
    console.error("Failed to execute query:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    throw error;
  }
};
