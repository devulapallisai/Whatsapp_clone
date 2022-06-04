import { configureStore } from "@reduxjs/toolkit";
import signupReducer from "../redux/signuporlogin";
import chatReducer from "../redux/chat";
import popupReducer from "../redux/popup";
export const store = configureStore({
  reducer: {
    signuporlogin: signupReducer,
    chat: chatReducer,
    popup: popupReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
