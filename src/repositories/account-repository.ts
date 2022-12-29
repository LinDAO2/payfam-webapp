import { db } from "@/configs/firebase";
import { doc, increment, setDoc } from "firebase/firestore";

class AccountRepository {
  updateNGNBalance(uid: string, amount: number): Promise<void> {
    const docRef = doc(db, "Users", uid);
    return setDoc(
      docRef,
      {
        ngnBalance: increment(amount),
      },
      {
        merge: true,
      }
    );
  }

  updateGHSBalance(uid: string, amount: number): Promise<void> {
    const docRef = doc(db, "Users", uid);
    return setDoc(
      docRef,
      {
        ghsBalance: increment(amount),
      },
      {
        merge: true,
      }
    );
  }

  updateUSDTBalance(uid: string, amount: number): Promise<void> {
    const docRef = doc(db, "Users", uid);
    return setDoc(
      docRef,
      {
        usdcBalance: increment(amount),
      },
      {
        merge: true,
      }
    );
  }
}

export default AccountRepository;
