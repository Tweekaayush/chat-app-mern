import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  data: {},
  successMessage: "",
  error: "",
};

export const loadUser = createAsyncThunk(
  "loadUser",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/users/profile`,
        {
          withCredentials: true,
        }
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
export const login = createAsyncThunk(
  "login",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/users/login`,
        payload,
        {
          withCredentials: true,
        }
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const signup = createAsyncThunk(
  "signup",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/users/signup`,
        payload,
        {
          withCredentials: true,
        }
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const logout =createAsyncThunk('logout', async(payload, {rejectWithValue})=>{
    try {
        const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/v1/users/logout`, payload, {
            withCredentials: true
        })

        return res.data
    } catch (error) {
        return rejectWithValue(error.response.data.message)
    }
})

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserErrors: (state, action) => {
      state.error = "";
    },
    clearUserSuccessMessage: (state, action) => {
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadUser.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(loadUser.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload.user;
    });
    builder.addCase(loadUser.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(login.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload.user;
      state.successMessage = action.payload.message;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(signup.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload.user;
      state.successMessage = action.payload.message;
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(logout.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload.user;
      state.successMessage = action.payload.message;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearUserErrors, clearUserSuccessMessage } = userSlice.actions;

export default userSlice.reducer;
