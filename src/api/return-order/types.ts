export interface IRefundInfo {
  bankName: string;
  bankAccount: string;
  bankAccountName: string;
}

export interface IReturnItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface IReturnRequestPayload {
  orderId: string;
  email: string;
  type: 'RETURN' | 'EXCHANGE';
  reason: string;
  items: IReturnItem[];
  description?: string;
  refundInfo?: IRefundInfo;
}
