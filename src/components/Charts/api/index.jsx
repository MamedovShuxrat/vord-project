import axios from "axios";

// Устанавливаем URL API
const API = process.env.REACT_APP_API_URL;
const access = JSON.parse(localStorage.getItem("userToken"));

// Функция для получения списка графиков
export const getChartList = async () => {
  try {
    const res = await axios({
      url: `${API}/charts/`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${access}`
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
      url: `${API}/charts/${chartId}/`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${access}`
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
      url: `${API}/charts/`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${access}`
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
      url: `${API}/charts/${chartId}/`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${access}`
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
      url: `${API}/charts/${chartId}/`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${access}`
      }
    });
    return res.data;
  } catch (error) {
    console.error(`Error deleting chart ${chartId}:`, error);
    throw error;
  }
};
