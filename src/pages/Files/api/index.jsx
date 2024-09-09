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

//Добавление файла

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

//Загрузка файлов на веб

//Скачивание файлов
