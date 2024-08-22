import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { connectClientDB } from "../../api";
import { toast } from "react-hot-toast";

import { v4 as uuid } from "uuid";


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

// const connectionsSlice = createSlice({
//   name: "connections",
//   initialState: {
//     connections: [],
//     status: "idle",
//     error: null
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(connectDatabase.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(connectDatabase.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.connections.push(action.payload);
//       })
//       .addCase(connectDatabase.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       });
//   }
// });

// export default connectionsSlice.reducer;


const connectionTabsSlice = createSlice({
  name: 'connectionTabs',
  initialState: {
    tabs: [
      {
        id: uuid(),
        img: randomColor,
        MySQL: '',
        w: "20px",
        h: "20px",
        formData: {}
      }
    ],
    status: 'idle',
    error: null
  },
  reducers: {
    addTab: (state, action) => {
      state.tabs.push(action.payload);
    },
    updateTab: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.tabs.findIndex(tab => tab.id === id);
      if (index !== -1) {
        state.tabs[index] = { ...state.tabs[index], ...updatedData };
      }
    },
    removeTab: (state, action) => {
      state.tabs = state.tabs.filter(tab => tab.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTabs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTabs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tabs = action.payload;
      })
      .addCase(fetchTabs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(saveTabs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(saveTabs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tabs = action.payload;
      })
      .addCase(saveTabs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { addTab, updateTab, removeTab } = connectionTabsSlice.actions;

export default connectionTabsSlice.reducer;