import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import { fetchUserConnections } from "../../api/api";

const API_URL = process.env.REACT_APP_API_URL;
const CONNECTION = `${API_URL}/clientdb/`;

// Function to send form data to the backend
const sendFormData = async (formData, token) => {
  try {
    const response = await axios.post(CONNECTION, formData, {
      headers: {
        Authorization: `Token ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Redux thunk for submitting form data
export const submitFormData = createAsyncThunk(
  "connectionTabs/submitFormData",
  async ({ formData, activeTab }, { dispatch, rejectWithValue }) => {
    const token = JSON.parse(localStorage.getItem("userToken"));
    if (!token) {
      return rejectWithValue("No valid token found");
    }
    try {
      const response = await toast.promise(sendFormData(formData, token), {
        loading: "Sending Data...",
        success: "Data saved successfully!",
        error: "Error saving data. Please try again."
      });

      const updatedFormData = {
        ...formData,
        connectionName: formData.connection_name
      };

      dispatch(updateConnection({ id: activeTab, formData: updatedFormData }));
      return response;
    } catch (error) {
      console.error("Error saving data:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for fetching user databases from the server
export const fetchUserDatabases = createAsyncThunk(
  "connectionTabs/fetchUserDatabases",
  async (_, { rejectWithValue }) => {
    const token = JSON.parse(localStorage.getItem("userToken"));
    if (!token) {
      return rejectWithValue("No valid token found");
    }

    try {
      const response = await fetchUserConnections(token);
      console.log("Fetched user databases: ", response); // Logging fetched data
      return response;
    } catch (error) {
      console.error("Error fetching user databases:", error);
      return rejectWithValue(error.message || "Failed to fetch databases.");
    }
  }
);

const connectionTabsSlice = createSlice({
  name: "connectionTabs",
  initialState: {
    connections: [],
    status: "idle",
    error: null
  },
  reducers: {
    addConnection: (state, action) => {
      state.connections.push(action.payload); // Добавляем новое соединение в конец списка
      localStorage.setItem("connections", JSON.stringify(state.connections));
    },
    updateConnection: (state, action) => {
      const { id, formData } = action.payload;
      const connection = state.connections.find((conn) => conn.id === id);
      if (connection) {
        connection.formData = formData;
        localStorage.setItem("connections", JSON.stringify(state.connections));
      }
    },
    renameConnection: (state, action) => {
      const { id, newName } = action.payload;
      const connection = state.connections.find((conn) => conn.id === id);
      if (connection) {
        connection.MySQL = newName;
        localStorage.setItem("connections", JSON.stringify(state.connections));
      }
    },
    deleteConnection: (state, action) => {
      state.connections = state.connections.filter(
        (connection) => connection.id !== action.payload
      );
      localStorage.setItem("connections", JSON.stringify(state.connections));
    },
    setConnections: (state, action) => {
      state.connections = action.payload;
      localStorage.setItem("connections", JSON.stringify(state.connections));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDatabases.pending, (state) => {
        state.status = "loading"; // Устанавливаем статус загрузки
      })
      .addCase(fetchUserDatabases.fulfilled, (state, action) => {
        state.status = "succeeded"; // Устанавливаем статус успеха

        // Проверка на дублирование данных перед добавлением
        const newConnections = action.payload.filter(
          (newConn) => !state.connections.some((conn) => conn.id === newConn.id)
        );

        // Добавляем только новые уникальные соединения
        state.connections = [...state.connections, ...newConnections];
        localStorage.setItem("connections", JSON.stringify(state.connections)); // Сохраняем в localStorage
      })
      .addCase(fetchUserDatabases.rejected, (state, action) => {
        state.status = "failed"; // Устанавливаем статус ошибки
        state.error = action.payload; // Сохраняем сообщение об ошибке
      });
  }
});

export const {
  addConnection,
  updateConnection,
  renameConnection,
  deleteConnection,
  setConnections
} = connectionTabsSlice.actions;

export default connectionTabsSlice.reducer;
