import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Обновленный API URL для работы с дэшбордами
const API_URL = process.env.REACT_APP_API_URL;
const DASHBOARDS_URL = `${API_URL}/dashboards/`;  // Текущий URL

// Получаем токен из localStorage
const access = JSON.parse(localStorage.getItem("userToken"));

export const fetchDashboardVisualizations = createAsyncThunk(
  "dashboard/fetchDashboardVisualizations",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Sending request with token:", access);  // Проверка перед отправкой
      const response = await axios.get(`${DASHBOARDS_URL}`, {
        headers: {
          Authorization: `Token${access}`,
        },
      });
      console.log("API Data:", response.data);  // Лог ответа от API
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);  // Лог ошибки
      return rejectWithValue(error.message || "Failed to fetch dashboard visualizations.");
    }
  }
);


const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    visualizations: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setVisualizations: (state, action) => {
      state.visualizations = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardVisualizations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardVisualizations.fulfilled, (state, action) => {
        state.loading = false;
        console.log("API Response Payload in fulfilled:", action.payload);
        if (Array.isArray(action.payload)) {
          console.log("Payload is an array. Updating visualizations.");
          state.visualizations = action.payload.slice();  // Используем slice() для создания нового массива
        } else {
          console.error("Unexpected payload format, clearing visualizations:", action.payload);
          state.visualizations = [];
        }
      })
      .addCase(fetchDashboardVisualizations.rejected, (state, action) => {
        state.loading = false;
        console.error("Fetching dashboard visualizations failed:", action.error);
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearError, setVisualizations } = dashboardSlice.actions;

export default dashboardSlice.reducer;
