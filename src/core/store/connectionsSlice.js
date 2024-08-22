import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";

import dataBaseBlackSvg from "../../assets/images/icons/connection/database-black.svg";

const API_URL = process.env.REACT_APP_API_URL;
const CONNECTION = `${API_URL}/clientdb/`;

const token = JSON.parse(localStorage.getItem("userToken"));

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

export const submitFormData = createAsyncThunk(
  "connectionTabs/submitFormData",
  async ({ formData, activeTab }, { dispatch, rejectWithValue }) => {
    try {
      const response = await toast.promise(
        sendFormData(formData, token),
        {
          loading: "Sending Data...",
          success: "Data saved successfully!",
          error: "Error saving data. Please try again."
        }
      );

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

const connectionTabsSlice = createSlice({
  name: "connectionTabs",
  initialState: {
    connections: JSON.parse(localStorage.getItem("connections")) || [
      {
        id: "untitled",
        img: dataBaseBlackSvg,
        MySQL: "Untitled",
        w: "20px",
        h: "20px",
        formData: {} // Состояние для CreateDataBaseCard
      }
    ]
  },
  reducers: {
    addConnection: (state, action) => {
      state.connections.push(action.payload);
      localStorage.setItem("connections", JSON.stringify(state.connections)); // Сохранение в localStorage
    },
    updateConnection: (state, action) => {
      const { id, formData } = action.payload;
      const connection = state.connections.find((conn) => conn.id === id);
      if (connection) {
        connection.formData = formData;
        localStorage.setItem("connections", JSON.stringify(state.connections)); // Сохранение в localStorage
      }
    },
    renameConnection: (state, action) => {
      const { id, newName } = action.payload;
      const connection = state.connections.find((conn) => conn.id === id);
      if (connection) {
        connection.MySQL = newName;
        localStorage.setItem("connections", JSON.stringify(state.connections)); // Сохранение в localStorage
      }
    },
    deleteConnection: (state, action) => {
      state.connections = state.connections.filter(
        (connection) => connection.id !== action.payload
      );
      localStorage.setItem("connections", JSON.stringify(state.connections)); // Сохранение в localStorage

    },
    setConnections: (state, action) => {
      state.connections = action.payload;
      localStorage.setItem("connections", JSON.stringify(state.connections)); // Сохранение в localStorage
    }
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
