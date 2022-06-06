import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type userInfo = {
  name: string;
  email: string;
  _id: string;
  pic: string;
  createdAt: string;
  updatedAt: string;
};

interface Chatarray extends userInfo {
  __v: number;
}

type Chatit = {
  createdAt: string;
  updatedAt: string;
  chatName: string;
  _id: string;
  isGroupchat: boolean;
  grpImage: string;
  __v: number;
  users: Array<Chatarray>;
};

type chat = {
  searchChat: string;
  loading: boolean;
  usersInfo: Array<userInfo> | [];
  usersnull: boolean;
  displayusers: boolean;
  chats: Array<Chatit> | [];
  Chatloading: boolean;
};

const initialState: chat = {
  searchChat: "",
  loading: false,
  usersInfo: [],
  usersnull: false,
  displayusers: false,
  chats: [],
  Chatloading: true,
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
    setusersnull: (state, action: PayloadAction<boolean>) => {
      state.usersnull = action.payload;
    },
    setdisplayusers: (state, action: PayloadAction<boolean>) => {
      state.displayusers = action.payload;
    },
    setchats: (state, action: PayloadAction<Array<Chatit>>) => {
      state.chats = action.payload;
    },
    setChatloading: (state, action: PayloadAction<boolean>) => {
      state.Chatloading = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setsearchChat,
  setloading,
  setuserInfo,
  setusersnull,
  setdisplayusers,
  setchats,
  setChatloading,
} = chatSlice.actions;

export default chatSlice.reducer;
