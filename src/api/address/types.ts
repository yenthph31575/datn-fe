export interface IAddress {
  _id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  ward: string;
  postalCode: string;
  isDefault: boolean;
}

export interface IAddressQuery {
  search?: string;
}

export interface ICreateAddressRequest {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  ward: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface IUpdateAddressRequest extends Partial<ICreateAddressRequest> {
  addressId: string;
}
