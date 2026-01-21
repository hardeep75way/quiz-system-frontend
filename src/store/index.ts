import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';
// Preload state from localStorage
const preloadedState = {
    auth: {
        user: null, // Will be fetched after token validation
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
        isAuthenticated: !!localStorage.getItem('accessToken'),
    }
};
export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
    preloadedState, // ← ADD THIS
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;