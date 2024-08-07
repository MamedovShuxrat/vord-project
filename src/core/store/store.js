import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import chatReducer from "./chatSlice";
import connectionsReducer from "./connectionSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
    connections: connectionsReducer
  }
});

export default store;
