import { ISetProfile, sessionActions } from "@/db/session-slice";
import { store } from "@/db/store";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/configs/firebase";

export const setProfile = (payload: ISetProfile) => {
  store.dispatch(sessionActions.set(payload));
};

export const setLoadingProfile = (payload: boolean) => {
  store.dispatch(sessionActions.setIsLoaded(payload));
};

export const resetProfile = () => {
  store.dispatch(sessionActions.reset());
};

export function setUpRecaptha(number: string) {
  const recaptchaVerifier = new RecaptchaVerifier(
    "recaptcha-container",
    {},
    auth
  );
  recaptchaVerifier.render();
  return signInWithPhoneNumber(auth, number, recaptchaVerifier);
}
