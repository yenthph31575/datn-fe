import { z } from 'zod';

export const shippingSchema = z.object({
  fullName: z.string().min(1, 'Vui lòng nhập họ và tên'),
  phone: z.string().min(1, 'Vui lòng nhập số điện thoại'),
  addressLine1: z.string().min(1, 'vui lòng nhập địa chỉ giao hàng'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'vui lòng nhập thành phố'),
  district: z.string().min(1, 'vui lòng nhập quận/huyện'),
  ward: z.string().min(1, 'vui lòng nhập phường/xã'),
  postalCode: z.string().min(1, 'vui lòng nhập mã bưu chính'),
  isDefault: z.boolean().optional(),
});

export const orderItemSchema = z.object({
  productId: z.string().min(1, 'vui lòng nhập Product ID'),
  variantId: z.string().min(1, 'vui lòng nhập Variant ID'),
  quantity: z.number().int().positive('Số lượng phải là số nguyên dương'),
});

export const paymentSchema = z.object({
  paymentMethod: z.enum(['CASH_ON_DELIVERY', 'ONLINE_PAYMENT'], {
    errorMap: () => ({ message: 'Vui lòng chọn phương thức thanh toán' }),
  }),
});

export const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  paymentMethod: z.enum(['CASH_ON_DELIVERY', 'ONLINE_PAYMENT'], {
    errorMap: () => ({ message: 'Vui lòng chọn phương thức thanh toán' }),
  }),
  shippingAddress: shippingSchema,
  voucherId: z.string().optional(),
});

export type ShippingSchema = z.infer<typeof shippingSchema>;
export type OrderItemSchema = z.infer<typeof orderItemSchema>;
export type PaymentSchema = z.infer<typeof paymentSchema>;
export type OrderSchema = z.infer<typeof orderSchema>;
