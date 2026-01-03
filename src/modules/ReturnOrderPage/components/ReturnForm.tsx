'use client';

import type { IOrder } from '@/api/order/types';
import { createReturnRequest } from '@/api/return-order/requests';
import type { IReturnRequestPayload } from '@/api/return-order/types';
import { TextField } from '@/components/form';
import { SelectCustomField } from '@/components/form/SelectCustomField';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormWrapper } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { formatNumber } from '@/libs/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';

const returnFormSchema = z
  .object({
    type: z.enum(['RETURN', 'EXCHANGE'], {
      required_error: 'Vui lòng chọn phương án xử lý',
    }),
    reason: z.string().min(1, 'Vui lòng chọn lý do hoàn hàng'),
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    accountHolder: z.string().optional(),
    email: z.string().email('Email không hợp lệ').min(1, 'Vui lòng nhập email'),
    description: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'RETURN') {
      if (!data.bankName || data.bankName.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Vui lòng nhập tên ngân hàng',
          path: ['bankName'],
        });
      }
      if (!data.accountNumber || data.accountNumber.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Vui lòng nhập số tài khoản',
          path: ['accountNumber'],
        });
      }
      if (!data.accountHolder || data.accountHolder.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Vui lòng nhập tên chủ tài khoản',
          path: ['accountHolder'],
        });
      }
    }
  });

export type ReturnFormValues = z.infer<typeof returnFormSchema>;

interface ReturnFormProps {
  order: IOrder;
}

const REASON_OPTIONS = [
  { label: 'Giao sai sản phẩm', value: 'wrong_item' },
  { label: 'Sản phẩm bị lỗi/hư hỏng', value: 'defective' },
  { label: 'Thiếu phụ kiện/quà tặng', value: 'missing_parts' },
  { label: 'Khác với mô tả', value: 'description_mismatch' },
  { label: 'Lý do khác', value: 'other' },
];

const ReturnForm = ({ order }: ReturnFormProps) => {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  // Selected items state: map of variantId -> quantity
  // If a variantId is present in the map, it is selected.
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});

  const form = useForm<ReturnFormValues>({
    resolver: zodResolver(returnFormSchema),
    defaultValues: {
      reason: '',
      bankName: '',
      accountNumber: '',
      accountHolder: '',
      email: '',
      description: '',
    },
  });

  const returnType = form.watch('type');

  const handleToggleItem = (variantId: string, maxQuantity: number) => {
    setSelectedItems((prev) => {
      const isSelected = prev[variantId] !== undefined;
      const newSelected = { ...prev };
      if (isSelected) {
        delete newSelected[variantId];
      } else {
        newSelected[variantId] = maxQuantity; // Default to max quantity
      }
      return newSelected;
    });
  };

  const handleQuantityChange = (variantId: string, newQuantity: number, maxQuantity: number) => {
    if (newQuantity < 1 || newQuantity > maxQuantity) return;
    setSelectedItems((prev) => ({
      ...prev,
      [variantId]: newQuantity,
    }));
  };

  const onSubmit = async (data: ReturnFormValues) => {
    if (Object.keys(selectedItems).length === 0) {
      toast.error('Vui lòng chọn ít nhất một sản phẩm để hoàn trả');
      return;
    }

    try {
      const items = Object.entries(selectedItems).map(([variantId, quantity]) => {
        const orderItem = order.items.find((item) => item.variantId === variantId);
        return {
          productId: orderItem?.productId || '',
          variantId,
          quantity,
        };
      });

      const payload: IReturnRequestPayload = {
        orderId,
        email: data.email,
        type: data.type,
        reason: data.reason,
        description: data.description,
        items,
        refundInfo:
          data.type === 'RETURN'
            ? {
                bankName: data.bankName!,
                bankAccount: data.accountNumber!,
                bankAccountName: data.accountHolder!,
              }
            : undefined,
      };

      await createReturnRequest(payload);

      toast.success('Yêu cầu hoàn hàng đã được gửi thành công!');
      // router.push(ROUTER.ORDERS);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau');
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 border-gray-100 border-b pb-4">
        <h2 className="font-bold text-2xl text-gray-900">Yêu cầu hoàn hàng</h2>
        <p className="mt-1 text-gray-500 text-sm">Vui lòng điền đầy đủ thông tin để chúng tôi xử lý yêu cầu của bạn nhanh chóng.</p>
      </div>

      <FormWrapper form={form} onSubmit={onSubmit}>
        <div className="space-y-6">
          {/* Product Selection Section */}
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-4 font-medium text-gray-900">Chọn sản phẩm cần hoàn trả</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.variantId} className="flex items-start space-x-4 rounded-md border border-gray-200 bg-white p-3">
                  <div className="flex h-full items-center">
                    <Checkbox
                      checked={selectedItems[item.variantId] !== undefined}
                      onCheckedChange={() => handleToggleItem(item.variantId, item.quantity)}
                    />
                  </div>
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <Image src={item.productImage || '/images/no-image.svg'} alt={item.productName} fill className="object-cover" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="line-clamp-2 font-medium text-sm">{item.productName}</h4>
                    <p className="text-gray-500 text-xs">
                      Phân loại: {item.attributes ? Object.values(item.attributes).join(', ') : 'Mặc định'}
                    </p>
                    <p className="text-gray-500 text-xs">Đơn giá: {formatNumber(item.price)} đ</p>
                  </div>
                  {selectedItems[item.variantId] !== undefined && (
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.variantId, selectedItems[item.variantId] - 1, item.quantity)}
                        disabled={selectedItems[item.variantId] <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input type="text" value={selectedItems[item.variantId]} readOnly className="h-8 w-12 text-center" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.variantId, selectedItems[item.variantId] + 1, item.quantity)}
                        disabled={selectedItems[item.variantId] >= item.quantity}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {Object.keys(selectedItems).length === 0 && <p className="mt-2 text-red-500 text-xs">Vui lòng chọn ít nhất một sản phẩm.</p>}
          </div>

          <SelectCustomField
            control={form.control}
            name="reason"
            label="Lý do hoàn hàng"
            required
            fullWidth
            data={REASON_OPTIONS}
            placeholder="Chọn lý do hoàn hàng"
          />

          {form.watch('reason') && (
            <SelectCustomField
              control={form.control}
              name="type"
              label="Phương án xử lý"
              required
              fullWidth
              data={[
                { label: 'Trả hàng hoàn tiền', value: 'RETURN' },
                { label: 'Đổi trả', value: 'EXCHANGE' },
              ]}
              placeholder="Chọn phương án xử lý"
            />
          )}

          {returnType === 'RETURN' && (
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-4 font-medium text-gray-900">Thông tin tài khoản nhận tiền hoàn</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <TextField control={form.control} name="bankName" label="Tên ngân hàng" required fullWidth placeholder="VD: Vietcombank" />
                <TextField
                  control={form.control}
                  name="accountHolder"
                  label="Chủ tài khoản"
                  required
                  fullWidth
                  placeholder="Tên in hoa không dấu"
                />
                <div className="md:col-span-2">
                  <TextField
                    control={form.control}
                    name="accountNumber"
                    label="Số tài khoản"
                    required
                    fullWidth
                    placeholder="Nhập số tài khoản"
                  />
                </div>
              </div>
            </div>
          )}

          <TextField control={form.control} name="email" label="Email liên hệ" required fullWidth placeholder="example@email.com" />
          <p className="-mt-4 text-[0.8rem] text-muted-foreground">
            Chúng tôi sẽ gửi thông tin cập nhật về yêu cầu hoàn hàng qua email này.
          </p>

          <TextField
            control={form.control}
            name="description"
            label="Mô tả chi tiết / Ghi chú thêm"
            fullWidth
            placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
          />

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" className="w-full md:w-auto">
              Gửi yêu cầu hoàn hàng
            </Button>
          </div>
        </div>
      </FormWrapper>
    </div>
  );
};

export default ReturnForm;
