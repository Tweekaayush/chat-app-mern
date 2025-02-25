import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  data: {
    chatList: [],
    activeChat: {},
    activeChatMessages: [],
    onlineUsers: [],
    socketConnection: null,
    notifications: [],
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

export const getAllUsers = createAsyncThunk(
  "getAllUsers",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/users?search=${payload}`,
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

export const createGroupChat = createAsyncThunk(
  "createGroupChat",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/chats/group`,
        payload,
        {
          withCredentials: true,
        }
      );

      dispatch(fetchChatList());

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "fetchMessages",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/messages/${payload}`,
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

export const setActiveChat = createAsyncThunk(
  "setActiveChat",
  async (payload, { dispatch, rejectWithValue, getState }) => {
    try {
      const socket = getState().chats.data.socketConnection;

      socket.emit("join chat", payload._id);
      return payload;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  "sendMessage",
  async (payload, { rejectWithValue, dispatch, getState }) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/messages`,
        payload,
        {
          withCredentials: true,
        }
      );

      const socket = getState().chats.data.socketConnection;

      socket.emit("new message", res.data.newMessage);
      dispatch(appendMessage(res.data.newMessage));
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);


export const removeFromGroup = createAsyncThunk('removeFromGroup', async(payload, {dispatch, rejectWithValue,})=>{
  try {
    const res = await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/v1/chats/group/remove`, payload, {
      withCredentials: true
    })
    dispatch(fetchChatList())
    return res.data
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
})

export const addToGroup = createAsyncThunk('addToGroup', async(payload, {dispatch, rejectWithValue,})=>{
  try {
    const res = await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/v1/chats/group/add`, payload, {
      withCredentials: true
    })
    return res.data
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
})


export const createChat = createAsyncThunk('createChat', async(payload, {rejectWithValue, dispatch})=>{
  try {
    const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/v1/chats`, payload, {
      withCredentials: true
    })
    dispatch(fetchChatList())
    return res.data
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
})

const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    clearActiveChat: (state, action) => {
      state.data.activeChat = {};
      state.data.activeChatMessages = [];
    },
    setSocketConnection: (state, action) => {
      state.data.socketConnection = action.payload;
    },
    clearSocketConnection: (state, action) => {
      state.data.socketConnection = null;
    },
    appendMessage: (state, action) => {
      state.data.activeChatMessages = [
        ...state.data.activeChatMessages,
        action.payload,
      ];
    },
    updateNotifications: (state, action) => {
      state.data.notifications = action.payload;
    },
    setOnlineUsers: (state, action)=>{
      state.data.onlineUsers = action.payload
    },
    clearChatData: (state)=>{
      state.data = {
        chatList: [],
        activeChat: {},
        activeChatMessages: [],
        onlineUsers: [],
        socketConnection: null,
        notifications: [],
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChatList.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchChatList.fulfilled, (state, action) => {
      state.loading = false;
      state.data.chatList = action.payload.chats;
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
      state.data.userList = action.payload.users;
    });
    builder.addCase(getAllUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(createGroupChat.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createGroupChat.fulfilled, (state, action) => {
      state.loading = false;
      state.data.activeChat = action.payload.groupChat;
    });
    builder.addCase(createGroupChat.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(fetchMessages.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      state.loading = false;
      state.data.activeChatMessages = action.payload.messages;
    });
    builder.addCase(fetchMessages.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(sendMessage.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(sendMessage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(setActiveChat.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(setActiveChat.fulfilled, (state, action) => {
      state.loading = false;
      state.data.activeChat = action.payload;
    });
    builder.addCase(setActiveChat.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(removeFromGroup.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(removeFromGroup.fulfilled, (state, action) => {
      state.loading = false;
      state.data.activeChat = action.payload.groupChat;
    });
    builder.addCase(removeFromGroup.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(addToGroup.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(addToGroup.fulfilled, (state, action) => {
      state.loading = false;
      state.data.activeChat = action.payload.groupChat;
    });
    builder.addCase(addToGroup.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(createChat.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createChat.fulfilled, (state, action) => {
      state.loading = false;
      state.data.activeChat = action.payload.chat;
    });
    builder.addCase(createChat.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const {
  clearActiveChat,
  setSocketConnection,
  clearSocketConnection,
  appendMessage,
  updateNotifications,
  setOnlineUsers,
  clearChatData
} = chatSlice.actions;

export default chatSlice.reducer;
