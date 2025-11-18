'use client';

import { RadioGroupField } from '@/components/form';
import Image from 'next/image';
import { useFormContext } from 'react-hook-form';
const paymentMethods = [
  {
    value: 'CASH_ON_DELIVERY',
    label: 'Thanh toán khi nhận hàng',
    image: '/images/cash-on-delivery.png',
  },
  {
    value: 'ONLINE_PAYMENT',
    label: 'VNPay',
    image: '/images/vnpay.png',
  },
];
const MethodPayment = () => {
  const formOrder = useFormContext();

  return (
    <div>
      <RadioGroupField
        control={formOrder.control}
        name="paymentMethod"
        data={paymentMethods.map((method) => ({
          value: method.value,
          label: (
            <div className="flex items-center space-x-3">
              <div className="h-8 w-12 flex-shrink-0">
                <Image src={method.image} alt={method.label} width={48} height={32} className="h-full w-full object-contain" />
              </div>
              <span>{method.label}</span>
            </div>
          ),
        }))}
        className="space-y-3"
      />
    </div>
  );
};

export default MethodPayment;
