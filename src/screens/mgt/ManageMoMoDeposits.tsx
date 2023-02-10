import EmptyList from "@/components/common/EmptyList";
import LoadingScreen from "@/components/common/LoadingScreen";
import ManageMoMoDepositsContainer from "@/components/mgt/manageMomodeposit/ManageMoMoDepositsContainer";
import { collectionActions } from "@/db/collection-slice";
import { store } from "@/db/store";
import {
  setPageState,
  setShowLoadMoreBtn,
} from "@/helpers/collection-helpers";
import { showSnackbar } from "@/helpers/snackbar-helpers";
import { useCollection } from "@/hooks/app-hooks";
import { collectionServices } from "@/services/root";
import { useEffect } from "react";

const ManageMoMoDeposits = () => {
  const collectionState = useCollection();

  useEffect(() => {
    (async () => {
      store.dispatch(collectionActions.setCollectionStateIsLoading(true));
      const { status, list, lastDoc, errorMessage, isEmpty } =
        await collectionServices.getAllDocs("MomoDeposits", 100, "asc");
      store.dispatch(collectionActions.setCollectionStateIsLoading(false));
      if (status === "success") {
        store.dispatch(
          collectionActions.setCollection({
            all: {
              count: list.length,
              list,
            },
            view: {
              count: list.length,
              list,
              title: "",
            },
            lastDoc: lastDoc,
          })
        );

        store.dispatch(collectionActions.setCollectionStateSuccessStatus());
      }
      if (isEmpty !== undefined) {
        store.dispatch(collectionActions.setCollectionStateIsEmpty(isEmpty));
      }

      if (status === "error") {
        store.dispatch(collectionActions.setCollectionStateErrorStatus());
        showSnackbar({ status, msg: errorMessage, openSnackbar: true });
      }

      setPageState("mgt");
      setShowLoadMoreBtn(true);
    })();
  }, []);

  if (collectionState.isLoading) return <LoadingScreen />;
  if (collectionState.status === "error")
    return <EmptyList title={"An error occured"} caption="." />;

  return <ManageMoMoDepositsContainer />;
};

export default ManageMoMoDeposits;
