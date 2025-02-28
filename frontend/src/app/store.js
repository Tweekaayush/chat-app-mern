import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice";
import chatReducer from "../slices/chatSlice";
import themeReducer from "../slices/themeSlice";

const rootReducers = combineReducers({
  user: userReducer,
  chats: chatReducer,
  theme: themeReducer
});

const store = configureStore({
  reducer: rootReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
