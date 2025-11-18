import { useCartQuery } from '@/api/cart/queries';
import Breadcrumb from '@/components/Breadcrumb';
import H3 from '@/components/text/H3';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormWrapper } from '@/components/ui/form';
import QuantityInput from '@/components/ui/quantity-input';
import { Separator } from '@/components/ui/separator';
import { HStack, VStack } from '@/components/utilities';
import Container from '@/components/wrapper/Container';
import { useUserLogin } from '@/hooks/useUserLogin';
import { ROUTER } from '@/libs/router';
import { formatNumber } from '@/libs/utils';
import { useCartStore } from '@/stores/CartStore';
import { useCheckoutStore } from '@/stores/CheckoutStore';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const CartPageWebsite = () => {
  const form = useForm();
  const { carts, isLoading, removeFromCart, updateCartItem } = useCartStore();
  const { user, isLoggedIn } = useUserLogin();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const router = useRouter();

  // Fetch cart from API if user is logged in
  const { data: cartData, isFetching: isCartLoading } = useCartQuery({
    enabled: !!user?.id,
    onSuccess: (data) => {
      if (data?.items?.length) {
        useCartStore.getState().setCart(data.items);
      }
    },
  });
  // Calculate total price
  const totalPrice = carts
    .filter((item) => selectedItems.includes(item._id || ''))
    .reduce((total, item) => total + item.price * item.quantity, 0);

  // Handle select all
  useEffect(() => {
    if (isAllSelected) {
      setSelectedItems(carts.map((item) => item._id || ''));
    }
  }, [isAllSelected, carts]);
  // Handle select all checkbox
  const handleSelectAll = () => {
    setIsAllSelected(!isAllSelected);
    if (!isAllSelected) {
      setSelectedItems(carts.map((item) => item._id || ''));
    } else {
      setSelectedItems([]);
    }
  };
  // Handle item selection
  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
      setIsAllSelected(false);
    } else {
      setSelectedItems([...selectedItems, id]);
      if (selectedItems.length + 1 === carts.length) {
        setIsAllSelected(true);
      }
    }
  };
  // Handle remove item
  const handleRemoveItem = async (id: string) => {
    try {
      await removeFromCart(id);
      toast.success('Xóa sản phẩm khỏi giỏ hàng thành công!');
    } catch (error) {
      toast.error('Xóa sản phẩm khỏi giỏ hàng thất bại!');
    }
  };
  // Handle update quantity
  const handleUpdateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;

    try {
      await updateCartItem(id, quantity);
    } catch (error) {
      toast.error('Cập nhật số lượng sản phẩm thất bại!');
    }
  };
  // Handle checkout
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error('Vui lòng chọn ít nhất một sản phẩm!');
      return;
    }

    // Get selected items from cart
    const checkoutItems = carts.filter((item) => selectedItems.includes(item._id || ''));

    // Set items in checkout store
    useCheckoutStore.getState().setItems(checkoutItems);

    // Navigate to checkout page
    router.push(ROUTER.CHECKOUT);
  };
  return (
    <div className="bg-[#F5F5F5] pb-10">
      <Breadcrumb breadcrumbs={[{ name: 'Home', path: ROUTER.HOME }, { name: 'Cart' }]} className="bg-white" />

      <Container className="mt-8 text-sm">
        <H3>Giỏ hàng</H3>

        {isCartLoading ? (
          <div className="mt-10 flex items-center justify-center py-10">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            <span>Đang tải giỏ hàng...</span>
          </div>
        ) : carts.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center rounded bg-white py-10">
            <p className="mb-4 text-lg">Giỏ hàng của bạn đang trống</p>
            <Link href={ROUTER.COLLECTIONS}>
              <Button>Tiếp tục mua hàng</Button>
            </Link>
          </div>
        ) : (
          <FormWrapper form={form} onSubmit={handleCheckout}>
            <div className="mt-10 grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr] rounded bg-white p-3">
              <HStack spacing={12}>
                <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
                <span>Sản phẩm</span>
              </HStack>

              <span>Giá</span>
              <span>Số lượng</span>
              <span>Thành tiền</span>
              <div className="text-center">Hành động</div>
            </div>

            <VStack className="mt-4 rounded bg-white px-3 py-5" spacing={16}>
              {carts?.map((cart, index) => (
                <div key={cart._id || index}>
                  {index !== 0 && <Separator />}

                  <div className="grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr] py-4">
                    <HStack align="start" spacing={12}>
                      <Checkbox checked={selectedItems.includes(cart._id || '')} onCheckedChange={() => handleSelectItem(cart._id || '')} />
                      <VStack>
                        <p className="line-clamp-2">{cart.name}</p>

                        <div className="">
                          {cart.attributes && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {Object.entries(cart.attributes).map(([key, value]) => (
                                <div key={key} className="rounded bg-primary-100 px-2 py-1 text-xs">
                                  {value}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </VStack>
                    </HStack>

                    <span>{formatNumber(cart.price)}</span>

                    <HStack spacing={8}>
                      <QuantityInput
                        onChange={(value) => handleUpdateQuantity(cart._id || '', value)}
                        value={cart.quantity}
                        min={1}
                        max={cart.totalQuantity}
                      />
                    </HStack>

                    <span>{formatNumber(cart.price * cart.quantity)}</span>

                    <HStack pos="center">
                      <Button size="xs" onClick={() => handleRemoveItem(cart._id || '')}>
                        Xóa
                      </Button>
                    </HStack>
                  </div>
                </div>
              ))}
            </VStack>

            <div className="mt-6 flex justify-between rounded bg-white p-4">
              <div>
                <Button type="button" variant="outline" onClick={() => setSelectedItems([])}>
                  Xóa tất cả
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-gray-500 text-sm">Tổng tiền ({selectedItems.length} sản phẩm):</div>
                  <div className="font-semibold text-lg text-primary-600">{formatNumber(totalPrice)}</div>
                </div>

                {isLoggedIn ? (
                  <Button type="submit" disabled={selectedItems.length === 0}>
                    Tiến hành đặt hàng
                  </Button>
                ) : (
                  <Link href={ROUTER.SIGN_IN}>
                    <Button type="button">Đăng nhập để thanh toán</Button>
                  </Link>
                )}
              </div>
            </div>
          </FormWrapper>
        )}
      </Container>
    </div>
  );
};

export default CartPageWebsite;
