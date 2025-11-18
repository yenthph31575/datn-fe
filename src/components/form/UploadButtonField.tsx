'use client';

import { Icons } from '@/assets/icons';
import { cn, onMutateError } from '@/libs/common';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { type Control, type FieldPath, type FieldPathValue, type FieldValues, useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Button, type ButtonProps } from '../ui/button';
import { FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Show, VStack } from '../utilities';
import { uploadSingleFile } from '@/api/upload/requests';

interface Props<T extends FieldValues = FieldValues> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'accept' | 'onChange'> {
  control: Control<T>;
  name: FieldPath<T>;
  defaultValue?: FieldPathValue<T, FieldPath<T>>;
  fullWidth?: boolean;
  readonly?: boolean;
  accept?: string[];
  loading?: boolean;
  btnProps?: ButtonProps;
  maxSize?: number;
  onChange?: (file: any) => void;
  label?: string;
  labelClassName?: string;
  required?: boolean;
  previewClassNames?: {
    image?: string;
    wrapper?: string;
  };
}

const UploadButtonField = <T extends FieldValues>({
  accept = [],
  control,
  name,
  defaultValue,
  btnProps,
  loading,
  className,
  readonly,
  label,
  labelClassName,
  required,
  previewClassNames,
  ...props
}: Props<T>) => {
  const [progress, setProgress] = useState<number>(0);
  const [url, setUrl] = useState<string | undefined>(undefined);
  const ref = useRef<React.ElementRef<'input'>>(null);

  const { mutate, isLoading } = useMutation(({ formData, onProgress }: { formData: FormData; onProgress: (progress: number) => void }) =>
    uploadSingleFile(formData, onProgress)
  );

  const handleChangeFile = (file: File, onFieldChange: any) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    mutate(
      {
        formData,
        onProgress: (progress) => {
          setProgress(progress);
        },
      },
      {
        onSuccess: (result) => {
          onFieldChange(result.url);
          setUrl(result.url);
        },
        onError: onMutateError,
      }
    );
  };

  const form = useFormContext();
  const value = form.watch(name);
  useEffect(() => {
    if (value) {
      setUrl(value);
    }
  }, [value]);

  return (
    <FormField
      defaultValue={defaultValue}
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => {
        return (
          <FormItem>
            <Show when={!!label}>
              <FormLabel className={cn('font-medium text-[#717171] text-xs uppercase leading-[150%]', labelClassName)}>
                {label} {required && <span className="text-red-500">*</span>}
              </FormLabel>
            </Show>

            <FileUploader
              maxSize={props?.maxSize ?? 25}
              minSize={0.5 / 1024}
              {...props}
              ref={ref}
              hoverTitle="d"
              name="file"
              types={accept.length === 0 ? undefined : accept}
              handleChange={(file: File) => {
                handleChangeFile(file, onChange);
              }}
              onSizeError={(type: string) => {
                if (type === 'File size is too small') {
                  toast.error('Cannot upload files smaller than 1KB !');
                } else {
                  toast.error('The data size must be less than ' + (props?.maxSize ?? 25) + 'MB !');
                }
              }}
              onTypeError={(error: string) => {
                toast.error(error);
              }}
            >
              <VStack align="center" className="!bg-[#F3F3F3] rounded-md border-dotted py-4" spacing={4}>
                {/* <div className="flex h-10 w-10 rounded-lg border border-[#8A51361A] bg-[#8A51360D] shadow-[0px_1px_2px_0px_#1018280D]">
                  <Icons.upload className="m-auto" />
                </div> */}

                <div className="mt-2 text-center text-[#898989] text-sm">
                  <span className="mr-1 font-semibold text-[#131313]">Click to upload</span>
                  or drag and drop <br />
                  PNG or JPEG (max. {props?.maxSize ?? 25} MB)
                </div>

                <Button variant={'outline'} className="mt-3">
                  Select Files
                </Button>

                {/* <div className="text-gray-800 text-sm">DOCX, PDF, CSV or XLSX (max. 25 MB)</div> */}
              </VStack>
            </FileUploader>

            <FormMessage className="mt-1 text-xs" />

            {url && (
              <div
                className={cn('relative mt-2 h-[400px] overflow-hidden rounded md:aspect-[144/40] md:h-auto', previewClassNames?.wrapper)}
              >
                <Image
                  className={cn('object-cover md:aspect-[144/40]', previewClassNames?.image)}
                  alt=""
                  src={url ?? ''}
                  fill
                  sizes="100vh"
                />
                <Button
                  variant={'outline'}
                  className="absolute right-2 bottom-2 bg-white"
                  onClick={() => {
                    form.setValue('banner_url', '', { shouldDirty: true });
                    setUrl('');
                  }}
                >
                  <Icons.trash className="mr-2 text-red-600" />
                  Delete
                </Button>
              </div>
            )}
          </FormItem>
        );
      }}
    />
  );
};

export { UploadButtonField };
