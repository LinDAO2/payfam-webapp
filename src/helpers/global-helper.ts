import { globalActions } from "@/db/global-slice";
import { store } from "@/db/store";

export const setPageTitle = (title: string) => {
  store.dispatch(globalActions.setPageTitle(title));
};
