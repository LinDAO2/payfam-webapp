import { ICURRENCIES } from "@/types/global-types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface IGlobalState {
  pageTitle: string;
  currency: ICURRENCIES;
}

export interface IShowGlobal extends IGlobalState {}

const initialState: IGlobalState = {
  pageTitle: "",
  currency: "NGN",
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setPageTitle: (state, action: PayloadAction<string>) => {
      state.pageTitle = action.payload;
    },
    setCurrency: (state, action: PayloadAction<ICURRENCIES>) => {
      state.currency = action.payload;
    },
  },
});

export const globalName = globalSlice.name;
export const globalActions = globalSlice.actions;
export const globalReducer = globalSlice.reducer;
