import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMessages, sendMessageToBackend, getUserChats, getChatMembers } from 'src/components/Chat/api';

// Асинхронный экшен для получения списка чатов пользователя
export const fetchUserChats = createAsyncThunk(
  'chat/fetchUserChats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserChats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({ chatId }, { rejectWithValue }) => {
    try {
      const response = await getMessages(chatId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Асинхронный экшен для получения участников чата
export const fetchChatMembers = createAsyncThunk(
  'chat/fetchChatMembers',
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await getChatMembers(chatId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ chatId, message }, { rejectWithValue }) => {
    try {
      const response = await sendMessageToBackend(chatId, message); // Вызываем API для отправки сообщения
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Слайс
const initialState = {
  messages: JSON.parse(localStorage.getItem('userMessages')) || [],
  chats: [],
  members: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
    initialState: {
      messages: [],
      selectedChatId: null,
      status: 'idle',
      error: null,
    },
  reducers: {
    selectChat: (state, action) => {
      state.selectedChatId = action.payload; // Сохраняем chatId
      state.messages = []; // Очищаем предыдущие сообщения при выборе нового чата
    },
    addLocalMessage: (state, action) => {
      state.messages.push(action.payload);
      localStorage.setItem('userMessages', JSON.stringify(state.messages));
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
      localStorage.setItem('userMessages', JSON.stringify(state.messages));
    },
    clearChat: (state) => {
      state.messages = [];
      localStorage.removeItem('userMessages');
    },
  },
  extraReducers: (builder) => {
    // Получение чатов пользователя
    builder
      .addCase(fetchUserChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserChats.fulfilled, (state, action) => {
        state.chats = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Получение участников чата
    builder
      .addCase(fetchChatMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatMembers.fulfilled, (state, action) => {
        state.members = action.payload;
        state.loading = false;
      })
      .addCase(fetchChatMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Получение сообщений
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
        localStorage.setItem('userMessages', JSON.stringify(state.messages));
        state.loading = false;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Отправка сообщений
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
        localStorage.setItem('userMessages', JSON.stringify(state.messages));
        state.loading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { selectChat, addLocalMessage, setMessages, clearChat } = chatSlice.actions;

export default chatSlice.reducer;
