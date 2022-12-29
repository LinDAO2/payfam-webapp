import { useAppSelector } from "./db-hooks";

export const useGlobal = () => {
  return useAppSelector((state) => state.global);
};

export const useSnackbar = () => {
  return useAppSelector((state) => state.snackbar);
};

export const useSession = () => {
  return useAppSelector((state) => state.session);
};

export const useCollection = () => {
  return useAppSelector((state) => state.collection);
};
