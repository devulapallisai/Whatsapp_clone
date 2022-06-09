import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type mobileview = {
  displaychatbox: boolean;
};

const initialState: mobileview = {
  displaychatbox: false,
};

export const mobileSlice = createSlice({
  name: "mobileview",
  initialState,
  reducers: {
    setDisplayChatbox: (state, action: PayloadAction<boolean>) => {
      state.displaychatbox = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setDisplayChatbox } = mobileSlice.actions;

export default mobileSlice.reducer;
