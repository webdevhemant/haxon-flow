import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/authSlice'
import canvasReducer from './reducers/canvasReducer'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        canvas: canvasReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})
