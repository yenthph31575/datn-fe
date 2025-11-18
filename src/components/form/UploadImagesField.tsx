'use client';

import { cn, onMutateError } from '@/libs/common';
import React, { useEffect, useRef, useState } from 'react';
import { type Control, type FieldPath, type FieldPathValue, type FieldValues, useFormContext } from 'react-hook-form';

import { uploadMultiFile } from '@/api/upload/requests';
import type { IUploadResponse } from '@/api/upload/types';
import { Icons } from '@/assets/icons';
import { MAPPING_FILE_ICONS } from '@/libs/mapping-files';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { FileUploader } from 'react-drag-drop-files';
import { toast } from 'react-toastify';
import H4 from '../text/H4';
import type { ButtonProps } from '../ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Progress } from '../ui/progress';
import { HStack, Show, VStack } from '../utilities';

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
  maxFiles?: number;
  onChange?: (files: string[]) => void;
  label?: string;
  required?: boolean;
  labelClassName?: string;
  className?: string;
}

const UploadImagesField = <T extends FieldValues>({
  accept = [],
  control,
  name,
  defaultValue,
  btnProps,
  loading,
  className,
  readonly,
  maxFiles,
  onChange,
  label,
  required,
  labelClassName,
  ...props
}: Props<T>) => {
  const ref = useRef<React.ElementRef<'input'>>(null);
  const [progress, setProgress] = useState<number>(0);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const form = useFormContext();
  const { mutate, isLoading } = useMutation(({ formData, onProgress }: { formData: FormData; onProgress: (progress: number) => void }) =>
    uploadMultiFile(formData, onProgress)
  );

  const handleChangeFile = (e: File[], onFieldChange: any) => {
    if (
      maxFiles &&
      (files?.length > maxFiles || e.length > maxFiles || files.length + e.length > maxFiles || uploadedFiles.length + e.length > maxFiles)
    ) {
      toast.error(`You can only upload a maximum of ${maxFiles} files.`);
      return;
    }
    const formData = new FormData();
    if (e && e.length > 0) {
      const seen = new Set();
      const filesArray = Array.from(e);
      const filteredE = filesArray.filter((file) => {
        const key = `${file.name}-${file.size}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      // const uniqueFiles = filteredE.filter(
      //   (newFile) => !uploadedFiles.some((file) => file.originalName === newFile.name && file.size === newFile.size)
      // );

      // if (e.length > uniqueFiles.length) {
      //   toast.error(`Duplicate name. Please check again!`);
      //   return;
      // }

      // if (uniqueFiles.length === 0) return;

      setFiles(filteredE);

      filteredE.forEach((file) => {
        formData.append('files', file);
      });
      formData.append('folder_name', 'documents');

      mutate(
        {
          formData,
          onProgress: (progress) => {
            setProgress(progress);
          },
        },
        {
          onSuccess: (result) => {
            const combinedFiles = [...result.map((x) => x.url), ...uploadedFiles];
            setUploadedFiles(combinedFiles);
            onChange?.(combinedFiles);
            setFiles([]);
            onFieldChange(combinedFiles);
          },
          onError: onMutateError,
        }
      );
    }
  };

  const handleDeleteFile = (file: string, onChange: any) => {
    const newUploadedFiles = uploadedFiles.filter((x) => x !== file);

    setUploadedFiles(newUploadedFiles);
    onChange(newUploadedFiles);
  };

  const values = form.watch(name);
  useEffect(() => {
    if (values && values?.length > 0) {
      setUploadedFiles(values);
    }
  }, [values]);

  return (
    <FormField
      defaultValue={defaultValue}
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => {
        return (
          <div className="">
            <FormItem>
              <Show when={!!label}>
                <FormLabel className={cn('font-medium text-[#717171] text-xs uppercase leading-[150%]', labelClassName)}>
                  {label} {required && <span className="text-red-500">*</span>}
                </FormLabel>
              </Show>

              <FileUploader
                maxSize={25}
                minSize={1 / 1024}
                {...props}
                ref={ref}
                multiple
                hoverTitle="d"
                name="file"
                types={accept.length === 0 ? undefined : accept}
                handleChange={(files: File[]) => {
                  handleChangeFile(files, onChange);
                }}
                onSizeError={(type: string) => {
                  if (type === 'File size is too small') {
                    toast.error('Cannot upload files smaller than 1KB !');
                  } else {
                    toast.error('Learning data size must be less than ' + (props.maxSize ?? 25) + 'MB !');
                  }
                }}
                onTypeError={(error: string) => {
                  toast.error(error);
                }}
              >
                <VStack align="center" className="rounded-md bg-[#F3F3F3] py-4" spacing={4}>
                  <div className="flex h-10 w-10 rounded-lg border border-[#8A51361A] bg-[#8A51360D] shadow-[0px_1px_2px_0px_#1018280D]">
                    <Icons.upload className="m-auto" />
                  </div>

                  <div className="mt-2 text-gray-800 text-sm">
                    <span className="mr-1 font-semibold text-tertiary-900">Click to upload</span>
                    or drag and drop
                  </div>

                  <div className="text-gray-800 text-sm"> (max. 25 MB)</div>
                </VStack>
              </FileUploader>
              <FormControl></FormControl>

              <FormMessage className="mt-1 text-xs" />
            </FormItem>
            <Show when={files.length > 0 || uploadedFiles.length > 0}>
              <div className="mt-4 grid grid-cols-3 gap-8 rounded-md bg-[#FAFAFA26] py-4">
                <Show when={files.length > 0}>
                  {files.map((file, index) => (
                    <HStack noWrap spacing={24} key={index}>
                      <div className="min-w-[20px]">{(MAPPING_FILE_ICONS as any)?.[file.type]}</div>

                      <VStack className="flex-1" spacing={0}>
                        <HStack spacing={16} noWrap className="">
                          <H4 className="line-clamp-1 flex-1 text-wrap break-all font-semibold text-tertiary-900 lg:text-sm">
                            {file.name}
                          </H4>
                          <span className="mr-6 font-normal text-primary-700 text-sm">
                            {file.size < 1024 * 1024 ? `${Math.ceil(file.size / 1024)} KB` : `${(file.size / (1024 * 1024)).toFixed(2)} MB`}
                          </span>
                        </HStack>
                        <HStack noWrap spacing={16}>
                          <Progress value={(file as any)?.is_uploaded ? 100 : progress} className="h-1" />
                          <span className="text-tertiary-900">{(file as any)?.is_uploaded ? 100 : progress}%</span>
                        </HStack>

                        <HStack pos="center">
                          <button type="button">
                            <Icons.trash />
                          </button>
                        </HStack>
                      </VStack>
                    </HStack>
                  ))}
                </Show>

                <Show when={uploadedFiles.length > 0}>
                  {uploadedFiles.map((file, index) => (
                    <HStack noWrap spacing={24} key={index}>
                      {/* <div>{(MAPPING_FILE_ICONS as any)?.[file.mimeType]}</div> */}
                      <VStack className="flex-1" spacing={8}>
                        {/* <HStack spacing={16} noWrap className="">
                          <H4 className="line-clamp-1 flex-1 text-wrap break-all font-semibold text-tertiary-900 lg:text-sm">
                            {file.originalName}
                          </H4>
                          <span className="mr-6 font-normal text-primary-700 text-sm">
                            {file.size < 1024 * 1024 ? `${Math.ceil(file.size / 1024)} KB` : `${(file.size / (1024 * 1024)).toFixed(2)} MB`}
                          </span>
                        </HStack> */}

                        <HStack noWrap spacing={16}>
                          <Progress value={100} className="h-1" />
                          <span className="text-grey-600">{100}%</span>
                        </HStack>

                        <HStack pos="center">
                          <Image
                            src={file || '/images/no-image.svg'}
                            alt=""
                            width={100}
                            height={100}
                            className="h-28 w-28 rounded border"
                          />
                        </HStack>
                        <HStack pos="center">
                          <button onClick={() => handleDeleteFile(file, onChange)} type="button">
                            <Icons.trash />
                          </button>
                        </HStack>
                      </VStack>
                    </HStack>
                  ))}
                </Show>
              </div>
            </Show>
          </div>
        );
      }}
    />
  );
};

export { UploadImagesField };
