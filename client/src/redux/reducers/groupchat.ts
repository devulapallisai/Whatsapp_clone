// State management of group chat in the application
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type userInfo = {
  name: string;
  email: string;
  _id: string;
  pic: string;
  createdAt: string;
  updatedAt: string;
};

type chat = {
  openornot: boolean;
  groupName: string;
  groupusers: Array<userInfo> | [];
  pic: string;
  loading: boolean;
  closeornot: boolean;
};

const initialState: chat = {
  openornot: false,
  groupName: "",
  groupusers: [],
  pic: "",
  loading: false,
  closeornot: false,
};

export const groupchatSlice = createSlice({
  name: "groupchat",
  initialState,
  reducers: {
    setgroupName: (state, action: PayloadAction<string>) => {
      state.groupName = action.payload;
    },
    setopenornot: (state, action: PayloadAction<boolean>) => {
      state.openornot = action.payload;
    },
    setgroupusers: (state, action: PayloadAction<Array<userInfo>>) => {
      state.groupusers = action.payload;
    },
    setpic: (state, action: PayloadAction<string>) => {
      state.pic = action.payload;
    },
    setloading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setcloseornotremove: (state, action: PayloadAction<boolean>) => {
      state.closeornot = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setopenornot,
  setgroupName,
  setgroupusers,
  setloading,
  setpic,
  setcloseornotremove,
} = groupchatSlice.actions;

export default groupchatSlice.reducer;
