import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Обновленный API URL для работы с визуализациями
const API_URL = process.env.REACT_APP_API_URL;
const VISUALIZATIONS_URL = `${API_URL}/visualizations/`;  // Текущий URL

// Получаем токен из localStorage
const access = JSON.parse(localStorage.getItem("userToken"));

// Асинхронное действие для создания визуализации
export const createVisualization = createAsyncThunk(
  "visualizations/createVisualization",
  async ({ chartId, visualizationData }, { rejectWithValue }) => {
    try {
      const lastChartId = parseInt(chartId, 10) - 1;
      const response = await axios.post(
        VISUALIZATIONS_URL,
        { ...visualizationData, chart: lastChartId },
        {
          headers: {
            Authorization: `Token${access}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create visualization.");
    }
  }
);

// Асинхронное действие для получения всех визуализаций для конкретного чарта
export const fetchVisualizationsByChart = createAsyncThunk(
  "visualizations/fetchVisualizationsByChart",
  async ({ chartId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${VISUALIZATIONS_URL}?chart=${chartId}`, {
        headers: {
          Authorization: `Token${access}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch visualizations.");
    }
  }
);

// Асинхронное действие для удаления визуализации
export const deleteVisualization = createAsyncThunk(
  "visualizations/deleteVisualization",
  async ({ visualizationId }, { rejectWithValue }) => {
    try {
      await axios.delete(`${VISUALIZATIONS_URL}${visualizationId}/`, {
        headers: {
          Authorization: `Token${access}`,
        },
      });
      return visualizationId;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete visualization.");
    }
  }
);

// Slice для управления визуализациями
const visualizationsSlice = createSlice({
  name: "visualizations",
  initialState: {
    visualizations: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Добавление новой визуализации в состояние
    addVisualization: (state, action) => {
      state.visualizations.push(action.payload);
    },
    // Обновление существующей визуализации
    updateVisualization: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.visualizations.find((vis) => vis.id === id);
      if (index !== -1) {
        state.visualizations[index] = {
          ...state.visualizations[index],
          ...updatedData,
        };
      }
    },
    // Удаление визуализации по её ID
    removeVisualization: (state, action) => {
      state.visualizations = state.visualizations.filter(
        (vis) => vis.id !== action.payload
      );
    },
    // Выбор визуализации для работы
    selectVisualization: (state, action) => {
      state.selectedVisualization = action.payload;
    },
    // Очистка выбранной визуализации
    clearSelectedVisualization: (state) => {
      state.selectedVisualization = null;
    },
    // Установка состояния загрузки
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    // Установка ошибки
    setError: (state, action) => {
      state.error = action.payload;
    },
    // Очистка ошибки
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Создание визуализации
      .addCase(createVisualization.pending, (state) => {
        state.loading = true;
      })
      .addCase(createVisualization.fulfilled, (state, action) => {
        state.loading = false;
        state.visualizations.push(action.payload); // Добавляем новую визуализацию в состояние
      })
      .addCase(createVisualization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Получение визуализаций для конкретного чарта
      .addCase(fetchVisualizationsByChart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVisualizationsByChart.fulfilled, (state, action) => {
        state.loading = false;
        state.visualizations = action.payload; // Обновляем состояние списка визуализаций
      })
      .addCase(fetchVisualizationsByChart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Удаление визуализации
      .addCase(deleteVisualization.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteVisualization.fulfilled, (state, action) => {
        state.loading = false;
        state.visualizations = state.visualizations.filter(
          (vis) => vis.id !== action.payload
        );
      })
      .addCase(deleteVisualization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addVisualization,
  updateVisualization,
  removeVisualization,
  selectVisualization,
  clearSelectedVisualization,
  setLoading,
  setError,
  clearError,
} = visualizationsSlice.actions;

export default visualizationsSlice.reducer;
