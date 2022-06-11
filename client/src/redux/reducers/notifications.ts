import { createSlice } from "@reduxjs/toolkit";

import { PayloadAction } from "@reduxjs/toolkit";

type userInfo = {
  name: string;
  email: string;
  _id: string;
  pic: string;
};
interface one extends userInfo {
  createdAt: string;
  // token: string;
  updatedAt: string;
}
interface Chatarray extends userInfo {
  __v: number;
  createdAt: string;
  // token: string;
  updatedAt: string;
}

type another = {
  name: string;
  email: string;
  _id: string;
  pic: string;
  createdAt: string;
  // token: string;
  updatedAt: string;
};
type Chatit = {
  createdAt: string;
  updatedAt: string;
  chatName: string;
  _id: string;
  isGroupchat: boolean;
  grpImage: string;
  __v: number;
  users: Array<Chatarray>;
  groupAdmin: another;
};

type chat = {
  searchChat: string;
  loading: boolean;
  usersInfo: Array<one> | [];
  usersnull: boolean;
  displayusers: boolean;
  chats: Array<Chatit> | [];
  Chatloading: boolean;
  singleChat: Chatit | null;
  _id: string;
};

type user = {
  name: string;
  email: string;
  _id: string;
  pic: string;
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

type statetype = {
  notifications: Array<messagechats> | null;
};

const initialState: statetype = {
  notifications: null,
};

const notifSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Array<messagechats>>) => {
      state.notifications = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setNotifications } = notifSlice.actions;

export default notifSlice.reducer;
