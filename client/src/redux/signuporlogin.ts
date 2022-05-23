import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface initial {
  signuporlogin: Boolean;
  username: string;
  password: string;
  email: string;
  snackbaropen: Boolean;
  snackbarMessage: string;
  snackbarmode: string;
}

const initialState: initial = {
  signuporlogin: false,
  username: "",
  password: "",
  email: "",
  snackbaropen: false,
  snackbarMessage: "",
  snackbarmode: "",
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

    setemail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setsnackbarclose: (state, action: PayloadAction<Boolean>) => {
      state.snackbaropen = action.payload;
    },
    setsnackbarMessage: (state, action: PayloadAction<string>) => {
      state.snackbarMessage = action.payload;
    },
    setsnackbarmode: (state, action: PayloadAction<string>) => {
      state.snackbarmode = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setsignuporlogin,
  setpassword,
  setusername,
  setemail,
  setsnackbarclose,
  setsnackbarMessage,
  setsnackbarmode,
} = signuporloginSlice.actions;

export default signuporloginSlice.reducer;
