import EmptyList from "@/components/common/EmptyList";
import LoadingScreen from "@/components/common/LoadingScreen";
import ManageMoMoDepositsContainer from "@/components/mgt/manageMomodeposit/ManageMoMoDepositsContainer";
import {
  getAllDocs,
  setPageState,
  setShowLoadMoreBtn,
} from "@/helpers/collection-helpers";
import { useCollection } from "@/hooks/app-hooks";
import { useEffect } from "react";

const ManageMoMoDeposits = () => {
  const collectionState = useCollection();

  useEffect(() => {
    (async () => {
      await getAllDocs("MomoDeposits");

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
