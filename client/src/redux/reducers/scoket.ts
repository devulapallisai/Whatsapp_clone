// State management of sockets in the application
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type socket = {
  socketconnected: boolean;
};

const initialState = {
  socketconnected: false,
};

const socketSlice = createSlice({
  initialState,
  name: "socket",
  reducers: {
    setsocketconnected: (state, action: PayloadAction<boolean>) => {
      state.socketconnected = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setsocketconnected } = socketSlice.actions;

export default socketSlice.reducer;
