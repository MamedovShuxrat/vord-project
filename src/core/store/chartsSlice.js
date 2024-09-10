import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchUserDatabases,
  runQuery,
  fetchQueryResult
} from "../../pages/Charts/api/index";
import { v4 as uuid } from "uuid";

// Функции для работы с localStorage
const loadStateFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem("chartsState");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.error("Не удалось загрузить состояние из localStorage", e);
    return undefined;
  }
};

const saveStateToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("chartsState", serializedState);
  } catch (e) {
    console.error("Не удалось сохранить состояние в localStorage", e);
  }
};

// Инициализация начального состояния
const initialState = loadStateFromLocalStorage() || {
  foldersTab: [],
  activeTab: null,
  openedFiles: [],
  tabContents: {},
  databases: [],
  queryResult: "",
  visualizations: [],
  loading: false,
  error: null
};

// Асинхронное действие для получения баз данных пользователя
export const loadUserDatabases = createAsyncThunk(
  "charts/loadUserDatabases",
  async (token, { rejectWithValue }) => {
    try {
      const databases = await fetchUserDatabases(token);
      return databases;
    } catch (error) {
      return rejectWithValue("Failed to load databases");
    }
  }
);

// Асинхронное действие для выполнения SQL-запроса
export const executeQuery = createAsyncThunk(
  "charts/executeQuery",
  async ({ token, requestData }, { rejectWithValue, dispatch }) => {
    try {
      const result = await runQuery(token, requestData);
      if (result.clientdata) {
        // Если клиентские данные получены, выполнить дополнительный запрос, чтобы получить результат
        const clientDataResult = await fetchQueryResult(
          token,
          result.clientdata
        );
        return clientDataResult;
      } else {
        return rejectWithValue("Clientdata not found in response");
      }
    } catch (error) {
      return rejectWithValue("Failed to execute query");
    }
  }
);

const chartsSlice = createSlice({
  name: "charts",
  initialState,
  reducers: {
    addFolder: (state, action) => {
      state.foldersTab.push(action.payload);
      saveStateToLocalStorage(state);
    },
    removeFolder: (state, action) => {
      const folderId = action.payload;

      // Удаляем папку
      state.foldersTab = state.foldersTab.filter(
        (folder) => folder.id !== folderId
      );

      // Удаляем файлы, связанные с удаленной папкой
      state.openedFiles = state.openedFiles.filter(
        (file) =>
          !state.foldersTab.some((folder) =>
            folder.subfolder.some((subFile) => subFile.id === file.id)
          )
      );

      // Удаляем контент вкладок, связанных с удаленной папкой
      Object.keys(state.tabContents).forEach((key) => {
        if (state.tabContents[key].folderId === folderId) {
          delete state.tabContents[key];
        }
      });

      saveStateToLocalStorage(state);
    },
    updateFolder: (state, action) => {
      const { id, newName } = action.payload;
      const folder = state.foldersTab.find((folder) => folder.id === id);
      if (folder) {
        folder.name = newName;
        saveStateToLocalStorage(state);
      }
    },
    toggleFolderOpen: (state, action) => {
      const folder = state.foldersTab.find(
        (folder) => folder.id === action.payload
      );
      if (folder) {
        folder.isOpen = !folder.isOpen;
        saveStateToLocalStorage(state);
      }
    },
    addFileToFolder: (state, action) => {
      const { folderId, file } = action.payload;
      const folder = state.foldersTab.find((folder) => folder.id === folderId);
      if (folder) {
        folder.subfolder.push(file);
        saveStateToLocalStorage(state);
      }
    },
    removeFileFromFolder: (state, action) => {
      const { folderId, fileId } = action.payload;
      const folder = state.foldersTab.find((folder) => folder.id === folderId);
      if (folder) {
        folder.subfolder = folder.subfolder.filter(
          (file) => file.id !== fileId
        );
        saveStateToLocalStorage(state);
      }
      state.openedFiles = state.openedFiles.filter(
        (file) => file.id !== fileId
      );
    },
    renameFileInFolder: (state, action) => {
      const { folderId, fileId, newName } = action.payload;
      const folder = state.foldersTab.find((folder) => folder.id === folderId);
      if (folder) {
        const file = folder.subfolder.find((file) => file.id === fileId);
        if (file) {
          file.name = newName;
          saveStateToLocalStorage(state);
        }
      }
    },
    updateFileText: (state, action) => {
      const { fileId, newText } = action.payload;
      const file = state.foldersTab
        .flatMap((folder) => folder.subfolder)
        .find((file) => file.id === fileId);
      if (file) {
        file.queryText = newText;
        saveStateToLocalStorage(state);
      }
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
      saveStateToLocalStorage(state);
    },
    openFile: (state, action) => {
      const file = action.payload;
      if (!state.openedFiles.some((f) => f.id === file.id)) {
        state.openedFiles.push(file);
        saveStateToLocalStorage(state);
      }
    },
    closeFile: (state, action) => {
      state.openedFiles = state.openedFiles.filter(
        (file) => file.id !== action.payload
      );
      saveStateToLocalStorage(state);
    },
    updateTabContent: (state, action) => {
      const { tabId, content } = action.payload;
      if (!state.tabContents) {
        state.tabContents = {};
      }
      if (!state.tabContents[tabId]) {
        state.tabContents[tabId] = "";
      }
      state.tabContents[tabId] = content;
      saveStateToLocalStorage(state);
    },
    addVisualization: (state, action) => {
      const { chartId, visualization } = action.payload;
      // Добавляем новую визуализацию к соответствующему чарту
      state.visualizations.push({
        chartId,
        ...visualization
      });
      saveStateToLocalStorage(state);
    },
    removeVisualization: (state, action) => {
      const { visualizationId } = action.payload;
      // Удаляем визуализацию по её ID
      state.visualizations = state.visualizations.filter(
        (vis) => vis.id !== visualizationId
      );
      saveStateToLocalStorage(state);
    },
    updateFileWithChartId: (state, action) => {
      const { fileId, chartId } = action.payload;
      const file = state.openedFiles.find((file) => file.id === fileId);
      if (file) {
        file.chartId = chartId;
      }
    }
  },
  updateChartId: (state, action) => {
    const { tempChartId, realChartId } = action.payload;
    state.foldersTab = state.foldersTab.map((folder) =>
      folder.subfolder.map((file) =>
        file.tempChartId === tempChartId ? { ...file, chartId: realChartId } : file
      )
    );
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserDatabases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUserDatabases.fulfilled, (state, action) => {
        state.loading = false;
        state.databases = action.payload;
      })
      .addCase(loadUserDatabases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(executeQuery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(executeQuery.fulfilled, (state, action) => {
        state.loading = false;
        state.queryResult = action.payload.result;
      })
      .addCase(executeQuery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  addFolder,
  removeFolder,
  updateFolder,
  toggleFolderOpen,
  addFileToFolder,
  removeFileFromFolder,
  renameFileInFolder,
  updateFileText,
  setActiveTab,
  openFile,
  closeFile,
  updateTabContent,
  addVisualization,
  removeVisualization,
  updateFileWithChartId,
  updateChartId
} = chartsSlice.actions;

export default chartsSlice.reducer;
