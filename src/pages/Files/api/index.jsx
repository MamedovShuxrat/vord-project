// src/pages/Files/api/index.js
import axios from "axios";
import { toast } from "react-hot-toast";

// Устанавливаем URL API
const API_URL = process.env.REACT_APP_API_URL;
const access = JSON.parse(localStorage.getItem("userToken"));

// Эндпоинты для папок и файлов
const foldersList = `${API_URL}/folders/`;
const filesList = `${API_URL}/files/`;

// Добавление папки
export const addFolderToAPI = async (folderName, parentId = null, userId) => {
  try {
    const response = await axios.post(
      foldersList,
      {
        name: folderName,
        parent: parentId,
        user_id: userId
      },
      {
        headers: {
          Authorization: `Token ${access}`,
          "Content-Type": "application/json"
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Ошибка при создании папки:",
      error.response?.data || error.message
    );
    toast.error("Error creating folder");
    throw new Error(error);
  }
};

// Удаление папки
export const deleteFolderFromAPI = async (folderId, token) => {
  try {
    const response = await axios.delete(`${foldersList}${folderId}/`, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json"
      }
    });
    toast.success("Folder deleted successfully");
    return response.data;
  } catch (error) {
    console.error(
      "Ошибка при удалении папки:",
      error.response?.data || error.message
    );
    toast.error("Error deleting folder");
    throw new Error(error);
  }
};

// Переименование папки
export const updateFolderName = async (folderId, newFolderName, token) => {
  try {
    const response = await axios.patch(
      `${foldersList}${folderId}/`,
      {
        name: newFolderName
      },
      {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    toast.success("Folder renamed successfully");
    return response.data;
  } catch (error) {
    console.error(
      "Ошибка при переименовании папки:",
      error.response?.data || error.message
    );
    toast.error("Error renaming folder");
    throw new Error(error);
  }
};

// Загрузка папок
export const fetchFolders = async (token) => {
  try {
    const response = await axios.get(foldersList, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error(
      "Ошибка при загрузке папок:",
      error.response?.data || error.message
    );
    toast.error("Error fetching folders");
    throw new Error(error);
  }
};

// Добавление файла
export const addFileToAPI = async (fileData, folderId, userId) => {
  const formData = new FormData();
  formData.append("link", fileData.file);
  formData.append("folder", folderId !== null ? folderId : "");
  formData.append("user_id", userId);

  try {
    const response = await axios.post(`${filesList}`, formData, {
      headers: {
        Authorization: `Token ${access}`,
        "Content-Type": "multipart/form-data"
      }
    });
    toast.success("File uploaded successfully!");
    return response.data;
  } catch (error) {
    console.error(
      "Ошибка при загрузке файла:",
      error.response?.data || error.message
    );
    toast.error("Failed to upload file. Please try again.");
    throw new Error(error);
  }
};

// Загрузка файлов для папки
export const fetchFilesForFolder = async (folderId) => {
  try {
    const response = await axios.get(`${filesList}`, {
      headers: {
        Authorization: `Token ${access}`,
        "Content-Type": "application/json"
      }
    });

    if (response.data) {
      if (folderId === null || folderId === "") {
        const rootFiles = response.data.filter((file) => file.folder === null);
        return rootFiles;
      } else {
        const folderFiles = response.data.filter(
          (file) => file.folder === folderId
        );
        return folderFiles;
      }
    } else {
      console.error("Нет данных о файлах в ответе сервера");
      return [];
    }
  } catch (error) {
    console.error(
      "Ошибка при загрузке файлов:",
      error.response?.data || error.message
    );
    toast.error("Ошибка при загрузке файлов");
    throw new Error(error);
  }
};

// Удаление файла
export const deleteFileFromAPI = async (fileId, token) => {
  try {
    const response = await axios.delete(`${filesList}${fileId}/`, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json"
      }
    });
    toast.success("File deleted successfully");
    return response.data;
  } catch (error) {
    console.error(
      "Ошибка при удалении файла:",
      error.response?.data || error.message
    );
    toast.error("Error deleting file");
    throw new Error(error);
  }
};

// Скачивание файла
export const downloadFileFromAPI = (downloadLink) => {
  window.open(downloadLink, "_blank");
};
