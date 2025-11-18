'use client';

import { useSubmitReviewMutation } from '@/api/reviews/mutations';
import { uploadMultiFile } from '@/api/upload/requests';
import { Icons } from '@/assets/icons';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormWrapper } from '@/components/ui/form';
import { Rating } from '@/components/ui/rating';
import { TextArea } from '@/components/ui/textarea';
import { HStack, Show } from '@/components/utilities';
import { onMutateError } from '@/libs/common';
import { useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface ReviewFormValues {
  rating: number;
  comment: string;
  productId: string;
  orderId: string;
  images: string[];
}

interface ReviewDialogProps {
  productId: string;
  productName: string;
  productImage?: string;
  orderId: string;
  refetch: any;
}

const ReviewDialog = ({ productId, orderId, productImage, productName, refetch }: ReviewDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const form = useForm<ReviewFormValues>({
    defaultValues: {
      rating: 5,
      comment: '',
      productId,
      orderId,
      images: [],
    },
  });

  // Upload image mutation
  const { mutate: uploadImage } = useMutation(
    (files: File[]) => {
      const filesArray = Array.from(files);
      setIsUploading(true);
      const formData = new FormData();
      filesArray.forEach((file) => {
        formData.append('files', file);
      });
      return uploadMultiFile(formData);
    },
    {
      onSuccess: (data) => {
        const newImages = data?.map((x) => x.url);
        setUploadedImages(newImages);
        form.setValue('images', newImages);
        setIsUploading(false);
      },
      onError: (error) => {
        onMutateError(error);
        setIsUploading(false);
      },
    }
  );

  // Submit review mutation using the actual API
  const { mutate: submitReview, isLoading: isSubmitting } = useSubmitReviewMutation({
    onSuccess: () => {
      toast.success('Cảm ơn bạn đã đánh giá sản phẩm!');

      handleClose();

      refetch?.();
    },
    onError: onMutateError,
  });

  const handleSubmit = (values: ReviewFormValues) => {
    // Prepare the data according to the API requirements
    const reviewData = {
      productId: values.productId,
      orderId: values.orderId,
      rating: values.rating,
      comment: values.comment,
      images: values.images,
    };

    submitReview(reviewData);
  };

  const handleClose = () => {
    form.reset();
    setUploadedImages([]);
    setIsOpen(false);
  };

  const handleFileChange = (files: File[]) => {
    uploadImage(files);
  };

  const removeImage = (index: number) => {
    const newImages = [...uploadedImages];
    newImages.splice(index, 1);
    setUploadedImages(newImages);
    form.setValue('images', newImages);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="xs">Reviews</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <div className="flex justify-between">
          <DialogHeader>
            <DialogTitle>Viết một đánh giá</DialogTitle>
          </DialogHeader>

          <DialogClose asChild>
            <X className="h-4 w-4 cursor-pointer" />
          </DialogClose>
        </div>

        <FormWrapper form={form} onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4 text-sm">
            {/* Product info */}
            <HStack className="gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-md">
                <Image src={productImage || '/images/no-image.svg'} alt={productName} fill className="object-cover" />
              </div>
              <div>
                <h4 className="font-medium">{productName}</h4>
                <p className="text-gray-500 text-sm">Order Code: {orderId.slice(-6)}</p>
              </div>
            </HStack>

            {/* Rating */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <Rating value={field.value} onChange={field.onChange} readOnly={false} size="lg" className="justify-start" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Review comment */}
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đánh giá sản phẩm</FormLabel>
                  <FormControl>
                    <TextArea placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..." className="min-h-[120px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image upload */}
            <div className="space-y-2">
              <FormLabel>Thêm hình ảnh (không bắt buộc)</FormLabel>
              <FileUploader
                maxSize={5}
                minSize={0.001}
                ref={fileRef}
                name="file"
                multiple
                types={['JPG', 'PNG', 'JPEG']}
                handleChange={handleFileChange}
                onSizeError={() => toast.error('Image size must be less than 5MB')}
                onTypeError={() => toast.error('Only JPG, PNG and JPEG files are allowed')}
              >
                <div className="cursor-pointer rounded-md border-2 border-gray-300 border-dashed p-4 text-center hover:border-gray-400">
                  {/* <Icons.image className="mx-auto h-8 w-8 text-gray-400" /> */}
                  <p className="mt-2 text-gray-500 text-sm">Kéo và thả hoặc chọn hình ảnh</p>
                  <p className="text-gray-400 text-xs">PNG, JPG, JPEG (max 5MB)</p>
                </div>
              </FileUploader>

              {/* Preview uploaded images */}
              <Show when={uploadedImages.length > 0}>
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="group relative h-20 w-20 overflow-hidden rounded-md">
                      <Image src={image} alt={`Review image ${index + 1}`} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </Show>

              <Show when={isUploading}>
                <div className="mt-2 flex items-center gap-2">
                  <Icons.spinner className="h-4 w-4 animate-spin" />
                  <span className="text-gray-500 text-sm">Uploading image...</span>
                </div>
              </Show>
            </div>

            {/* Submit button */}
            <Button type="submit" className="w-full" size="sm" disabled={isSubmitting || isUploading}>
              {isSubmitting ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                'Gửi đánh giá'
              )}
            </Button>
          </div>
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
