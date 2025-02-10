import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  fetchUserData,
  fetchUserConnections,
  logoutUser
} from "../../api/api";
import { setConnections } from "./connectionsSlice";
import { resetFolders } from "./foldersSlice";
import { toast } from "react-hot-toast";

// Функция для загрузки данных пользователя из localStorage
const loadUserFromLocalStorage = () => {
  const token = JSON.parse(localStorage.getItem("userToken"));
  const user = JSON.parse(localStorage.getItem("userData"));
  return { token, user };
};

// Инициализация начального состояния из localStorage
const { token, user } = loadUserFromLocalStorage();
console.log(token, 'ere');

const initialState = {
  user: user || null,
  token: token || null,
  status: "idle",
  error: null
};

export const register = createAsyncThunk(
  "user/register",
  async ({ name, email, password, confirmPassword }, { rejectWithValue }) => {
    try {
      const data = await registerUser(name, email, password, confirmPassword);
      const [token, userData] = data;
      localStorage.setItem("userToken", JSON.stringify(token));
      localStorage.setItem("userData", JSON.stringify(userData));
      console.log(data);

      return { token, user: userData };

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const data = await loginUser(email, password);
      const token = data.key;
      const user = await fetchUserData(token);

      localStorage.setItem("userToken", JSON.stringify(token));
      localStorage.setItem("userData", JSON.stringify(user));

      // Загрузка соединений пользователя после успешного входа
      const connections = await fetchUserConnections(token);
      dispatch(setConnections(connections));

      return { token, user };
    } catch (error) {
      return rejectWithValue(error.message || "Ошибка входа");
    }
  }
);

export const performLogout = createAsyncThunk(
  "user/logout",
  async (_, { getState, rejectWithValue, dispatch }) => {
    const token = getState().user.token;

    if (!token) {
      console.log("Токен не найден для выхода");
      return rejectWithValue("Токен не найден для выхода");
    }

    try {
      await logoutUser(token);

      // Очистка localStorage
      localStorage.removeItem("userData");
      localStorage.removeItem("userToken");
      localStorage.removeItem("connections");

      dispatch(resetFolders()); // Сброс папок

      return null; // Возвращаем null, чтобы явно указать, что пользователь вышел из системы
    } catch (error) {
      console.error("Не удалось выйти из системы:", error);
      toast.error("Не удалось выйти из системы");
      return rejectWithValue(error.message || "Ошибка выхода из системы");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      console.log("Состояние пользователя после выхода:", state);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.status = "loading";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        console.log("Токен после входа:", state.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(performLogout.pending, (state) => {
        state.status = "loading";
      })
      .addCase(performLogout.fulfilled, (state) => {
        state.status = "succeeded";
        state.user = null;
        state.token = null;
        console.log("Состояние пользователя и токен после выхода:", state);
      })
      .addCase(performLogout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  }
});

export const { setUser, setToken, logout } = userSlice.actions;

export default userSlice.reducer;
