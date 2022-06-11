import { configureStore } from "@reduxjs/toolkit";
import signupReducer from "./reducers/signuporlogin";
import chatReducer from "./reducers/chat";
import popupReducer from "./reducers/popup";
import groupchatReducer from "./reducers/groupchat";
import mobileReducer from "./reducers/mobile";
import messageReducer from "./reducers/message";
import sockerReducer from "./reducers/scoket";
import notifReducer from "./reducers/notifications";
export const store = configureStore({
  reducer: {
    signuporlogin: signupReducer,
    chat: chatReducer,
    popup: popupReducer,
    groupchat: groupchatReducer,
    mobile: mobileReducer,
    message: messageReducer,
    socket: sockerReducer,
    notification: notifReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
