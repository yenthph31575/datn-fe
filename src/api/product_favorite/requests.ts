import client from '../axios';
import type { IProductFavorite, IProductFavoriteQuery, IProductFavoriteResponse, IToggleFavoriteRequest } from './types';

export const getFavoriteProducts = async (params: Partial<IProductFavoriteQuery>): Promise<IProductFavoriteResponse> => {
  const { data } = await client({
    url: '/api/favorites',
    method: 'GET',
    params,
  });
  return data?.data;
};

export const toggleFavoriteProduct = async (request: IToggleFavoriteRequest): Promise<IProductFavorite> => {
  const { data } = await client({
    url: '/api/favorites/toggle',
    method: 'POST',
    data: request,
  });
  return data?.data;
};

export const deleteFavoriteProduct = async (favoriteId: string): Promise<boolean> => {
  const { data } = await client({
    url: `/api/favorites/${favoriteId}`,
    method: 'DELETE',
  });
  return data?.success || false;
};

export const checkIsFavorite = async (productId: string): Promise<boolean> => {
  const { data } = await client({
    url: `/api/favorites/check/${productId}`,
    method: 'GET',
  });
  return data?.data?.isFavorite || false;
};
