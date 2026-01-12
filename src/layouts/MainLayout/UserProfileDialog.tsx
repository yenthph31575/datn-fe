'use client';

import { editAccount, editPassword } from '@/api/auth/requests';
import { UploadAvatarField } from '@/components/form/UploadAvatarField';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HStack, VStack } from '@/components/utilities';
import { useUserLogin } from '@/hooks/useUserLogin';
import { changePasswordSchema, editAccountSchema } from '@/layouts/MainLayout/libs/validators';
import { onMutateError } from '@/libs/common';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { TextField } from '../../components/form';
import { FormWrapper } from '../../components/ui/form';

const UserProfileDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUserLogin();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      username: user?.username || '',
      avatar: user?.avatar || '',
      email: user?.email || '',
    },
    resolver: zodResolver(editAccountSchema),
  });

  const passwordForm = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { mutate, isLoading } = useMutation(editAccount);
  const { mutate: changePassword, isLoading: isChangingPassword } = useMutation(editPassword);

  const handleSubmit = (formData: any) => {
    mutate(formData, {
      onSuccess: () => {
        toast.success('Cập nhật thông tin thành công!');
        queryClient.invalidateQueries(['user/info']);
        setIsOpen(false);
      },
      onError: onMutateError,
    });
  };

  const handlePasswordSubmit = (formData: any) => {
    changePassword(
      {
        currentPassword: formData.password,
        newPassword: formData.newPassword,
      },
      {
        onSuccess: () => {
          toast.success('Cập nhật mật khẩu thành công!');
          setIsOpen(false);
          passwordForm.reset();
        },
        onError: onMutateError,
      }
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="rounded-full" variant="tertiary" onClick={() => setIsOpen(true)}>
            Chỉnh sửa thông tin
          </Button>
        </DialogTrigger>

        <DialogContent className="overflow-x-hidden">
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Thông Tin</DialogTitle>
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <X className="h-4 w-4" />
            </button>
          </DialogHeader>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
              <TabsTrigger value="password">Mật khẩu</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <FormWrapper form={form} onSubmit={handleSubmit}>
                <VStack spacing={16} className="mt-4">
                  <HStack spacing={20} className="w-full justify-center">
                    <UploadAvatarField control={form.control} name="avatar" />
                  </HStack>

                  <TextField
                    required
                    fullWidth
                    control={form.control}
                    name="username"
                    label="Tên đăng nhập"
                    placeholder="Mời nhập tên đăng nhập"
                  />

                  <TextField
                    required
                    fullWidth
                    control={form.control}
                    name="email"
                    label="Email"
                    value={user?.email || ''}
                    disabled
                    placeholder="Nhập email của bạn"
                  />

                  <Button type="submit" className="w-full" loading={isLoading}>
                    Cập nhật
                  </Button>
                </VStack>
              </FormWrapper>
            </TabsContent>

            <TabsContent value="password">
              <FormWrapper form={passwordForm} onSubmit={handlePasswordSubmit}>
                <VStack spacing={16} className="mt-4">
                  <TextField
                    required
                    fullWidth
                    control={passwordForm.control}
                    name="password"
                    label="Mật khẩu hiện tại"
                    placeholder="Nhập mật khẩu hiện tại"
                    type="password"
                  />

                  <TextField
                    required
                    fullWidth
                    control={passwordForm.control}
                    name="newPassword"
                    label="Mật khẩu mới"
                    placeholder="Nhập mật khẩu mới"
                    type="password"
                  />

                  <TextField
                    required
                    fullWidth
                    control={passwordForm.control}
                    name="confirmPassword"
                    label="Xác nhận mật khẩu mới"
                    placeholder="Xác nhận mật khẩu mới"
                    type="password"
                  />

                  <Button type="submit" className="w-full" loading={isChangingPassword}>
                    Cập nhật mật khẩu
                  </Button>
                </VStack>
              </FormWrapper>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserProfileDialog;
