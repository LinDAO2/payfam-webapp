import { configureStore } from "@reduxjs/toolkit";
import { sessionName, sessionReducer } from "./session-slice";
import { globalName, globalReducer } from "./global-slice";
import { snackbarName, snackbarReducer } from "./snackbar-slice";
import { collectionName, collectionReducer } from "./collection-slice";

export const store = configureStore({
  reducer: {
    [globalName]: globalReducer,
    [snackbarName]: snackbarReducer,
    [sessionName]: sessionReducer,
    [collectionName]: collectionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
