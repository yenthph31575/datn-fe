'use client';
import { uploadSingleFile } from '@/api/upload/requests';
import { cn, onMutateError } from '@/libs/common';
import { useMutation } from '@tanstack/react-query';
import { Loader2, Pencil } from 'lucide-react';
import React, { useRef } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import type { Control, FieldPath, FieldPathValue, FieldValues } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Avatar, AvatarImage } from '../ui/avatar';
import type { ButtonProps } from '../ui/button';
import { FormField, FormItem, FormMessage } from '../ui/form';

interface Props<T extends FieldValues = FieldValues> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'accept'> {
  control: Control<T>;
  name: FieldPath<T>;
  defaultValue?: FieldPathValue<T, FieldPath<T>>;
  fullWidth?: boolean;
  readonly?: boolean;
  accept?: string[];
  loading?: boolean;
  btnProps?: ButtonProps;
  maxSize?: number;
}

const UploadAvatarField = <T extends FieldValues>({
  accept = [],
  control,
  name,
  defaultValue,
  btnProps,
  loading,
  className,
  readonly,
  ...props
}: Props<T>) => {
  const ref = useRef<React.ElementRef<'input'>>(null);

  const { mutate, isLoading } = useMutation(uploadSingleFile);

  const handleChangeFile = (e: File, onChange: any) => {
    const formData = new FormData();
    if (e) {
      formData.append('file', e);
      formData.append('folder_name', 'avatar');

      mutate(formData, {
        onSuccess: ({ url }) => {
          onChange(url);
        },
        onError: onMutateError,
      });
    }
  };

  return (
    <FormField
      defaultValue={defaultValue}
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => {
        return (
          <FormItem>
            <FileUploader
              maxSize={25}
              minSize={1 / 1024}
              {...props}
              ref={ref}
              hoverTitle="d"
              name="file"
              types={accept.length === 0 ? undefined : accept}
              handleChange={(fileLocal: File) => {
                handleChangeFile(fileLocal, onChange);
              }}
              onSizeError={(type: string) => {
                if (type === 'File size is too small') {
                  toast.error('Cannot upload files smaller than 1KB !');
                } else {
                  toast.error('Avatar size must be less than ' + (props.maxSize ?? 25) + 'MB !');
                }
              }}
              onTypeError={(error: string) => {
                toast.error(error);
              }}
            >
              <div
                className={cn('group hover: relative w-fit cursor-pointer overflow-hidden rounded-lg')}
                onClick={() => {
                  if (ref.current) {
                    ref.current.value = '';
                  }
                  ref.current?.click();
                }}
              >
                <Avatar className={cn('h-28 w-28', className)}>
                  <AvatarImage src={value || '/images/no-image.svg'} alt="@shadcn" className="rounded-none" />
                  {/* <AvatarFallback>CN</AvatarFallback> */}
                </Avatar>

                {isLoading && (
                  <div className="absolute inset-0 m-auto flex bg-[rgba(0,0,0,0.5)]">
                    <Loader2 className="m-auto w-4 animate-spin text-white " />
                  </div>
                )}

                {!isLoading && (
                  <div className="absolute inset-0 hidden border bg-[rgba(0,0,0,0.5)] transition-all group-hover:flex">
                    <Pencil className="m-auto h-5 w-5 text-white" />
                  </div>
                )}
              </div>
            </FileUploader>

            {/* <FormControl>
              <input
                hidden
                accept={accept.length === 0 ? undefined : accept.join(', ')}
                type="file"
                onChange={(e) => {
                  // onChange(Array.from(e.target.files as any));
                  handleChangeFile(e, onChange);
                  e.target.files = null;
                }}
                {...props}
                ref={ref}
              />
            </FormControl> */}

            <FormMessage className="mt-1 text-xs" />
          </FormItem>
        );
      }}
    />
  );
};

export { UploadAvatarField };
