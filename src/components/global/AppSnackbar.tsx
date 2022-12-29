import { ISnackBarState } from "@/db/snackbar-slice";
import { hideSnackbar } from "@/helpers/snackbar-helpers";
import { useSnackbar } from "@/hooks/app-hooks";
import type { ReactNode } from "react";
import SnackBar from "../common/SnackBar";

type props = {
  children: ReactNode;
};

const AppSnackBar = ({ children }: props) => {
  const snackbar = useSnackbar() as ISnackBarState;
  return (
    <>
      <SnackBar
        open={snackbar.openSnackbar}
        close={() => {
          hideSnackbar();
        }}
        severity={snackbar.status}
        message={snackbar.msg}
      />

      {children}
    </>
  );
};

export default AppSnackBar;
