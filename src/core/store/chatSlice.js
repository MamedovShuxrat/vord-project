import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: JSON.parse(localStorage.getItem("userMessages")) || []
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
      localStorage.setItem("userMessages", JSON.stringify(state.messages));
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
      localStorage.setItem("userMessages", JSON.stringify(state.messages));
    }
  }
});

export const { addMessage, setMessages } = chatSlice.actions;

export default chatSlice.reducer;
