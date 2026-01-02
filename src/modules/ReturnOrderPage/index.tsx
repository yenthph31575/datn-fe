'use client';

import { useOrderByIdQuery } from '@/api/order/queries';
import Breadcrumb from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import Container from '@/components/wrapper/Container';
import { ROUTER } from '@/libs/router';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import OrderInfo from './components/OrderInfo';
import ReturnForm, { ReturnFormValues } from './components/ReturnForm';

const ReturnOrderPage = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const {
    data: order,
    isFetching,
    error,
  } = useOrderByIdQuery({
    variables: orderId,
    enabled: Boolean(orderId),
  });

  const onSubmit = (data: ReturnFormValues) => {
    // TODO: Implement API call here
    console.log('Return Request Data:', {
      orderId,
      ...data,
    });
    toast.success('Yêu cầu hoàn hàng đã được gửi thành công!');
    router.push(ROUTER.ORDERS);
  };

  if (isFetching) {
    return (
      <Container className="py-16">
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container className="py-16">
        <div className="text-center">
          <h2 className="font-semibold text-gray-900 text-xl">Không tìm thấy đơn hàng</h2>
          <Link href={ROUTER.ORDERS}>
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại đơn hàng
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Breadcrumb
        breadcrumbs={[
          { name: 'Trang chủ', path: ROUTER.HOME },
          { name: 'Đơn hàng của tôi', path: ROUTER.ORDERS },
          { name: 'Hoàn hàng', path: '#' },
        ]}
      />

      <Container className="pt-8">
        <Link href={ROUTER.ORDERS}>
          <Button variant="ghost" className="mb-6 gap-2 pl-0 hover:bg-transparent hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách đơn hàng
          </Button>
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <ReturnForm onSubmit={onSubmit} />
          </div>

          {/* Order Info Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <OrderInfo order={order} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ReturnOrderPage;
