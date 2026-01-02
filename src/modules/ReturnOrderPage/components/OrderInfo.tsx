import { IOrder } from '@/api/order/types';
import { formatNumber } from '@/libs/utils';

interface OrderInfoProps {
  order: IOrder;
}

const OrderInfo = ({ order }: OrderInfoProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-semibold text-gray-900 border-b border-gray-100 pb-2">Thông tin đơn hàng</h3>
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Mã đơn hàng:</span>
          <span className="font-medium">{order.orderCode}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Ngày đặt:</span>
          <span className="font-medium">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
        </div>
        <div className="border-t border-gray-100 pt-3">
          <h4 className="mb-3 font-medium text-sm text-gray-700">Sản phẩm ({order.items.length})</h4>
          <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="h-12 w-12 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden relative border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.productImage || '/placeholder.png'} alt={item.productName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium text-gray-900" title={item.productName}>
                    {item.productName}
                  </p>
                  <p className="text-xs text-gray-500">x{item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
          <span className="font-medium text-gray-900">Tổng giá trị:</span>
          <span className="font-bold text-primary text-lg">{formatNumber(order.totalAmount)} đ</span>
        </div>
      </div>
    </div>
  );
};

export default OrderInfo;
