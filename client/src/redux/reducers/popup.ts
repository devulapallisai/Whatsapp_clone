// State management of popups in the application
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type chat = {
  pic: string;
  email: string;
  closeornot: boolean;
  type: string;
  name: string;
};

const initialState: chat = {
  pic: "",
  email: "",
  closeornot: false,
  type: "chat",
  name: "",
};

export const popupSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    setPic: (state, action: PayloadAction<string>) => {
      state.pic = action.payload;
    },
    setEmailmodal: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setname: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setcloseornot: (state, action: PayloadAction<boolean>) => {
      state.closeornot = action.payload;
    },
    setType: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setPic, setEmailmodal, setcloseornot, setType, setname } =
  popupSlice.actions;

export default popupSlice.reducer;
