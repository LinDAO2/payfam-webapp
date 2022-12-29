import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ISnackBarState {
  status: "success" | "error" | "warning" | "info";
  msg: string;
  openSnackbar: boolean;
}

export interface IShowSnackBar extends ISnackBarState {}

const initialState: ISnackBarState = {
  status: "success",
  msg: "",
  openSnackbar: false,
};

export const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    showSnackbar: (state, action: PayloadAction<IShowSnackBar>) => {
      state = action.payload;
      return state;
    },
    hideSnackbar: (state) => {
      state.openSnackbar = false;
      return state;
    },
  },
});

export const snackbarName = snackbarSlice.name;
export const snackbarActions = snackbarSlice.actions;
export const snackbarReducer = snackbarSlice.reducer;
