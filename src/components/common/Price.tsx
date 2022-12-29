import { dinero, convert } from "dinero.js";
import { NGN, USD, GBP, CAD, EUR, ZAR } from "@dinero.js/currencies";
import { intlFormat } from "@/utils/funcs";
import { useGlobal } from "@/hooks/app-hooks";

interface Props {
  amount: number;
}
const Price = ({ amount }: Props) => {
  const currency = useGlobal().currency;

  const getCurrency = (_currency: string) => {
    switch (_currency) {
      case "USD":
        return USD;
      case "EUR":
        return EUR;
      case "GBP":
        return GBP;
      case "CAD":
        return CAD;
      case "ZAR":
        return ZAR;
      default:
        return USD;
    }
  };
  const rates = {
    USD: { amount: 24, scale: 4 },
    EUR: { amount: 24, scale: 4 },
    GBP: { amount: 20, scale: 4 },
    CAD: { amount: 31, scale: 4 },
    ZAR: { amount: 40, scale: 3 },
  };
  const d = dinero({
    amount: amount !== undefined ? Math.floor(amount) : 100,
    currency: NGN,
    scale: 0,
  });
  const _dAmount = convert(d, getCurrency(currency), rates);

  return (
    <>
      {currency === "NGN"
        ? intlFormat(d, "en-NG")
        : intlFormat(_dAmount, "en-NG")}
    </>
  );
};

export default Price;
