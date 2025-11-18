import client from '../axios';
import type { IAddress, IAddressQuery, ICreateAddressRequest, IUpdateAddressRequest } from './types';

export const getUserAddresses = async (params?: Partial<IAddressQuery>): Promise<IAddress[]> => {
  const { data } = await client({
    url: '/api/user/addresses',
    method: 'GET',
    params,
  });
  return data?.data;
};

export const getAddressById = async (addressId: string): Promise<IAddress> => {
  const { data } = await client({
    url: `/api/user/addresses/${addressId}`,
    method: 'GET',
  });
  return data?.data;
};

export const createAddress = async (addressData: ICreateAddressRequest): Promise<IAddress> => {
  const { data } = await client({
    url: '/api/user/addresses',
    method: 'POST',
    data: addressData,
  });
  return data?.data;
};

export const updateAddress = async ({ addressId, ...updateData }: IUpdateAddressRequest): Promise<IAddress> => {
  const { data } = await client({
    url: `/api/user/addresses/${addressId}`,
    method: 'PUT',
    data: updateData,
  });
  return data?.data;
};

export const deleteAddress = async (addressId: string): Promise<boolean> => {
  const { data } = await client({
    url: `/api/user/addresses/${addressId}`,
    method: 'DELETE',
  });
  return data?.success || false;
};

export const setDefaultAddress = async (addressId: string): Promise<IAddress> => {
  const { data } = await client({
    url: `/api/user/addresses/${addressId}/default`,
    method: 'POST',
  });
  return data?.data;
};
