export interface IVoucher {
  _id: string;
  code: string;
  name: string;
  description: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minOrderValue: number;
  maxDiscountValue: number;
  usageLimit: number;
  usageCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  createdAt: string;
  updatedAt: string;
}

export interface IVoucherResponse {
  items: IVoucher[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IVoucherQuery {
  page: number;
  limit: number;
  status?: string;
  search?: string;
}

export interface IVerifyVoucherRequest {
  code: string;
  orderAmount: number;
}

export interface IVerifyVoucherResponse {
  valid: boolean;
  voucher?: IVoucher;
  discountAmount: number;
}
