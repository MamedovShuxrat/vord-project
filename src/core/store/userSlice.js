import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerUser, loginUser, fetchUserInfo, logoutUserDb } from "../../api/auth";
import { toast } from "react-hot-toast";


export const register = createAsyncThunk(
  "user/register",
  async ({ name, email, password, confirmPassword }, { rejectWithValue }) => {
    try {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return rejectWithValue("Passwords do not match.");
      }
      await registerUser(name, email, password, confirmPassword);
      const loginData = await loginUser(email, password);
      localStorage.setItem("token", JSON.stringify(loginData.key));
      toast.success("Registration successful!");

      const userInfo = await fetchUserInfo(loginData.key);
      localStorage.setItem("userData", JSON.stringify(userInfo));

      return { ...loginData, user: userInfo };
    } catch (error) {
      toast.error(error.message.replace(/[{()}]/g, ""));
      return rejectWithValue(error.message.replace(/[{()}]/g, ""));
    }
  }
);


export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const loginData = await loginUser(email, password);
      localStorage.setItem("token", JSON.stringify(loginData.key));
      toast.success("Login successful!");

      const userInfo = await fetchUserInfo(loginData.key);
      localStorage.setItem("userData", JSON.stringify(userInfo));

      return { ...loginData, user: userInfo };
    } catch (error) {
      toast.error(error.message.replace(/[{()}]/g, ""));
      return rejectWithValue(error.message.replace(/[{()}]/g, ""));
    }
  }
);



export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.user.user?.key;
    if (!token) {
      return rejectWithValue("No token found");
    }
    try {
      await logoutUserDb(token);
      return;
    } catch (error) {
      toast.error(error.message.replace(/[{()}]/g, ""));
      return rejectWithValue(error.message.replace(/[{()}]/g, ""));
    }
  }
);

export const getUserInfo = createAsyncThunk(
  "user/getUserInfo",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.user.user?.key;
    if (!token) {
      return rejectWithValue("No token found");
    }
    try {
      const data = await fetchUserInfo(token);
      return data;
    } catch (error) {
      toast.error(error.message.replace(/[{()}]/g, ""));
      return rejectWithValue(error.message.replace(/[{()}]/g, ""));
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    status: "idle",
    error: null
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.status = "loading";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
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
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getUserInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  }
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;
