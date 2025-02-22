import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  data: {
    chatList: [],
    activeChat: [],
  },
  error: "",
};

export const fetchChatList = createAsyncThunk(
  "fetchChatList",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/chats`,
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

export const getAllUsers = createAsyncThunk('getAllUsers', async(payload, {rejectWithValue})=>{
    try {
        const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/v1/users?search=${payload}`, {
            withCredentials: true
        })

        return res.data
    } catch (error) {
        return rejectWithValue(error.response.data.message)
    }
})

const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchChatList.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchChatList.fulfilled, (state, action) => {
      state.loading = false;
      state.data.chatList = action.payload.chats
    });
    builder.addCase(fetchChatList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(getAllUsers.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.data.userList = action.payload.users
    });
    builder.addCase(getAllUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const {} = chatSlice.actions;

export default chatSlice.reducer;
