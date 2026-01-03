'use client';

import { SelectField, TextField } from '@/components/form';
import { SelectCustomField } from '@/components/form/SelectCustomField';
import { Button } from '@/components/ui/button';
import { FormWrapper } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const returnFormSchema = z.object({
  reason: z.string().min(1, 'Vui lòng chọn lý do hoàn hàng'),
  bankName: z.string().min(1, 'Vui lòng nhập tên ngân hàng'),
  accountNumber: z.string().min(1, 'Vui lòng nhập số tài khoản'),
  accountHolder: z.string().min(1, 'Vui lòng nhập tên chủ tài khoản'),
  email: z.string().email('Email không hợp lệ').min(1, 'Vui lòng nhập email'),
  description: z.string().optional(),
});

export type ReturnFormValues = z.infer<typeof returnFormSchema>;

interface ReturnFormProps {
  onSubmit: (data: ReturnFormValues) => void;
}

const REASON_OPTIONS = [
  { label: 'Giao sai sản phẩm', value: 'wrong_item' },
  { label: 'Sản phẩm bị lỗi/hư hỏng', value: 'defective' },
  { label: 'Thiếu phụ kiện/quà tặng', value: 'missing_parts' },
  { label: 'Khác với mô tả', value: 'description_mismatch' },
  { label: 'Lý do khác', value: 'other' },
];

const ReturnForm = ({ onSubmit }: ReturnFormProps) => {
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

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Yêu cầu hoàn hàng</h2>
        <p className="mt-1 text-sm text-gray-500">Vui lòng điền đầy đủ thông tin để chúng tôi xử lý yêu cầu của bạn nhanh chóng.</p>
      </div>

      <FormWrapper form={form} onSubmit={onSubmit}>
        <div className="space-y-6">
          <SelectCustomField
            control={form.control}
            name="reason"
            label="Lý do hoàn hàng"
            required
            fullWidth
            data={REASON_OPTIONS}
            placeholder="Chọn lý do hoàn hàng"
          />

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
