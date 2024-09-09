// src/core/store/foldersSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";
import { fetchFolders } from "../../pages/Files/api/index";
import { createFolderTree } from "../helpers/createFoldersTree";
import folderIcon from "../../assets/images/icons/common/folder.svg";
import fileIcon from "../../assets/images/icons/common/file.svg";

// Асинхронный экшен для загрузки папок
export const loadFoldersFromAPI = createAsyncThunk(
  "folders/loadFolders",
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetchFolders(token);
      return createFolderTree(response); // Преобразуем плоский список в дерево
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
            f.subfolders.push(folder); // Добавляем папку к подкаталогам
          } else if (f.subfolders.length > 0) {
            f.subfolders = findAndAddFolder(f.subfolders); // Рекурсивно ищем родителя
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

    // addFile: (state, action) => {
    //   const { parentId, file } = action.payload;

    //   const findAndAddFile = (folders) => {
    //     return folders.map((f) => {
    //       if (f.id === parentId) {
    //         f.files.push(file);
    //       } else if (f.subfolders.length > 0) {
    //         f.subfolders = findAndAddFile(f.subfolders);
    //       }
    //       return f;
    //     });
    //   };

    //   state.folders = findAndAddFile(state.folders);

    //   saveStateToLocalStorage(state);
    // },

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

      saveStateToLocalStorage(state);
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

      saveStateToLocalStorage(state);
    },

    updateFolderName: (state, action) => {
      const { folderId, newName } = action.payload;

      const findAndUpdateFolder = (folders) => {
        return folders.map((f) => {
          if (f.id === folderId) {
            f.name = newName;
          } else if (f.subfolders.length > 0) {
            f.subfolders = findAndUpdateFolder(f.subfolders);
          }
          return f;
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

export const {
  addFolder,
  removeFolder,
  removeFile,
  updateFileName,
  updateFolderName,
  resetFolders
} = foldersSlice.actions;

export default foldersSlice.reducer;
