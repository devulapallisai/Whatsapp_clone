import { configureStore } from "@reduxjs/toolkit";
import signupReducer from "../redux/signuporlogin";
import chatReducer from "../redux/chat";
export const store = configureStore({
  reducer: {
    signuporlogin: signupReducer,
    chat: chatReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
