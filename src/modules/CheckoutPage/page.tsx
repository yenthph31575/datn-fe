'use client';

import { useCreateOrderMutation } from '@/api/order/queries';
import NotFound from '@/components/404';
import Breadcrumb from '@/components/Breadcrumb';
import H3 from '@/components/text/H3';
import { Button } from '@/components/ui/button';
import { FormWrapper } from '@/components/ui/form';
import Container from '@/components/wrapper/Container';
import { ROUTER } from '@/libs/router';
import { formatNumber } from '@/libs/utils';
import { useCartStore } from '@/stores/CartStore';
import { useCheckoutStore } from '@/stores/CheckoutStore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import OrderSummary from './components/OrderSummary';
import PaymentMethod from './components/PaymentMethod';
import ShippingForm from './components/ShippingForm';
import { type OrderSchema, orderSchema } from './libs/validators';

const PageCheckout = () => {
  const router = useRouter();
  const form = useForm<OrderSchema>({
    defaultValues: {
      items: [],
      paymentMethod: 'CASH_ON_DELIVERY',
      shippingAddress: {
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        district: '',
        ward: '',
        postalCode: '',
        isDefault: true,
      },
      voucherId: '',
    },
  });
  const { items, clearCheckout } = useCheckoutStore();
  const { removeMultipleFromCart } = useCartStore(); // Import removeMultipleFromCart from CartStore

  const { mutate: createOrder, isLoading } = useCreateOrderMutation({
    onSuccess: (data) => {
      // Get the IDs of items that were successfully ordered
      const orderedItemIds = items.map((item) => item._id).filter(Boolean);

      // Remove these items from the cart
      if (orderedItemIds.length > 0) {
        removeMultipleFromCart(orderedItemIds);
      }

      if (data.paymentMethod === 'ONLINE_PAYMENT' && data?.paymentSession) {
        window.location.href = data.paymentSession?.url;
        clearCheckout();
      } else {
        router.push(`${ROUTER.ORDERS}/${data._id}`);
        toast.success('Tạo mới đơn hàng thành công!');
        clearCheckout();
      }
    },
    onError: (error) => {
      toast.error('Tạo mới đơn hàng thất bại!');
    },
  });

  const handleSubmitOrder = (formData: OrderSchema) => {
    const { items } = useCheckoutStore.getState();

    const orderData = {
      items: items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      })),
      paymentMethod: formData.paymentMethod,
      shippingAddress: formData.shippingAddress,
      voucherId: formData.voucherId || undefined,
    };

    const validationResult = orderSchema.safeParse(orderData);

    if (!validationResult.success) {
      const formattedErrors = validationResult.error.format();

      // Hiển thị thông báo lỗi
      const firstError = validationResult.error.errors[0];
      toast.error(firstError?.message || 'Please check your order information');
      return;
    }

    // Nếu validation thành công, gửi request tạo đơn hàng
    createOrder(orderData);
  };

  if (items.length === 0) {
    return <NotFound />;
  }

  return (
    <div className="bg-[#F5F5F5] pb-10">
      <Breadcrumb
        breadcrumbs={[{ name: 'Home', path: ROUTER.HOME }, { name: 'Cart', path: ROUTER.CART }, { name: 'Checkout' }]}
        className="bg-white"
      />

      <Container className="mt-8">
        <H3>Thanh toán</H3>

        <FormWrapper form={form} onSubmit={handleSubmitOrder}>
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left column - Shipping & Payment */}
            <div className="col-span-2 space-y-6">
              {/* Thông tin vận chuyển */}
              <div className="rounded bg-white p-6">
                <h4 className="mb-4 font-medium text-lg">Thông tin vận chuyển</h4>
                <ShippingForm />
              </div>

              {/* Phương thức thanh toán */}
              <div className="rounded bg-white p-6">
                <h4 className="mb-4 font-medium text-lg">Phương thức thanh toán</h4>
                <PaymentMethod />
              </div>

              {/* Danh sách sản phẩm */}
              <div className="rounded bg-white p-6">
                <h4 className="mb-4 font-medium text-lg">Danh sách sản phẩm</h4>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item._id} className="flex items-start gap-4">
                      {item.image && (
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded border">
                          <Image src={item.image} alt={item.name} width={64} height={64} className="h-full w-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="line-clamp-1 font-medium">{item.name}</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {item.attributes &&
                            Object.entries(item.attributes).map(([key, value]) => (
                              <div key={key} className="rounded bg-primary-100 px-2 py-1 text-xs">
                                {value}
                              </div>
                            ))}
                        </div>
                        <div className="mt-1 text-gray-500 text-sm">
                          {formatNumber(item.price)} x {item.quantity}
                        </div>
                      </div>
                      <div className="font-medium">{formatNumber(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column - Order Summary */}
            <div className="col-span-1">
              <div className="sticky top-6 rounded bg-white p-6">
                <h4 className="mb-4 font-medium text-lg">Tóm tắt đơn hàng</h4>
                <OrderSummary />

                <Button type="submit" className="mt-6 w-full" disabled={isLoading} loading={isLoading}>
                  {isLoading ? 'Đang xử lý...' : 'Đặt hàng'}
                </Button>

                <Link href={ROUTER.CART} className="mt-4 block text-center text-gray-500 text-sm hover:text-primary-600">
                  Quay lại giỏ hàng
                </Link>
              </div>
            </div>
          </div>
        </FormWrapper>
      </Container>
    </div>
  );
};

export default PageCheckout;
