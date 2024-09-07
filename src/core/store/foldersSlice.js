// src/core/store/foldersSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";
import folderIcon from "../../assets/images/icons/common/folder.svg";
import fileIcon from "../../assets/images/icons/common/file.svg";

// Функция для загрузки состояния из localStorage
const loadStateFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem("foldersState");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.error("Не удалось загрузить состояние из localStorage", e);
    return undefined;
  }
};

// Функция для сохранения состояния в localStorage
const saveStateToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("foldersState", serializedState);
  } catch (e) {
    console.error("Не удалось сохранить состояние в localStorage", e);
  }
};

// Инициализация начального состояния из localStorage или дефолтное значение
const initialState = loadStateFromLocalStorage() || {
  folders: [],
  openTabs: [],
  activeTab: null
};

const foldersSlice = createSlice({
  name: "folders",
  initialState,
  reducers: {
    addFolder: (state, action) => {
      const { parentId, folder } = action.payload;

      const findAndAddFolder = (folders) => {
        return folders.map((f) => {
          if (f.id === parentId) {
            f.subfolders.push(folder);
          } else if (f.subfolders.length > 0) {
            f.subfolders = findAndAddFolder(f.subfolders);
          }
          return f;
        });
      };

      if (parentId === null) {
        state.folders.push(folder);
      } else {
        state.folders = findAndAddFolder(state.folders);
      }

      saveStateToLocalStorage(state); // Сохранение состояния в localStorage
    },

    addFile: (state, action) => {
      const { parentId, file } = action.payload;

      const findAndAddFile = (folders) => {
        return folders.map((f) => {
          if (f.id === parentId) {
            f.files.push(file);
          } else if (f.subfolders.length > 0) {
            f.subfolders = findAndAddFile(f.subfolders);
          }
          return f;
        });
      };

      state.folders = findAndAddFile(state.folders);

      saveStateToLocalStorage(state); // Сохранение состояния в localStorage
    },

    toggleFolderOpen: (state, action) => {
      const { folderId } = action.payload;

      const findAndToggleFolder = (folders) => {
        return folders.map((f) => {
          if (f.id === folderId) {
            f.isOpen = !f.isOpen;
          } else if (f.subfolders.length > 0) {
            f.subfolders = findAndToggleFolder(f.subfolders);
          }
          return f;
        });
      };

      state.folders = findAndToggleFolder(state.folders);

      saveStateToLocalStorage(state); // Сохранение состояния в localStorage
    },

    removeFolder: (state, action) => {
      const { folderId } = action.payload;

      const findAndRemoveFolder = (folders) => {
        return folders
          .filter((f) => f.id !== folderId)
          .map((f) => {
            if (f.subfolders.length > 0) {
              f.subfolders = findAndRemoveFolder(f.subfolders);
            }
            return f;
          });
      };

      state.folders = findAndRemoveFolder(state.folders);

      saveStateToLocalStorage(state); // Сохранение состояния в localStorage
    },

    removeFile: (state, action) => {
      const { fileId } = action.payload;

      const findAndRemoveFile = (folders) => {
        return folders.map((f) => {
          f.files = f.files.filter((file) => file.id !== fileId);
          if (f.subfolders.length > 0) {
            f.subfolders = findAndRemoveFile(f.subfolders);
          }
          return f;
        });
      };

      state.folders = findAndRemoveFile(state.folders);

      saveStateToLocalStorage(state); // Сохранение состояния в localStorage
    },

    updateFileName: (state, action) => {
      const { fileId, newName } = action.payload;

      const findAndUpdateFile = (folders) => {
        return folders.map((f) => {
          f.files = f.files.map((file) =>
            file.id === fileId ? { ...file, name: newName } : file
          );
          if (f.subfolders.length > 0) {
            f.subfolders = findAndUpdateFile(f.subfolders);
          }
          return f;
        });
      };

      state.folders = findAndUpdateFile(state.folders);

      saveStateToLocalStorage(state); // Сохранение состояния в localStorage
    },

    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
      saveStateToLocalStorage(state); // Сохранение состояния в localStorage
    },

    openTab: (state, action) => {
      const { id, name, type } = action.payload;
      if (!state.openTabs.some((tab) => tab.id === id)) {
        state.openTabs.push({ id, name, type });
      }
      state.activeTab = id;

      saveStateToLocalStorage(state); // Сохранение состояния в localStorage
    },

    closeTab: (state, action) => {
      const tabId = action.payload;
      state.openTabs = state.openTabs.filter((tab) => tab.id !== tabId);
      if (state.activeTab === tabId) {
        state.activeTab = null;
      }

      saveStateToLocalStorage(state); // Сохранение состояния в localStorage
    },

    closeAllTabs: (state) => {
      state.openTabs = [];
      state.activeTab = null;
      saveStateToLocalStorage(state); // Сохранение состояния в localStorage
    },

    resetFolders: (state) => {
      state.folders = [
        {
          id: uuid(),
          name: "Untitled",
          icon: folderIcon,
          isOpen: false,
          subfolders: [],
          files: []
        }
      ];
      state.openTabs = [];
      state.activeTab = null;

      // Очистка состояния из localStorage
      localStorage.removeItem("foldersState");
    }
  }
});

export const {
  addFolder,
  addFile,
  toggleFolderOpen,
  removeFolder,
  removeFile,
  updateFileName,
  setActiveTab,
  openTab,
  closeTab,
  closeAllTabs,
  resetFolders
} = foldersSlice.actions;

export default foldersSlice.reducer;
