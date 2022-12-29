export interface IImage {
  name: string;
  url: string;
}

export interface IImageUploadProgess {
  title: string;
  name: string;
  progress: number;
  url: string;
}

export type ICURRENCIES = "NGN" | "USD" | "EUR" | "GBP" | "CAD" | "ZAR";
