import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import chatReducer from "./chatSlice";
import connectionsReducer from "./connectionsSlice";
import foldersReducer from "./foldersSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
    connections: connectionsReducer,
    folders: foldersReducer
  }
});

export default store;
