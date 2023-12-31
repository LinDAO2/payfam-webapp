import EmptyList from "@/components/common/EmptyList";
import LoadingScreen from "@/components/common/LoadingScreen";
import ManageNgnDepositContainer from "@/components/mgt/manageNgnDeposit/ManageNgnDepositContainer";
import { collectionActions } from "@/db/collection-slice";
import { store } from "@/db/store";
import { setPageState, setShowLoadMoreBtn } from "@/helpers/collection-helpers";
import { showSnackbar } from "@/helpers/snackbar-helpers";
import { useCollection } from "@/hooks/app-hooks";
import { collectionServices } from "@/services/root";
import { useEffect } from "react";

const ManageNgnDeposits = () => {
  const collectionState = useCollection();

  useEffect(() => {
    (async () => {
      store.dispatch(collectionActions.setCollectionStateIsLoading(true));
      const { status, list, lastDoc, errorMessage, isEmpty } =
        await collectionServices.getAllDocs("NGNDeposits", 100, "desc");
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

  return <ManageNgnDepositContainer />;
};

export default ManageNgnDeposits;
