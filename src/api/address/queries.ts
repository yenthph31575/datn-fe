import { createMutation, createQuery } from 'react-query-kit';
import { createAddress, deleteAddress, getAddressById, getUserAddresses, setDefaultAddress, updateAddress } from './requests';
import type { IAddress, IAddressQuery, ICreateAddressRequest, IUpdateAddressRequest } from './types';

export const useUserAddressesQuery = createQuery<IAddress[], Partial<IAddressQuery>>({
  queryKey: ['user/addresses'],
  fetcher: (params) => getUserAddresses(params),
});

export const useAddressByIdQuery = createQuery<IAddress, string>({
  queryKey: ['user/address'],
  fetcher: (addressId) => getAddressById(addressId),
});

export const useCreateAddressMutation = createMutation<IAddress, ICreateAddressRequest>({
  mutationKey: ['user/address/create'],
  mutationFn: (data) => createAddress(data),
});

export const useUpdateAddressMutation = createMutation<IAddress, IUpdateAddressRequest>({
  mutationKey: ['user/address/update'],
  mutationFn: (data) => updateAddress(data),
});

export const useDeleteAddressMutation = createMutation<boolean, string>({
  mutationKey: ['user/address/delete'],
  mutationFn: (addressId) => deleteAddress(addressId),
});

export const useSetDefaultAddressMutation = createMutation<IAddress, string>({
  mutationKey: ['user/address/set-default'],
  mutationFn: (addressId) => setDefaultAddress(addressId),
});
