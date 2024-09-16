// src/core/store/foldersSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";
import { fetchFolders } from "../../pages/Files/api/index";
import { createFolderTree } from "../helpers/createFoldersTree";
import folderIcon from "../../assets/images/icons/common/folder.svg";

// Асинхронный экшен для загрузки папок
export const loadFoldersFromAPI = createAsyncThunk(
  "folders/loadFolders",
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetchFolders(token);
      return createFolderTree(response);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

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
            return {
              ...f,
              subfolders: [...f.subfolders, folder]
            };
          }
          if (f.subfolders.length > 0) {
            return {
              ...f,
              subfolders: findAndAddFolder(f.subfolders)
            };
          }
          return f;
        });
      };

      if (parentId === null) {
        state.folders.push(folder);
      } else {
        state.folders = findAndAddFolder(state.folders);
      }

      saveStateToLocalStorage(state);
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

      saveStateToLocalStorage(state);
    },

    updateFolderName: (state, action) => {
      const { folderId, newName } = action.payload;

      const findAndUpdateFolder = (folders) => {
        return folders.map((folder) => {
          if (folder.id === folderId) {
            return { ...folder, name: newName };
          }
          if (folder.subfolders.length > 0) {
            folder.subfolders = findAndUpdateFolder(folder.subfolders);
          }
          return folder;
        });
      };

      state.folders = findAndUpdateFolder(state.folders);
      saveStateToLocalStorage(state);
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

      localStorage.removeItem("foldersState");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFoldersFromAPI.fulfilled, (state, action) => {
        state.folders = action.payload;
        saveStateToLocalStorage(state);
      })
      .addCase(loadFoldersFromAPI.rejected, (state, action) => {
        console.error("Ошибка загрузки папок:", action.payload);
      });
  }
});

export const { addFolder, removeFolder, updateFolderName, resetFolders } =
  foldersSlice.actions;

export default foldersSlice.reducer;
