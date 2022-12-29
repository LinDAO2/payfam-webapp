import Spacer from "../common/Spacer";
import TransactionList from "../transactions/TransactionList";

const HomeTransactionSummary = () => {
  return (
    <div>
      <Spacer space={30} />
      <TransactionList />
    </div>
  );
};

export default HomeTransactionSummary;
