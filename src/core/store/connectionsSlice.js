import { createSlice } from "@reduxjs/toolkit";

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
    connections: JSON.parse(localStorage.getItem("connections")) || [
      {
        id: "untitled",
        img: "dataBaseBlackSvg",
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
} = connectionsSlice.actions;

export default connectionsSlice.reducer;
