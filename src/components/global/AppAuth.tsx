import { ReactNode, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/configs/firebase";
import {
  resetProfile,
  setLoadingProfile,
  setProfile,
} from "@/helpers/session-helpers";

import { collectionServices } from "@/services/root";
import { IAccountDocument } from "@/types/account";
import { Timestamp } from "firebase/firestore";
import { useSession } from "@/hooks/app-hooks";

// declare global {
//   interface Window {
//     recaptchaVerifier: RecaptchaVerifier;
//   }
// }

type props = {
  children: ReactNode;
};
const AppAuth = ({ children }: props) => {
  const profileReload = useSession().reload;

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // User is signed in
        setLoadingProfile(true);
        if (currentUser.uid !== undefined) {
          const { status, item } = await collectionServices.getDoc(
            "Users",
            currentUser.uid
          );

          if (status === "success") {
            if (item) {
              const data = item as Omit<IAccountDocument, "uid">;

              const profile: IAccountDocument & {
                isLoaded: boolean;
                isEmpty: boolean;
                isLoading: boolean;
                reload: boolean;
              } = {
                id: currentUser.uid,
                uid: currentUser.uid,
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                email: data.email,
                phonenumber: data.phonenumber,
                persona: data.persona,
                photo: data.photo ? data.photo : { name: "", url: "" },
                status: data.status,
                query: data.query,
                defaultCurrency: data?.defaultCurrency
                  ? data?.defaultCurrency
                  : "manual",
                bankAccount: data?.bankAccount ? data?.bankAccount : undefined,
                mobileMoneyAccount: data?.mobileMoneyAccount
                  ? data?.mobileMoneyAccount
                  : undefined,
                momoPhoneNumber: data?.momoPhoneNumber
                  ? data?.momoPhoneNumber
                  : undefined,
                ngnBalance: data?.ngnBalance ? data?.ngnBalance : 0,
                ghsBalance: data?.ghsBalance ? data?.ghsBalance : 0,
                usdcBalance: data?.usdcBalance ? data?.usdcBalance : 0,
                addedOn: Timestamp.now(),
                isLoaded: true,
                isEmpty: false,
                isLoading: false,
                reload: false,
              };
              setProfile(profile);
              setLoadingProfile(false);
            } else {
              setLoadingProfile(false);
            }
          }
        }
      } else {
        // User is signed out
        resetProfile();
      }
    });
    return subscriber; // unsubscribe on unmount
  }, [profileReload]);
  return <>{children}</>;
};

export default AppAuth;
