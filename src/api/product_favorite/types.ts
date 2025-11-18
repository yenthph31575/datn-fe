import type { IProduct } from '../product/types';
import type { IMetaResponse, ITableQuery } from '../../types';

export interface IProductFavoriteQuery extends ITableQuery {}

export interface IProductFavorite {
  _id: string;
  userId: string;
  productId: string;
  product: IProduct;
  createdAt: string;
  updatedAt: string;
}

export interface IProductFavoriteResponse {
  items: IProductFavorite[];
  meta: IMetaResponse;
}

export interface IToggleFavoriteRequest {
  productId: string;
}
