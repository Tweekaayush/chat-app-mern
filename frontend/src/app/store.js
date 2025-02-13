import {configureStore, combineReducers} from '@reduxjs/toolkit'
import userReducer from '../slices/userSlice'

const rootReducers = combineReducers({
    user: userReducer
})

const store = configureStore({
    reducer:rootReducers
})

export default store