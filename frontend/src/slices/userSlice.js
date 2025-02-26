import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { clearChatData } from "./chatSlice";
import BASE_URL from "../constants/constants";

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
        `${BASE_URL}/api/v1/users/profile`,
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
        `${BASE_URL}/api/v1/users/login`,
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
        `${BASE_URL}/api/v1/users/signup`,
        payload,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const logout =createAsyncThunk('logout', async(payload, {dispatch, rejectWithValue})=>{
    try {
        const res = await axios.post(`${BASE_URL}/api/v1/users/logout`, payload, {
            withCredentials: true
        })
        dispatch(clearChatData())
        return res.data
    } catch (error) {
        return rejectWithValue(error.response.data.message)
    }
})

export const updateProfile = createAsyncThunk('updateProfile', async(payload, {rejectWithValue})=>{
  try {
    console.log(payload)
    const res = await axios.put(`${BASE_URL}/api/v1/users/profile`, payload, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
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
      state.data = {}
      state.successMessage = action.payload.message;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(updateProfile.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload.updatedUser
      state.successMessage = action.payload.message;
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearUserErrors, clearUserSuccessMessage } = userSlice.actions;

export default userSlice.reducer;
