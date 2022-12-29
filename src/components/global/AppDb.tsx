import { store } from "@/db/store";
import type { ReactNode } from "react";
import { Provider } from "react-redux";
import AppAuth from "./AppAuth";
import Snackbar from "./AppSnackbar";

type Props = {
  children: ReactNode;
};

const AppDb = ({ children }: Props) => {
  return (
    <Provider store={store}>
      <AppAuth>
        <Snackbar>{children}</Snackbar>
      </AppAuth>
    </Provider>
  );
};

export default AppDb;
