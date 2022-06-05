// State management of group chat in the application
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type chat = {
  openornot: boolean;
  groupName: string;
  groupAdmin: string;
};

const initialState: chat = {
  openornot: false,
  groupAdmin: "",
  groupName: "",
};

export const groupchatSlice = createSlice({
  name: "groupchat",
  initialState,
  reducers: {
    setgroupName: (state, action: PayloadAction<string>) => {
      state.groupName = action.payload;
    },
    setgroupAdmin: (state, action: PayloadAction<string>) => {
      state.groupAdmin = action.payload;
    },
    setopenornot: (state, action: PayloadAction<boolean>) => {
      state.openornot = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setgroupAdmin, setopenornot, setgroupName } =
  groupchatSlice.actions;

export default groupchatSlice.reducer;
