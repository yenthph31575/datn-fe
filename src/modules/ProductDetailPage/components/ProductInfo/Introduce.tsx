import { Icons } from '@/assets/icons';
import H1 from '@/components/text/H1';
import H3 from '@/components/text/H3';
import H4 from '@/components/text/H4';
import { Button } from '@/components/ui/button';
import QuantityInput from '@/components/ui/quantity-input';
import { HStack, VStack } from '@/components/utilities';
import { cn } from '@/libs/common';
import { formatNumber } from '@/libs/utils';
import { useCartStore } from '@/stores/CartStore';
import { Check, Star } from 'lucide-react';
import React, { useId, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import type { ProductInfoProps } from '.';
import { groupAttributes } from '../../libs';

type VariantSelect = {
  productId: string;
  _id: string;
  quantity: number;
  [key: string]: any;
};

const Introduce = ({
  _id,
  name,
  images,
  originalPrice,
  currentPrice,
  variants,
  totalQuantity,
  averageRating,
  reviewCount,
  totalSoldCount,
}: ProductInfoProps) => {
  const [variantSelect, setVariantSelect] = useState<Partial<VariantSelect> | undefined>({ productId: String(_id), quantity: 1 });
  const id = useId();
  const { addToCart } = useCartStore();

  const attributes = useMemo(() => {
    if (!variants) return [];
    return groupAttributes(variants);
  }, [variants]);

  const selectedVariant = useMemo(() => {
    if (!variantSelect || !variants) return;
    const { productId, quantity, ...selectedAttributes } = variantSelect;
    const activeAttributes = Object.entries(selectedAttributes).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ''
    );

    if (!activeAttributes.length || Object.keys(variants[0].attributes).length !== activeAttributes.length) return;

    return variants?.find((variant) => activeAttributes.every(([key, value]) => variant.attributes[key] === value));
  }, [variantSelect, variants]);

  const handleAddToCart = () => {
    if (!selectedVariant || !variantSelect || !name) return;

    // Check if the selected quantity exceeds available stock
    const availableQuantity = selectedVariant?.quantity || totalQuantity || 0;

    // Find if this product variant is already in cart
    const existingCartItem = useCartStore
      .getState()
      .carts.find((item) => item.productId === String(_id) && item.variantId === String(selectedVariant._id));

    // Calculate total quantity (existing in cart + new quantity to add)
    const totalRequestedQuantity = (existingCartItem?.quantity || 0) + (variantSelect.quantity || 1);

    // Check if total requested quantity exceeds available stock
    if (totalRequestedQuantity > availableQuantity) {
      toast.error(`Không thể thêm vào giỏ hàng. Chỉ còn ${availableQuantity} sản phẩm trong kho.`);
      return;
    }

    const newCart = {
      _id: id,
      productId: String(_id),
      variantId: String(selectedVariant?._id),
      quantity: variantSelect?.quantity || 1,
      name: name,
      price: selectedVariant?.price,
      image: images?.[0],
      attributes: selectedVariant?.attributes,
      totalQuantity: selectedVariant?.quantity,
    };

    addToCart(newCart);
    toast.success('Thêm vào giỏ hàng thành công!');
  };

  return (
    <div>
      <H1 className="font-poppins lg:text-3xl">{name}</H1>

      <HStack className="mt-2 text-sm" spacing={24}>
        <HStack>
          <span>{averageRating?.toFixed(1) || '0.0'}</span>
          <Star className="h-4 w-4 fill-yellow-500" />
        </HStack>
        <span>|</span>
        <HStack>
          <span>{formatNumber(reviewCount)} </span>
          <span className="text-grey-500">Đánh giá</span>
        </HStack>
        <span>|</span>
        <HStack>
          <span>{formatNumber(totalSoldCount)}</span>
          <span className="text-grey-500">Đã bán</span>
        </HStack>
      </HStack>

      <HStack className="mt-4 rounded bg-primary-50 p-4" spacing={24}>
        <H3 className="font-poppins text-primary-700">{formatNumber(selectedVariant?.price ?? currentPrice)}</H3>

        <span className="text-sm line-through">{formatNumber(originalPrice ? originalPrice : Number(currentPrice) + 10000)}</span>
      </HStack>

      <ul className="mt-4 text-sm">
        <li className="flex ">
          <Check className="mr-3 w-5" />
          Hàng chính hãng
        </li>
        <li className="flex ">
          <Check className="mr-3 w-5" />
          Giao hàng toàn quốc
        </li>
      </ul>

      <VStack className="mt-4">
        {attributes?.map((attribute) => (
          <HStack key={attribute.name}>
            <H4 className="w-20 font-normal font-poppins">{attribute.name}</H4>
            <HStack className="mt-2" spacing={16}>
              {attribute.values.map((value) => (
                <div
                  key={value}
                  onClick={() => {
                    setVariantSelect((prev) => ({ ...prev, [attribute.name]: value }));
                  }}
                  className={cn('cursor-pointer rounded border border-primary-500 px-4 py-2 text-sm hover:bg-primary-50', {
                    'pointer-events-none bg-primary-400 text-white': variantSelect?.[attribute.name] === value,
                  })}
                >
                  {value}
                </div>
              ))}
            </HStack>
          </HStack>
        ))}
      </VStack>

      <HStack spacing={32} className="mt-8" align="start">
        <div className="">
          <QuantityInput
            onChange={(value) => setVariantSelect((prev) => ({ ...prev, quantity: value }))}
            value={variantSelect?.quantity || 1}
            min={1}
            max={selectedVariant?.quantity ?? totalQuantity}
          />
          <span className="text-primary-600 text-xs">{formatNumber(selectedVariant?.quantity ?? totalQuantity)} products available</span>
        </div>
        <Button variant="shadow" className="h-11" disabled={!selectedVariant} onClick={handleAddToCart}>
          <Icons.cart className="mr-2" />
          Thêm vào giỏ hàng
        </Button>
      </HStack>
    </div>
  );
};

export default Introduce;
