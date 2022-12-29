
import { IAccountPersona } from "@/types/account";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ICollectionState<T> {
  all: {
    count: number;
    list: T[];
  };
  view: {
    count: number;
    list: T[];
    title: string;
  };
  current?: T;
  lastDoc: any;
  isLoading: boolean;
  isEmpty: boolean;
  status: "success" | "error" | "";
  page?: IAccountPersona;
  isQueryLoading?: boolean;
  showLoadMoreBtn?: boolean;
  queryInput?: Record<"category", string>;
  tokenTransactionFilter: "all" | "success" | "pending" | "fail";
  usersFilter: IAccountPersona | "all";
}

export interface ISetCollection<T> {
  all: {
    count: number;
    list: T[];
  };
  view: {
    count: number;
    list: T[];
    title: string;
  };
  lastDoc: any;
}

const initialState: ICollectionState<any> = {
  all: {
    count: 0,
    list: [],
  },
  view: {
    count: 0,
    list: [],
    title: "",
  },
  current: {},
  lastDoc: {},
  isLoading: false,
  isEmpty: true,
  status: "",
  page: "customer",
  isQueryLoading: false,
  showLoadMoreBtn: true,
  queryInput: { category: "" },
  tokenTransactionFilter: "all",
  usersFilter: "all",
};

export const collectionSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {
    setCollection: (state, action: PayloadAction<ISetCollection<unknown>>) => {
      state.all = action.payload.all;
      state.view = action.payload.view;
      state.lastDoc = action.payload.lastDoc;
      return state;
    },
    setTokenTransactionFilter: (
      state,
      action: PayloadAction<"all" | "success" | "pending" | "fail">
    ) => {
      state.tokenTransactionFilter = action.payload;

      return state;
    },
    setUserFilter: (state, action: PayloadAction<IAccountPersona | "all">) => {
      state.usersFilter = action.payload;

      return state;
    },
    setViewList: (
      state,
      action: PayloadAction<Pick<ISetCollection<unknown>, "view">>
    ) => {
      state.view = action.payload.view;
      return state;
    },
    setCollectionStateIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      return state;
    },
    setCollectionStateErrorStatus: (state) => {
      state.status = "error";
      return state;
    },
    setCollectionStateSuccessStatus: (state) => {
      state.status = "success";
      return state;
    },

    setCollectionStateIsEmpty: (state, action: PayloadAction<boolean>) => {
      state.isEmpty = action.payload;
      return state;
    },
    setCollectionStateShowLoadMoreBtn: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.showLoadMoreBtn = action.payload;
      return state;
    },
    setCollectionStatePage: (state, action: PayloadAction<IAccountPersona>) => {
      state.page = action.payload;
      return state;
    },
    setCollectionStateCurrent: (state, action: PayloadAction<any>) => {
      state.current = action.payload;
      return state;
    },
    setCollectionFindElemInViewAndUpdate: (
      state,
      action: PayloadAction<Omit<ISetCollection<unknown>, "lastDoc">>
    ) => {
      state.all = action.payload.all;
      state.view = action.payload.view;
      return state;
    },
    setCollectionDuplicateUpdate: (
      state,
      action: PayloadAction<Omit<ISetCollection<unknown>, "lastDoc">>
    ) => {
      state.all = action.payload.all;
      state.view = action.payload.view;
      return state;
    },
    setCollectionDeleteUpdate: (
      state,
      action: PayloadAction<Omit<ISetCollection<unknown>, "lastDoc">>
    ) => {
      state.all = action.payload.all;
      state.view = action.payload.view;
      return state;
    },
    setCollectionQuery: (
      state,
      action: PayloadAction<{ queryInput: Record<"category", string> }>
    ) => {
      state.queryInput = action.payload.queryInput;
      return state;
    },
  },
});

export const collectionName = collectionSlice.name;
export const collectionActions = collectionSlice.actions;
export const collectionReducer = collectionSlice.reducer;
