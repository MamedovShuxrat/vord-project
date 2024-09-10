import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  fetchUserData,
  fetchUserConnections,
  logoutUser
} from "../../api/api";
import { setConnections } from "./connectionsSlice";
import { toast } from "react-hot-toast";

export const register = createAsyncThunk(
  "user/register",
  async ({ name, email, password, confirmPassword }, { rejectWithValue }) => {
    try {
      const data = await registerUser(name, email, password, confirmPassword);
      const [token, userData] = data;
      localStorage.setItem("userToken", JSON.stringify(token));
      localStorage.setItem("userData", JSON.stringify(userData));

      return { token, user: userData };
    } catch (error) {
      return rejectWithValue(error.message || "Registration failed");
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
      console.log("LoggiN with token:", token);
      localStorage.setItem("userToken", JSON.stringify(token));
      localStorage.setItem("userData", JSON.stringify(user));

      // Загрузите соединения пользователя после успешного входа
      const connections = await fetchUserConnections(token);
      dispatch(setConnections(connections)); // Сохраняем данные в Redux Store и в localStorage
      return { token, user };
    } catch (error) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const performLogout = createAsyncThunk(
  "user/logout",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().user.token;
    console.log("Attempting to logout with token:", token);

    if (!token) {
      console.log("No token found for logout");
      return rejectWithValue("No token found for logout");
    }

    try {
      await logoutUser(token);
      console.log("Logout successful, clearing localStorage...");

      // Clear localStorage
      localStorage.removeItem("userData");
      localStorage.removeItem("userToken");
      localStorage.removeItem("connections");

      console.log("localStorage after clearing:", localStorage);

      return null; // возвращаем null, чтобы явно указать, что пользователь вышел из системы
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);

const loadUserFromLocalStorage = () => {
  const token = JSON.parse(localStorage.getItem("userToken"));
  const user = JSON.parse(localStorage.getItem("userData"));
  return { token, user };
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    token: null,
    status: "idle",
    error: null
  },
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
      console.log("User state after logout:", state); // Log to check state
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
        console.log("Token after login:", state.token);
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
        console.log("User state and token after logout:", state); // Log to check state
      })
      .addCase(performLogout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase("user/loadFromLocalStorage", (state, action) => {
        const { token, user } = loadUserFromLocalStorage();
        state.token = token;
        state.user = user;
      });
  }
});

export const { setUser, setToken, logout } = userSlice.actions;

export default userSlice.reducer;
