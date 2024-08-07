// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   registerUser,
//   loginUser,
//   fetchUserData,
//   logoutUser
// } from "../../api/auth";
// import { toast } from "react-hot-toast";

// export const register = createAsyncThunk(
//   "user/register",
//   async ({ name, email, password, confirmPassword }, { rejectWithValue }) => {
//     try {
//       const data = await registerUser(name, email, password, confirmPassword);
//       const [token, userData] = data;
//       localStorage.setItem("userToken", JSON.stringify(token));
//       localStorage.setItem("userData", JSON.stringify(userData));
//       toast.success("Registration successful");
//       return { token, user: userData };
//     } catch (error) {
//       toast.error("Registration failed");
//       return rejectWithValue(error.message || "Login failed");
//     }
//   }
// );

// export const login = createAsyncThunk(
//   "user/login",
//   async ({ email, password }, { rejectWithValue }) => {
//     try {
//       const data = await loginUser(email, password);
//       const token = data.key;
//       const user = await fetchUserData(token);
//       localStorage.setItem("userToken", JSON.stringify(token));
//       localStorage.setItem("userData", JSON.stringify(user));
//       toast.success("Login successful");
//       return { token, user };
//     } catch (error) {
//       toast.error("Login failed: invalid username or password");
//       return rejectWithValue(error.message || "Logout failed");
//     }
//   }
// );

// // export const performLogout = createAsyncThunk(
// //   "user/logout",
// //   async (token, { rejectWithValue }) => {
// //     try {
// //       await logoutUser(token);
// //       localStorage.removeItem("userData");
// //       localStorage.removeItem("userToken");
// //       toast.success("Logout successful");
// //       return null;
// //     } catch (error) {
// //       toast.error("Logout failed");
// //       return rejectWithValue(error.message || "Login failed");
// //     }
// //   }
// // );
// export const performLogout = createAsyncThunk(
//   "user/logout",
//   async (_, { getState, rejectWithValue }) => {
//     const token = getState().user.token;
//     if (!token) {
//       toast.error("No token found for logout");
//       return rejectWithValue("No token found for logout");
//     }
//     try {
//       await logoutUser(token);
//       localStorage.removeItem("userData");
//       localStorage.removeItem("userToken");
//       toast.success("Logout successful");
//       return null;
//     } catch (error) {
//       toast.error("Logout failed");
//       return rejectWithValue(error.message || "Logout failed");
//     }
//   }
// );

// export const loadUserFromLocalStorage = () => {
//   const token = JSON.parse(localStorage.getItem("userToken"));
//   const user = JSON.parse(localStorage.getItem("userData"));
//   return { token, user };
// };

// const userSlice = createSlice({
//   name: "user",
//   initialState: {
//     user: null,
//     token: null,
//     status: "idle",
//     error: null
//   },
//   reducers: {
//     setUser(state, action) {
//       state.user = action.payload;
//     },
//     setToken(state, action) {
//       state.token = action.payload;
//     },
//     logout(state) {
//       state.user = null;
//       state.token = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(register.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(register.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//         console.log("Token:", state.token); // Логирование токена
//       })
//       .addCase(register.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(login.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//         console.log("Token:", state.token); // Логирование токена
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(performLogout.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(performLogout.fulfilled, (state) => {
//         state.status = "succeeded";
//         state.user = null;
//         state.token = null;
//       })
//       .addCase(performLogout.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase("user/loadFromLocalStorage", (state, action) => {
//         const { token, user } = action.payload;
//         state.token = token;
//         state.user = user;
//       });
//   }
// });

// export const { setUser, setToken, logout } = userSlice.actions;

// export default userSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerUser, loginUser, fetchUserData, logoutUser } from "../../api/auth";
import { toast } from "react-hot-toast";

export const register = createAsyncThunk(
  "user/register",
  async ({ name, email, password, confirmPassword }, { rejectWithValue }) => {
    try {
      const data = await registerUser(name, email, password, confirmPassword);
      const [token, userData] = data;
      localStorage.setItem("userToken", JSON.stringify(token));
      localStorage.setItem("userData", JSON.stringify(userData));
      toast.success("Registration successful");
      return { token, user: userData };
    } catch (error) {
      toast.error("Registration failed");
      return rejectWithValue(error.message || "Registration failed");
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await loginUser(email, password);
      const token = data.key;
      const user = await fetchUserData(token);
      localStorage.setItem("userToken", JSON.stringify(token));
      localStorage.setItem("userData", JSON.stringify(user));
      toast.success("Login successful");
      return { token, user };
    } catch (error) {
      toast.error("Login failed: invalid username or password");
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const performLogout = createAsyncThunk(
  "user/logout",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().user.token;
    if (!token) {
      toast.error("No token found for logout");
      return rejectWithValue("No token found for logout");
    }
    try {
      await logoutUser(token);
      localStorage.removeItem("userData");
      localStorage.removeItem("userToken");
      toast.success("Logout successful");
      return null;
    } catch (error) {
      toast.error("Logout failed");
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);

export const loadUserFromLocalStorage = createAsyncThunk(
  "user/loadFromLocalStorage",
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("userToken"));
      const user = JSON.parse(localStorage.getItem("userData"));
      return { token, user };
    } catch (error) {
      return rejectWithValue("Failed to load user from local storage");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    token: null,
    status: "idle",
    error: null,
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
    },
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
      })
      .addCase(performLogout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(loadUserFromLocalStorage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadUserFromLocalStorage.fulfilled, (state, action) => {
        const { token, user } = action.payload;
        state.token = token;
        state.user = user;
        state.status = "succeeded";
      })
      .addCase(loadUserFromLocalStorage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setUser, setToken, logout } = userSlice.actions;

export default userSlice.reducer;
