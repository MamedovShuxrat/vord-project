import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { connectClientDB } from "../../api";
import { toast } from "react-hot-toast";

export const connectDatabase = createAsyncThunk(
  "connections/connect",
  async (connectionData, { getState, rejectWithValue }) => {
    const { token } = getState().user; // Получаем токен из состояния user
    try {
      const data = await connectClientDB(connectionData, token);
      toast.success("Connection successful");
      return data;
    } catch (error) {
      toast.error("Connection failed");
      return rejectWithValue(error.message || "Connection failed");
    }
  }
);

const connectionsSlice = createSlice({
  name: "connections",
  initialState: {
    connections: [],
    status: "idle",
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(connectDatabase.pending, (state) => {
        state.status = "loading";
      })
      .addCase(connectDatabase.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.connections.push(action.payload);
      })
      .addCase(connectDatabase.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  }
});

export default connectionsSlice.reducer;
