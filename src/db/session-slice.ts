import { IAccountDocument } from "@/types/account";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Timestamp } from "firebase/firestore";
// import { Timestamp } from "firebase/firestore";

export interface ISessionState extends IAccountDocument {
  isLoaded: boolean;
  isEmpty: boolean;
  isLoading: boolean;
  reload: boolean,
}

export interface ISetProfile extends ISessionState {}

const initialState: ISessionState = {
  id: "",
  uid: "",
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  phonenumber: "",
  persona: "customer",
  query: [],
  status: "blocked",
  photo: { name: "", url: "" },
  defaultCurrency: "manual",
  isLoaded: false,
  isLoading: false,
  isEmpty: true,
  addedOn: Timestamp.now(),
  reload: false,
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    set: (state, action: PayloadAction<ISetProfile>) => {
      state = { ...action.payload };
      return state;
    },
    setIsLoaded: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setReload: (state, action: PayloadAction<boolean>) => {
      state.reload = action.payload;
      return state;
    },
    reset: (state) => {
      state = initialState;
      return state;
    },
  },
});

export const sessionName = sessionSlice.name;
export const sessionActions = sessionSlice.actions;
export const sessionReducer = sessionSlice.reducer;
