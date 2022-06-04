import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type userInfo = {
  token: string;
  name: string;
  email: string;
  _id: string;
  pic: string;
  createdAt: string;
  updatedAt: string;
};

type chat = {
  searchChat: string;
  loading: boolean;
  usersInfo: Array<userInfo> | [];
};

const initialState: chat = {
  searchChat: "",
  loading: false,
  usersInfo: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setsearchChat: (state, action: PayloadAction<string>) => {
      state.searchChat = action.payload;
    },
    setloading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setuserInfo: (state, action: PayloadAction<Array<userInfo>>) => {
      state.usersInfo = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setsearchChat, setloading, setuserInfo } = chatSlice.actions;

export default chatSlice.reducer;
