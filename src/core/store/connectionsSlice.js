import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import { fetchUserConnections, deleteUserConnection } from "../../api/api";

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

      // После успешного добавления соединения на бэкенд, удаляем его из локального состояния
      dispatch(deleteConnection(activeTab));

      // Перезагружаем соединения с бэкенда
      dispatch(fetchUserDatabases());

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
      return response;
    } catch (error) {
      console.error("Error fetching user databases:", error);
      return rejectWithValue(error.message || "Failed to fetch databases.");
    }
  }
);

export const removeUserConnection = createAsyncThunk(
  "connectionTabs/removeUserConnection",
  async (id, { rejectWithValue }) => {
    const token = JSON.parse(localStorage.getItem("userToken"));
    if (!token) {
      return rejectWithValue("No valid token found");
    }

    try {
      await deleteUserConnection(id, token); // Удаляем с сервера
      return id; // Возвращаем id удаленного соединения для последующего удаления из состояния
    } catch (error) {
      console.error("Error deleting user connection:", error);
      return rejectWithValue(error.message || "Failed to delete connection.");
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
      // Проверяем, существует ли уже соединение с таким же ID или connection_name
      const existingConnection = state.connections.find(
        (conn) =>
          conn.id === action.payload.id ||
          conn.connection_name === action.payload.connection_name
      );
      if (!existingConnection) {
        state.connections.push(action.payload);
      }
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
      // Очищаем соединения перед добавлением новых
      state.connections = [];

      // Добавляем соединения, только если они уникальны
      action.payload.forEach((newConn) => {
        const existingConnection = state.connections.find(
          (conn) => conn.id === newConn.id
        );
        if (!existingConnection) {
          state.connections.push(newConn);
        }
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDatabases.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserDatabases.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Обновляем состояние только если данные уникальны
        action.payload.forEach((newConn) => {
          if (!state.connections.some((conn) => conn.id === newConn.id)) {
            state.connections.push(newConn);
          }
        });
      })
      .addCase(fetchUserDatabases.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(removeUserConnection.fulfilled, (state, action) => {
        state.connections = state.connections.filter(
          (connection) => connection.id !== action.payload
        );
        toast.success("Connection removed successfully.");
        localStorage.setItem("connections", JSON.stringify(state.connections));
      })
      .addCase(removeUserConnection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error(action.payload);
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
