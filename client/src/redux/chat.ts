import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type chat = {
  searchChat: string;
};

const initialState: chat = {
  searchChat: "",
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setsearchChat: (state, action: PayloadAction<string>) => {
      state.searchChat = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setsearchChat } = chatSlice.actions;

export default chatSlice.reducer;
