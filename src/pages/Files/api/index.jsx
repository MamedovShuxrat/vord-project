import axios from "axios";
import { toast } from "react-hot-toast";

// Устанавливаем URL API
const API_URL = process.env.REACT_APP_API_URL;
const access = JSON.parse(localStorage.getItem("userToken"));

// Определяем эндпоинты для управления папками и файлами
const foldersList = `${API_URL}/folders/`;
const filesList = `${API_URL}/files/`;

//Добавление папки
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
        name: newFolderName // Отправляем новое имя папки
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
    toast.error("Error renaming folder");
    throw new Error(error);
  }
};

//Загрузка папок на веб
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
    toast.error("Error fetching folders");
    throw new Error(error);
  }
};

// Добавление файла
export const addFileToAPI = async (fileData, folderId, userId) => {
  const formData = new FormData();
  formData.append("file", fileData.file); // Файл
  formData.append("name", fileData.name); // Имя файла
  formData.append("folder", folderId !== null ? folderId : ""); // ID папки или пустая строка для корня
  formData.append("user_id", userId); // ID пользователя

  try {
    const response = await toast.promise(
      axios.post(`${filesList}`, formData, {
        headers: {
          Authorization: `Token ${access}`, // Токен авторизации
          "Content-Type": "multipart/form-data" // Тип контента
        }
      }),
      {
        loading: "Uploading file...",
        success: "File uploaded successfully!",
        error: "Failed to upload file. Please try again."
      }
    );

    // Возвращаем данные файла, включая название и ID
    return response.data;
  } catch (error) {
    console.error(
      "Error uploading file:",
      error.response?.data || error.message
    );
    throw new Error(error);
  }
};

// Загрузка файлов для указанной папки на веб
export const fetchFilesForFolder = async (folderId) => {
  try {
    const response = await axios.get(`${filesList}`, {
      headers: {
        Authorization: `Token ${access}`,
        "Content-Type": "application/json"
      }
    });

    // Проверяем, получили ли мы список файлов
    if (response.data) {
      if (folderId === null || folderId === "") {
        // Если folderId === null, выбираем файлы для корневой папки
        const rootFiles = response.data.filter((file) => file.folder === null);
        console.log("Файлы для корневой папки:", rootFiles);
        return rootFiles;
      } else {
        // Для других папок фильтруем файлы по folderId
        const folderFiles = response.data.filter(
          (file) => file.folder === folderId
        );
        console.log("Файлы для папки с ID:", folderId, folderFiles);
        return folderFiles;
      }
    } else {
      console.log("Нет данных о файлах в ответе сервера");
      return [];
    }
  } catch (error) {
    console.error("Ошибка при загрузке файлов:", error);
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
    toast.error("Error deleting file");
    throw new Error(error);
  }
};

// Скачивание файлов
export const downloadFileFromAPI = (downloadLink) => {
  window.open(downloadLink, "_blank");
};
