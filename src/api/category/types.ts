import type { IMetaResponse, ITableQuery } from './../../types/index';

export interface ICategoryQuery extends ITableQuery {}

export interface ICategory {
  _id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export interface ICategoryResponse {
  items: ICategory[];
  meta: IMetaResponse;
}
