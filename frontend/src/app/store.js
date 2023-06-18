import { configureStore } from '@reduxjs/toolkit';
import { toastSlice } from '../features/toast/toastSlice';
import { rawIngredientsSlice } from '../features/classify/rawIngredientsSlice';
import { ingredientsSlice } from '../features/classify/ingredientsSlice';

export const store = configureStore({
  reducer: {
    [ingredientsSlice.reducerPath]: ingredientsSlice.reducer,
    [rawIngredientsSlice.reducerPath]: rawIngredientsSlice.reducer,
    [toastSlice.name]: toastSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rawIngredientsSlice.middleware, ingredientsSlice.middleware),
});
