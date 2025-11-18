'use client';

import { useCancelOrderMutation } from '@/api/order/queries';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TextArea } from '@/components/ui/textarea';
import { HStack } from '@/components/utilities';
import { onMutateError } from '@/libs/common';
import { X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface DialogCancelOrderProps {
  orderId: string;
  refetch: any;
}

const DialogCancelOrder = ({ orderId, refetch }: DialogCancelOrderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');

  const { mutate: cancelOrder, isLoading } = useCancelOrderMutation({
    onSuccess: () => {
      toast.success('Hủy đơn hàng thành công');
      setIsOpen(false);
      refetch?.();
    },
    onError: onMutateError,
  });

  const handleCancelOrder = () => {
    cancelOrder({ orderId, reason });
    refetch?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Hủy</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hủy Đơn Hàng</DialogTitle>
          <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <p className="text-gray-500 text-sm">Lý do hủy:</p>
            <TextArea
              placeholder="Nhập lý do hủy..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <HStack className="justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Hủy
          </Button>
          <Button loading={isLoading} onClick={handleCancelOrder} disabled={isLoading || !reason.trim()}>
            Xác nhận
          </Button>
        </HStack>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCancelOrder;
