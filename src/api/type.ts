export interface BaseResponse {
  meta: {
    code: number | string;
    message: string;
    errors: string | { [key: string]: string[] };
  };
}

export interface BasePagination {
  limit: number;
  page: number;
}
