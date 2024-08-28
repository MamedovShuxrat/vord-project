import { createSlice } from "@reduxjs/toolkit";
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
  tabContents: {} // Добавлено поле для хранения состояния вкладок
};

const chartsSlice = createSlice({
  name: "charts",
  initialState,
  reducers: {
    addFolder: (state, action) => {
      state.foldersTab.push(action.payload);
      saveStateToLocalStorage(state);
    },
    removeFolder: (state, action) => {
      state.foldersTab = state.foldersTab.filter(
        (folder) => folder.id !== action.payload
      );
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
        file.queryText = newText; // Обновление только текста файла
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
      const fileId = action.payload;
      state.openedFiles = state.openedFiles.filter(
        (file) => file.id !== fileId
      );
      saveStateToLocalStorage(state);
    },
    updateTabContent: (state, action) => {
      const { tabId, content } = action.payload;
      state.tabContents[tabId] = content;
      saveStateToLocalStorage(state);
    }
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
  updateTabContent
} = chartsSlice.actions;

export default chartsSlice.reducer;
