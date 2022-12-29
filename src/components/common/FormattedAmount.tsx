import { dinero } from "dinero.js";
import { NGN } from "@dinero.js/currencies";
import { intlFormat } from "@/utils/funcs";

interface Props {
  amount: number;
}
const FormattedAmount = ({ amount }: Props) => {
  const d = dinero({
    amount: amount !== undefined ? Math.floor(amount) : 100,
    currency: NGN,
    scale: 0,
  });

  return <>{intlFormat(d, "en-NG")}</>;
};

export default FormattedAmount;
