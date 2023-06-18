import { createSlice, nanoid } from "@reduxjs/toolkit";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

const initialState = {
  toasts: []
};

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    addToast: {
      reducer: (state, action) => {
        state.toasts.push(action.payload);
      },

      prepare: (message, { type = "success", timeout=5, autoDismiss=true }) => {
        return {
          payload: {
            id: nanoid(),
            message,
            type,
            timeout,
            autoDismiss,
          },
        };
      },
    },

    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== action.payload
      );
    },
  },
});
export const { addToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;

export const selectToasts = (state) => state.toast.toasts;

export const useToast = () => {
  const dispatch = useDispatch();
  return (message, options={}) => dispatch(addToast(message, options));
};
