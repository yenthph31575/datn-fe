import { createMutation, createQuery } from 'react-query-kit';
import { checkIsFavorite, deleteFavoriteProduct, getFavoriteProducts, toggleFavoriteProduct } from './requests';
import type { IProductFavorite, IProductFavoriteQuery, IProductFavoriteResponse, IToggleFavoriteRequest } from './types';

export const useFavoriteProductsQuery = createQuery<IProductFavoriteResponse, Partial<IProductFavoriteQuery>>({
  queryKey: ['favorites'],
  fetcher: (params) => getFavoriteProducts(params),
});

export const useToggleFavoriteMutation = createMutation<IProductFavorite, IToggleFavoriteRequest>({
  mutationKey: ['favorites/toggle'],
  mutationFn: (data) => toggleFavoriteProduct(data),
});

export const useDeleteFavoriteMutation = createMutation<boolean, string>({
  mutationKey: ['favorites/delete'],
  mutationFn: (favoriteId) => deleteFavoriteProduct(favoriteId),
});

export const useCheckIsFavoriteQuery = createQuery<boolean, string>({
  queryKey: ['favorites/check'],
  fetcher: (productId) => checkIsFavorite(productId),
});
