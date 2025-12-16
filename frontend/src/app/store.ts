import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import trucksReducer from '../features/trucks/trucksSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    trucks: trucksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
