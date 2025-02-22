import {configureStore, combineReducers} from '@reduxjs/toolkit'
import userReducer from '../slices/userSlice'
import chatReducer from '../slices/chatSlice'

const rootReducers = combineReducers({
    user: userReducer,
    chats: chatReducer
})

const store = configureStore({
    reducer:rootReducers
})

export default store