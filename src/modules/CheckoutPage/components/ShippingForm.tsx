'use client';

import {
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
  useUserAddressesQuery,
} from '@/api/address/queries';
import { Icons } from '@/assets/icons';
import { CheckboxField, TextField } from '@/components/form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FormWrapper } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { VStack } from '@/components/utilities';
import { onMutateError } from '@/libs/common';
import { useUserStore } from '@/stores/UserStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';
import { type ShippingSchema, shippingSchema } from '../libs/validators';

const ShippingForm = () => {
  const { user } = useUserStore();
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const formOrder = useFormContext();
  const form = useForm<ShippingSchema>({
    defaultValues: {
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      district: '',
      postalCode: '',
      ward: '',
      isDefault: true,
    },
    resolver: zodResolver(shippingSchema),
  });

  // Fetch user addresses from API
  const {
    data: addressData,
    isLoading,
    refetch,
  } = useUserAddressesQuery({
    enabled: !!user?.id,
    onError: onMutateError,
    refetchOnMount: true,
    onSuccess: (data) => {
      const defaultAddress = data.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id);

        const { _id, isDefault, ...rest } = defaultAddress;
        formOrder.setValue('shippingAddress', rest);
      }
    },
  });

  // Mutations
  const { mutate: createAddress } = useCreateAddressMutation({
    onSuccess: () => {
      refetch();
      setIsAddingAddress(false);
      form.reset();
      toast.success('Địa chỉ mới đã được thêm');
    },
    onError: (error) => {
      toast.error('Thêm địa chỉ mới thất bại!');
      console.error(error);
    },
  });

  const { mutate: deleteAddress } = useDeleteAddressMutation({
    onSuccess: () => {
      refetch();
      toast.success('Địa chỉ đã được xóa!');
    },
    onError: (error) => {
      toast.error('Xóa địa chỉ thất bại!');
      console.error(error);
    },
  });

  const { mutate: setDefaultAddress } = useSetDefaultAddressMutation({
    onSuccess: () => {
      refetch();
      toast.success('Địa chỉ mặc định đã được cập nhật!');
    },
    onError: (error) => {
      toast.error('Cập nhật địa chỉ mặc định thất bại!');
      console.error(error);
    },
  });

  const handleSelectAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
    const selectedAddress = addressData?.find((addr) => addr._id === addressId);

    if (!selectedAddress) return;
    const { _id, isDefault, ...rest } = selectedAddress;
    formOrder.setValue('shippingAddress', rest);
  };

  const handleDeleteAddress = (addressId: string) => {
    deleteAddress(addressId);

    // If the deleted address was selected, clear selection
    if (selectedAddressId === addressId) {
      setSelectedAddressId('');
    }
  };

  const handleAddNewAddress = (formData: ShippingSchema) => {
    createAddress(formData);
  };

  const handleSetDefault = (addressId: string) => {
    setDefaultAddress(addressId);
  };

  return (
    <div>
      <div className="mb-6 flex justify-between">
        <h5 className="font-medium">Địa chỉ của bạn</h5>
        <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Icons.plus className="mr-2 h-4 w-4" />
              Thêm địa chỉ mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Thêm địa chỉ mới</DialogTitle>
            </DialogHeader>
            <FormWrapper form={form} onSubmit={handleAddNewAddress}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <TextField label="Họ và tên" placeholder="Nhập họ và tên" control={form.control} name="fullName" required />
                <TextField label="Số điện thoại" placeholder="Nhập số điện thoại" control={form.control} name="phone" required />
                <TextField
                  label="Địa chỉ 1"
                  placeholder="Nhập địa chỉ 1"
                  control={form.control}
                  name="addressLine1"
                  className="md:col-span-2"
                  required
                />
                <TextField
                  label="Địa chỉ 2 (không bắt buộc)"
                  placeholder="Apartment, suite, etc."
                  control={form.control}
                  name="addressLine2"
                  className="md:col-span-2"
                />
                <TextField label="Thành phố" placeholder="Nhập thành phố" control={form.control} name="city" required />
                <TextField label="Quận/Huyện" placeholder="Nhập Quận/Huyện" control={form.control} name="district" required />
                <TextField label="Phường/Xã" placeholder="Nhập Phường/Xã" control={form.control} name="ward" required />
                <TextField label="Postal Code" placeholder="Mời nhập postal code" control={form.control} name="postalCode" />

                <CheckboxField label="Set as default address" control={form.control} name="isDefault" />

                <div className="flex justify-end gap-2 md:col-span-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddingAddress(false)}>
                    Hủy
                  </Button>
                  <Button type="button" onClick={() => form.handleSubmit(handleAddNewAddress)()}>
                    Thêm
                  </Button>
                </div>
              </div>
            </FormWrapper>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Icons.spinner className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : addressData?.length === 0 ? (
        <div className="rounded-md border border-dashed p-6 text-center">
          <p className="text-gray-500">You don't have any saved addresses.</p>
          <Button variant="outline" className="mt-2" onClick={() => setIsAddingAddress(true)}>
            Add Your First Address
          </Button>
        </div>
      ) : (
        <RadioGroup value={selectedAddressId} onValueChange={handleSelectAddress}>
          <VStack className="max-h-[300px] overflow-y-auto pr-2">
            {addressData
              ?.sort((a, b) => (a.isDefault ? -1 : b.isDefault ? 1 : 0))
              ?.map((address) => (
                <div
                  key={address._id}
                  className={`relative rounded-md border p-3 transition-all ${
                    selectedAddressId === address._id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value={address._id} id={address._id} />
                      <div>
                        <div className="flex items-center gap-2">
                          <label htmlFor={address._id} className="font-medium text-sm">
                            {address.fullName}
                          </label>
                          {address.isDefault && (
                            <span className="rounded-full bg-primary-100 px-2 py-0.5 text-primary-700 text-xs">Default</span>
                          )}
                        </div>
                        <p className="mt-1 text-gray-600 text-sm">{address.phone}</p>
                        <p className="mt-1 text-sm">
                          {address.addressLine1}
                          {address.addressLine2 && `, ${address.addressLine2}`}
                        </p>
                        <p className="text-sm">
                          {address.ward}, {address.district}, {address.city}, {address.postalCode}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {!address.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          onClick={() => handleSetDefault(address._id)}
                          className="text-gray-500 hover:text-primary-500"
                        >
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAddress(address._id)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </VStack>
        </RadioGroup>
      )}
    </div>
  );
};

export default ShippingForm;
