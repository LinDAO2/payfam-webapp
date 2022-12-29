import { ReactElement, useCallback, useEffect } from "react";

type props = {
  children: ReactElement;
  isTrue: boolean;
  action?: () => void;
};
const RenderIf = ({ children, isTrue, action }: props) => {
  const actionCallback = useCallback(() => {
    if (isTrue === true && action) action();
  }, [isTrue, action]);

  useEffect(() => {
    actionCallback();
  }, [actionCallback]);

  return isTrue === true ? children : <></>;
};

export default RenderIf;
