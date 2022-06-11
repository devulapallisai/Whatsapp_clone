// State management of messages in the application
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type user = {
  name: string;
  email: string;
  _id: string;
  pic: string;
};

interface userInfo extends user {
  createdAt: string;
  updatedAt: string;
}

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
  groupAdmin: userInfo;
};

type chat = {
  searchChat: string;
  loading: boolean;
  usersInfo: Array<userInfo> | [];
  usersnull: boolean;
  displayusers: boolean;
  chats: Array<Chatit> | [];
  Chatloading: boolean;
  singleChat: Chatit | null;
  _id: string;
};

type messagechats = {
  chat: Chatit;
  sender: user;
  content: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  _id: string;
};

type message = {
  message: string;
  messageChat: Array<messagechats> | null;
};

const initialState: message = {
  message: "",
  messageChat: null,
};

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setmessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    setmessagechats: (state, action: PayloadAction<Array<messagechats>>) => {
      state.messageChat = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setmessage, setmessagechats } = messageSlice.actions;

export default messageSlice.reducer;
