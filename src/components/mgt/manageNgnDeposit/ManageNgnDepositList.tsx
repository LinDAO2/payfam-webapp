import EmptyList from "@/components/common/EmptyList";
import { useCollection } from "@/hooks/app-hooks";
import { generateUUIDV4 } from "@/utils/funcs";
import { Box } from "@mui/material";
import ManageNgnDepositListItem from "./ManageNgnDepositListItem";


const ManageNgnDepositList = () => {
  const collectionState = useCollection();

  if (collectionState.isLoading) return <p>Loading...</p>;
  if (collectionState.status === "error")
    return <EmptyList title={"An error occured"} caption="." />;
  return (
    <div>
      <Box sx={{ px: 1 }}>
        {collectionState.status === "success" &&
          collectionState.all.count > 0 &&
          collectionState.all.list.map((transaction) => (
            <ManageNgnDepositListItem
              transaction={transaction}
              key={generateUUIDV4()}
            />
          ))}
      </Box>
      {/* {collectionState.status === "success" &&
        collectionState.all.count > 0 && (
          <WalletLoadMoreBtn persona={persona} userId={userId} />
        )} */}

      {collectionState.status === "success" &&
        collectionState.all.count === 0 && (
          <EmptyList title="No transactions yet" caption="." />
        )}
    </div>
  );
}

export default ManageNgnDepositList