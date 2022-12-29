export type queryStatus = "success" | "error";

export type DocQueryResponse<S> = {
  status: queryStatus;
  errorMessage?: string;
  item?: S;
  loading?: boolean;
};
export type listQueryResponse<S> = {
  status: queryStatus;
  errorMessage: string;
  list: S[];
  loading: boolean;
};

export type listQueryAsyncResponse<S> = {
  status: queryStatus;
  errorMessage: string;
  list: S[];
  lastDoc?: any;
  loading?: boolean;
  isEmpty?: boolean;
};

export type mutationResponse = {
  status: queryStatus;
  errorMessage: string;
  successMessage: string;
  data?: any;
};
export type countResponse = {
  status: queryStatus;
  errorMessage: string;
  count: number;
};

export interface IResponse {
  status: string;
  errorMessage: string;
  list: any[];
  loading: boolean;
}

export interface IUpdateArgs {
  id: string;
  userId: string;
  title: string;
}
