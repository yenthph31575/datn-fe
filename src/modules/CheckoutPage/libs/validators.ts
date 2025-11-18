import { z } from 'zod';

export const shippingSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  district: z.string().min(1, 'District is required'),
  ward: z.string().min(1, 'Ward is required'),
  postalCode: z.string().min(1, 'Zip code is required'),
  isDefault: z.boolean().optional(),
});

export const orderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.string().min(1, 'Variant ID is required'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
});

export const paymentSchema = z.object({
  paymentMethod: z.enum(['CASH_ON_DELIVERY', 'ONLINE_PAYMENT'], {
    errorMap: () => ({ message: 'Payment method is required' }),
  }),
});

export const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  paymentMethod: z.enum(['CASH_ON_DELIVERY', 'ONLINE_PAYMENT'], {
    errorMap: () => ({ message: 'Payment method is required' }),
  }),
  shippingAddress: shippingSchema,
  voucherId: z.string().optional(),
});

export type ShippingSchema = z.infer<typeof shippingSchema>;
export type OrderItemSchema = z.infer<typeof orderItemSchema>;
export type PaymentSchema = z.infer<typeof paymentSchema>;
export type OrderSchema = z.infer<typeof orderSchema>;
