import type { IVoucher } from '@/api/voucher/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/libs/common';
import { formatNumber } from '@/libs/utils';
import { useCheckoutStore } from '@/stores/CheckoutStore';
import { format, isAfter, isBefore } from 'date-fns';
import { Copy, Ticket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface VoucherCardProps {
  voucher: IVoucher;
}

const VoucherCard = ({ voucher }: VoucherCardProps) => {
  const [copied, setCopied] = useState(false);
  const { setDiscount } = useCheckoutStore();
  const router = useRouter();

  // kiểm tra voucher có hoạt động không
  const isActive = voucher.isActive && voucher.status === 'ACTIVE';

  // kiểm tra voucher đã hết hạn chưa
  const isExpired = voucher.status === 'EXPIRED' || isBefore(new Date(voucher.endDate), new Date());

  // kiểm tra voucher chưa bắt đầu
  const isNotStarted = isAfter(new Date(voucher.startDate), new Date());

  // Lấy thông tin trạng thái và màu sắc
  const getStatusInfo = () => {
    if (isExpired) {
      return { text: 'Hết hạn', color: 'bg-red-100 text-red-800' };
    }
    if (isNotStarted) {
      return { text: 'Chưa bắt đầu', color: 'bg-blue-100 text-blue-800' };
    }
    if (!isActive) {
      return { text: 'Không hoạt động', color: 'bg-gray-100 text-gray-800' };
    }
    return { text: 'Còn hạn', color: 'bg-green-100 text-green-800' };
  };

  const statusInfo = getStatusInfo();

  // Định dạng giá trị giảm giá
  const formatDiscountValue = () => {
    if (voucher.type === 'PERCENTAGE') {
      return `${voucher.value}%`;
    }
    return formatNumber(voucher.value);
  };

  // sao chép mã voucher
  const handleCopyCode = () => {
    navigator.clipboard.writeText(voucher.code);
    setCopied(true);
    toast.success('Mã giảm giá đã được sao chép!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/* phần header voucher với hiệu ứng xé vé  */}
      <div className="relative bg-primary-500 p-4 text-white">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">{voucher.name}</h3>
          <Ticket className="h-6 w-6" />
        </div>
        <p className="mt-1 text-sm opacity-90">{voucher.description}</p>

        {/* Hiệu ứng xé vé*/}
        <div className="absolute right-0 bottom-0 left-0 h-4 overflow-hidden">
          <div className="flex w-full">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="h-4 w-4 rounded-full bg-white" style={{ marginLeft: '-8px' }}></div>
            ))}
          </div>
        </div>
      </div>

      {/* nội dung voucher */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <span className="font-bold text-2xl text-primary-600">{formatDiscountValue()}</span>
            <span className="ml-1 text-gray-600 text-sm">Giảm giá</span>
          </div>
          <span className={cn('rounded-full px-3 py-1 font-medium text-xs', statusInfo.color)}>{statusInfo.text}</span>
        </div>

        <div className="mb-4 flex-1 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Giá trị đơn hàng tối thiểu:</span>
            <span className="font-medium">{formatNumber(voucher.minOrderValue)}</span>
          </div>
          {voucher.type === 'PERCENTAGE' && voucher.maxDiscountValue > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Giảm giá tối đa:</span>
              <span className="font-medium">{formatNumber(voucher.maxDiscountValue)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Hết hạn:</span>
            <span className="font-medium">{format(new Date(voucher.endDate), 'dd/MM/yyyy')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Số lượng còn lại:</span>
            <span className="font-medium">
              {voucher.usageLimit - voucher.usageCount}/{voucher.usageLimit}
            </span>
          </div>
        </div>

        {/* Mã voucher*/}
        <div className="mb-4 flex items-center justify-between rounded-md bg-gray-100 p-2">
          <code className="font-bold font-mono text-primary-700">{voucher.code}</code>
          <Button variant="ghost" size="sm" onClick={handleCopyCode}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        {/* Action button
        <Button className="w-full" disabled={!isActive || isExpired || isNotStarted} onClick={handleApplyVoucher}>
          {isExpired ? 'Expired' : isNotStarted ? 'Coming Soon' : 'Apply Voucher'}
        </Button> */}
      </div>
    </div>
  );
};

export default VoucherCard;
