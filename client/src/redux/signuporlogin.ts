import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface initial {
  signuporlogin: Boolean;
  username: string;
  password: string;
}

const initialState: initial = {
  signuporlogin: false,
  username: "",
  password: "",
};

export const signuporloginSlice = createSlice({
  name: "signuporlogin",
  initialState,
  reducers: {
    setsignuporlogin: (state) => {
      state.signuporlogin = !state.signuporlogin;
    },
    setusername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setpassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setsignuporlogin, setpassword, setusername } =
  signuporloginSlice.actions;

export default signuporloginSlice.reducer;
