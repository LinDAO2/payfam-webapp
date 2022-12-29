import { v4 as uuidv4 } from "uuid";
import { Dinero } from "dinero.js";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "@/configs/firebase";
// @ts-ignore
import referralCodeGenerator from "referral-code-generator";
import { TransactionCurrency } from "@/types/transaction-types";

export const deleteImageFromStorage = (folder: string, image: string) => {
  const imageRef = ref(storage, `${folder}/${image}`);
  return deleteObject(imageRef);
};

export const parseOptionWithMatch = (option: string, inputValue: string) => {
  if (option) {
    const _match = match(option, inputValue);
    const parts = parse(option, _match);
    return parts;
  }
  return [];
};

export function intlFormat(
  dineroObject: Dinero<number>,
  locale: string,
  options = {}
) {
  // function transformer({
  //   amount,
  //   currency,
  // }: {
  //   amount: number;
  //   currency: Currency<number>;
  // }) {
  //   return amount.toLocaleString(locale, {
  //     ...options,
  //     style: "currency",
  //     currency: currency.code,
  //   });
  // }

  // return toFormat(dineroObject, transformer);
  return;
}

export const stringToArray = (str: string) => {
  const _noSpace = str.toLowerCase().replace(/\s/g, "");
  const _stringToArray = Array.from(_noSpace);
  const _unique = Array.from(new Set(_stringToArray.map((item) => item)));
  // const _unique = uniq(_stringToArray)
  return _unique;
};

export const stringToArrayWithDuplicate = (str: string) => {
  const _noSpace = str.toLowerCase().replace(/\s/g, "");
  const _stringToArray = Array.from(_noSpace);
  return _stringToArray;
};

export const convertToPermalink = (sentence: string) => {
  const result_transform_to_lowercase = sentence
    .toLowerCase()
    .split(" ")
    .join("-");
  return result_transform_to_lowercase;
};
export const convertPermalinkToSentence = (sentence: string) => {
  const result_transform_to_lowercase = sentence.split("-").join(" ");
  return result_transform_to_lowercase;
};

export const convertToPlainName = (sentence: string) => {
  const result_transform_to_lowercase = sentence
    .toLowerCase()
    .split(" ")
    .join(" ")
    .replace(/\W/g, "");

  return result_transform_to_lowercase;
};

export const reloadPage = () => {
  setTimeout(() => {
    window.location.reload();
  }, 500);
};

export const generateCheckoutTransactionId = () => {
  const ortxid = referralCodeGenerator.custom("uppercase", 6, 10, "ORTXIDE");
  return ortxid;
};
export const generateTransactionId = (prefix: string) => {
  const ortxid = referralCodeGenerator.custom("uppercase", 3, 6, prefix);
  return ortxid;
};
export const generateCouponCode = () => {
  const ortxid = referralCodeGenerator.custom("uppercase", 3, 6, "EKIO");
  return ortxid;
};
export const generateRedeptionCode = () => {
  const ortxid = referralCodeGenerator.alpha("lowercase", 6);
  return ortxid;
};

export const generateUUIDV4 = () => {
  return uuidv4();
};

export const customMathFloor = (value: number) => {
  return Math.floor(value * 100) / 100;
};

export const setToLocalStorage = (key: string, value: any) => {
  if (key && typeof key === "string") {
    typeof value === "object"
      ? localStorage.setItem(key, JSON.stringify(value))
      : localStorage.setItem(key, value);
  }
};
export const getToLocalStorage = (key: string) => {
  if (key && typeof key === "string") {
    try {
      const val: any = localStorage.getItem(`${key}`);

      return typeof val === "object" ? JSON.parse(val) : val;
    } catch {
      return localStorage.getItem(key);
    }
  } else throw new Error("Invalid key");
};

export const numberWithCommas = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const compactNumber = (value: number) => {
  const suffixes = ["", "k", "m", "b", "t"];
  const suffixNum = Math.floor(("" + value).length / 3);

  let shortvalue = parseFloat(
    (suffixNum !== 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(2)
  );

  if (shortvalue % 1 !== 0) {
    shortvalue = parseFloat(shortvalue.toFixed(1));
  }
  return shortvalue + suffixes[suffixNum];
};

const THOUSAND = 1000;

export const numberFormatter = (value: number) => {
  return value < THOUSAND ? numberWithCommas(value) : compactNumber(value);
};
// type numberQuotients = {
//   quotient: number;
//   remainder: number;
//   quotientBase: number;
//   val: number;
// };
export const getNumberSuffix = (value: number) => {
  const suffixes = ["", "k", "m", "b", "t"];
  const suffixNum = Math.floor(("" + value).length / 3);

  // //get quotient function
  // const _valueAsString = value.toString();
  // const _lengthOfValue = value.toString().length;
  // const _biggestQuotientBase = 10 ** _lengthOfValue - 1;
  // const _valueToArray = stringToArrayWithDuplicate(_valueAsString);

  // const _result: numberQuotients[] = [];

  // for (let _index = 0; _index < _valueToArray.length; _index++) {
  //   const element = _valueToArray[_index];

  //   const _quotientBase = 10 ** _lengthOfValue - _index;

  //   const _resultVal = {
  //     quotient: parseInt(element),
  //     remainder: 0,
  //     quotientBase: _quotientBase,
  //     val: parseInt(element),
  //   };
  //   _result.push(_resultVal);
  // }

  // console.log("value", value);
  // console.log("_result", _result);

  return suffixes[suffixNum];
};
export const getNumberWholeBySuffix = (value: number) => {
  const suffixes = ["", "k", "m", "b", "t"];
  const suffixNum = Math.floor(("" + value).length / 3);
  return suffixes[suffixNum];
};

export const randomizeArray = (
  array: unknown[],
  randomArrLength: number = array.length
): unknown[] => {
  let length = randomArrLength || array.length;
  let range = array.length;
  let randomizedArray: unknown[] = [];
  let indexArray: number[] = [];
  while (indexArray.length < length) {
    let randomIndex = Math.floor(Math.random() * range);
    if (!indexArray.includes(randomIndex)) indexArray.push(randomIndex);
  }
  indexArray.forEach((el, id) => {
    randomizedArray[id] = array[el];
  });
  return randomizedArray;
};

export const calculateAmountFromDiscount = ({
  amount,
  discount,
  result = "discount-from-amount",
}: {
  amount: number;
  discount: number;
  result: "discount-from-amount" | "discount-amount-only";
}) => {
  if (result === "discount-from-amount") {
    return amount - amount * (discount / 100);
  }
  if (result === "discount-amount-only") {
    return (discount / 100) * amount;
  }
  return amount;
};

export function roundUpNearest10(num: number) {
  return Math.ceil(num);
}

export const getConvertedAount = async (
  from: TransactionCurrency,
  to: TransactionCurrency,
  amount: number
): Promise<number> => {
  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/729f2602f77e1a6611e6b39f/latest/${from}`
    );
    const data: any = await response.json();
    let rate = data?.conversion_rates[to];
    let total = rate * amount;
    return total;
  } catch (error) {
    console.log(error);

    return 0;
  }
};
