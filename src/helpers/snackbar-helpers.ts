import { IShowSnackBar, snackbarActions } from "@/db/snackbar-slice";
import { store } from "@/db/store";

export const showSnackbar = (payload: IShowSnackBar) => {
  store.dispatch(snackbarActions.showSnackbar(payload));
};

export const hideSnackbar = () => {
  store.dispatch(snackbarActions.hideSnackbar());
};
